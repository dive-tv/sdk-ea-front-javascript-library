import * as React from 'react';
import { connect, MapDispatchToPropsObject } from 'react-redux';
import { bindActionCreators } from "redux";

import { navigable, INavigableProps } from 'HOC';
import { Loading, NavigationContainer, MiniCardList, DropDownList, CarouselButtonsContainer } from 'Components';
import { IState, ISyncState, INavState, CardRender, ICardRelation, ICardAndRelations } from 'Reducers';
import { SyncActions, ISyncActions, UIActions, IUIActions, INavActions } from 'Actions';
import { Localize, Card, RelationModule, CardTypeEnum } from 'Services';
import { SUPPORTED_CARD_TYPES, FilterTypeEnum, LIMIT_FOR_RELATIONS } from 'Constants';
import { BottomOverlayMessage } from "Containers";

export class CarouselClass
    extends React.Component<{ state: ISyncState } & ISyncActions & INavigableProps & INavState & INavActions &
    { uiActions: MapDispatchToPropsObject }, { rewinded: boolean }> {
    private interval: any;
    private chunkRequested: boolean = false;
    private activeFilters: any[];
    private currentSceneText = Localize("CURRENT_SCENE");
    constructor(props: any) {
        super(props);
        this.state = { rewinded: false };
        this.closeCarousel = this.closeCarousel.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
    }

    public componentWillUpdate(nextProps: Readonly<{ state: ISyncState; }
        & ISyncActions & INavigableProps & INavState>) {
        /*if (nextProps.state.type === "SOCKET" && nextProps.state.socketStatus !== this.props.state.socketStatus
            && nextProps.state.socketStatus === 'CONNECTED') {
            this.props.dataSync(nextProps.state.movieId);
        }*/
    }

    public componentWillMount() {
        this.props.syncChannel();
    }

    public componentWillUnmount() {
        // this.props.setSelectedOnSceneChange(false);
        // console.log("CAROUSEL componentWillUnmount");
        // this.props.deleteNode(this.props.idx);
    }

    public getState = (): ISyncState => {
        return this.props.state;
    }

    public render(): any {
        let cards: CardRender[] = this.props.state.cards !== undefined ? this.props.state.cards : [];

        cards = this.performFilter(cards);

        return (
            <div className="containerCarousel fillParent">
                <CarouselButtonsContainer
                    key='CAROUSEL_BUTTONS'
                    parent={this}
                    columns={1}
                    forceFirst={true}
                    movieId={this.getState().movieId}
                    filter={this.props.state.filter}
                    setFilter={this.setFilter.bind(this)}
                    closeCarousel={this.closeCarousel.bind(this)}
                />
                <div className="cards">
                    {
                        cards.length === 0 ?
                            <Loading /> :
                            <MiniCardList
                                elements={cards}
                                movieId={this.getState().movieId}
                                getMovieTime={this.getCurrentTime}
                                parent={this}
                                columns={1}
                                name="miniCardListCarousel"
                                //key={"carouselList"}
                                groupName="MiniCardList"
                                activeFilter={this.props.state.filter}
                                setSelectedOnSceneChange={this.props.setSelectedOnSceneChange}
                                wasSelectedOnChangeScene={this.props.state.selectedOnSceneChange}
                            />
                    }
                </div>
                {this.getMessageForCarousel()}
            </div >
        );
    }

    private getCurrentTime() {
        return this.props.state.currentTime;
    }

    private performFilter(cards: CardRender[]): CardRender[] {

        //console.log("filter ---->", this.props.state.filter);

        const otherFilter: CardTypeEnum[] = ["historic", "home", "technology", "art", "weapon", "leisure_sport", "health_beauty", "food_drink", "fauna_flora", "business"]
        // dependiendo del filtro activo se utilizan distintos tipos para el filtrado
        switch (this.props.state.filter) {
            case FilterTypeEnum.CastAndCharacter:
                return this.filterCards(cards, ["character", "person"]);
            case FilterTypeEnum.FashionAndBeauty:
                return this.filterCards(cards, ["character", "person"], true, ["fashion"]);
            case FilterTypeEnum.Music:
                return this.filterCards(cards, ["song", "ost"]);
            case FilterTypeEnum.PlacesAndTravel:
                return this.filterCards(cards, ["location"]);
            case FilterTypeEnum.CarsAndMore:
                return this.filterCards(cards, ["vehicle"]);
            case FilterTypeEnum.FunFacts:
                return this.filterCards(cards, ["trivia", "reference", "quote"]);
            case FilterTypeEnum.Other:
                return this.filterCards(cards, otherFilter);
        }

        return cards;
    }

    private filterCards(cards: CardRender[], type: CardTypeEnum[], obligatoryChildren: boolean = false, relationType?: CardTypeEnum[]): CardRender[] {

        const filterdCards: CardRender[] = [];
        var parentCard: CardRender | undefined = undefined;
        var childrenCount: number = 0;

        for (let card of cards) {

            const cardRelation: ICardAndRelations = card as ICardAndRelations;

            // si no tiene cards significa que es una card normal
            if (!cardRelation.cards) {

                const cardRelation: ICardRelation = card as ICardRelation;
                // si es un card
                if (!cardRelation.parentId && type.indexOf(cardRelation.type) > -1) {

                    // en caso de que la card anterior este guardada se pushea al array para no perderla. Si obligatory children es true se comprueba que esa card tiene relaciones validas
                    if ((!obligatoryChildren && parentCard) || (parentCard && obligatoryChildren && childrenCount !== 0)) {
                        filterdCards.push(parentCard);
                    }

                    // se guarda la card
                    parentCard = cardRelation;
                    childrenCount = 0;
                    continue;

                    // si es una relacion
                } else if ((cardRelation.parentId && relationType && relationType.indexOf(cardRelation.type) > -1)) {

                    if (parentCard) {
                        filterdCards.push(parentCard);
                        parentCard = undefined;
                    }

                    filterdCards.push(cardRelation);
                    childrenCount++;
                    continue;
                }

                // Es una card de "ver mas", solo se muestra si el numero de relacciones es igual al limite de cards. Se comprueba 
                // por si hay relaciones de distinto tipo del que se quiere filtrar
            } else if (childrenCount === LIMIT_FOR_RELATIONS) {

                // se filtran las cards del ver mas por el tipo filtrado
                cardRelation.cards = cardRelation.cards.filter((el: Card) => relationType.indexOf(el.type) > -1)
                filterdCards.push(cardRelation);
            }
        }

        if ((!obligatoryChildren && parentCard) || (parentCard && obligatoryChildren && childrenCount !== 0)) {
            //console.log("append parentCard", parentCard)
            filterdCards.push(parentCard);
        }
        //console.log("filtered cards ---->", filterdCards)

        return filterdCards;
    }

    private setFilter(filterName: FilterTypeEnum) {
        this.props.changeFilter(filterName);
    }

    private closeCarousel() {
        //this.props.uiActions.open({ top: "TV", bottom: "GRID" });

        this.props.uiActions.goBack();
    }

    private getMessageForCarousel() {
        let messageContent: boolean = false;
        const channelStatus = this.getState().channelStatus;
        if (this.props.state.showInfoMsg) {

            switch (channelStatus) {
                case "paused":
                case "end":
                case "off":
                case "ready":
                    messageContent = true;
                    break;
            }
        }

        // TODO: Message Logic
        // Show message only if not has been closed before,
        // and if the carousel its synced on the correct time (not rewind)
        if (messageContent /*&& onTime && !messageDiscarded*/) {
            return (
                <BottomOverlayMessage
                    key={`bottomMessage#${this.props.state.timeMovieSynced}#${channelStatus}`}
                    closeInfoMsg={this.props.closeInfoMsg}
                    parent={this}
                    columns={1}
                    channelStatus={channelStatus}
                    modal={true}
                    isDefault={true}
                    navClass={"pauseContainer"}
                    navigationParent={this}>
                    {messageContent}
                </BottomOverlayMessage>
            );
        }
    }
}

const mapStateToProps = (state: IState): { state: ISyncState } => ({ state: { ...state.carousel } });
const mapDispatchToProps = (dispatch: any): any => {
    return {
        ...bindActionCreators(SyncActions, dispatch),
        uiActions: bindActionCreators(UIActions, dispatch),
    };
};

export const Carousel = navigable(connect(
    mapStateToProps,
    mapDispatchToProps,
)(CarouselClass));
