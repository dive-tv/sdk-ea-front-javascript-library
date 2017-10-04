import * as React from 'react';
import { connect, MapDispatchToPropsObject } from 'react-redux';
import { bindActionCreators } from "redux";

import { navigable, INavigableProps } from 'HOC';
import { Loading, NavigationContainer, MiniCardList, DropDownList } from 'Components';
import { IState, ISyncState, INavState, CardRender, ICardRelation, ICardAndRelations } from 'Reducers';
import { SyncActions, ISyncActions, UIActions, IUIActions } from 'Actions';
import { Localize, Card, RelationModule, CardTypeEnum } from 'Services';
import { SUPPORTED_CARD_TYPES, FilterTypeEnum, LIMIT_FOR_RELATIONS } from 'Constants';
import { BottomOverlayMessage } from "Containers";

export class CarouselClass
    extends React.PureComponent<{ state: ISyncState } & ISyncActions & INavigableProps & INavState &
    { uiActions: MapDispatchToPropsObject }, { rewinded: boolean }> {
    private interval: any;
    private chunkRequested: boolean = false;
    private buttonsContainer: any;
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
    }

    public getState = (): ISyncState => {
        return this.props.state;
    }

    public render(): any {
        let cards: CardRender[] = this.props.state.cards !== undefined ? this.props.state.cards : [];

        cards = this.performFilter(cards);

        return (
            <div className="containerCarousel fillParent">
                <NavigationContainer key="buttonContainer"
                    ref={(el: any) => { if (el) { this.buttonsContainer = el.getWrappedInstance().refComponent; } }}
                    propagateParent={false}
                    parent={this}
                    forceFirst={true}
                    columns={1}>
                    {this.buttonsContainer ? this.getButtons() : ""}
                </NavigationContainer>
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

        console.log("filter ---->", this.props.state.filter);

        const otherFilter : CardTypeEnum[]  = ["historic", "home", "technology", "art", "weapon", "leisure_sport", "health_beauty", "food_drink", "fauna_flora", "business"]

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

    private filterCards(cards: CardRender[], type: CardTypeEnum [], obligatoryChildren: boolean = false, relationType?: CardTypeEnum []): CardRender[] {

        const filterdCards: CardRender[] = [];
        var parentCard: CardRender | undefined = undefined;
        var childrenCount: number = 0;

        for (let card of cards) {

            const cardRelation: ICardAndRelations = card as ICardAndRelations;

            if (!cardRelation.cards) {

                const cardRelation: ICardRelation = card as ICardRelation;
                if (!cardRelation.parentId && type.indexOf(cardRelation.type) > -1) {

                    if ((!obligatoryChildren && parentCard) || (parentCard && obligatoryChildren && childrenCount !== 0)) {
                        filterdCards.push(parentCard);
                    }

                    parentCard = cardRelation;
                    childrenCount = 0;
                    continue;

                } else if ((cardRelation.parentId && relationType && relationType.indexOf(cardRelation.type) > -1)) {

                    if (parentCard) {
                        filterdCards.push(parentCard);
                        parentCard = undefined;
                    }

                    filterdCards.push(cardRelation);
                    childrenCount++;
                    continue;
                }

            } else if (childrenCount === LIMIT_FOR_RELATIONS) {
                
                
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

    private getButtons(): JSX.Element {
        let currentTimeInSecs = this.props.state.currentTime;
        const hours = Math.floor(currentTimeInSecs / 3600);
        currentTimeInSecs %= 3600;
        const minutes = Math.floor(currentTimeInSecs / 60);
        const seconds = parseInt((currentTimeInSecs % 60).toFixed(0), 10);

        let buttonCount = 7;
        if (0) { // TODO: Check if prev button needed
            buttonCount--;
        }
        if (0) { // TODO: Check if next button needed
            buttonCount--;
        }
        if (this.state.rewinded === false) {
            buttonCount--;
        }
        const timeFormatted = `${hours < 10 ? "0" + hours : hours}:`
            + `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        const buttonsToRender = [];
        buttonsToRender.push(<NavigationContainer key="carouselClose" className="carouselButton bctButton close"
            parent={this.buttonsContainer}
            onClick={this.closeCarousel}
        >
        </NavigationContainer>);

        const elements: string[] = [];
        let selectedItem: string = "";

        for (let item in FilterTypeEnum) {

            if (FilterTypeEnum[item]  === this.props.state.filter) {
                selectedItem = FilterTypeEnum[item];
            }
            
            elements.push(FilterTypeEnum[item]);
        }

        buttonsToRender.push(<DropDownList
            key={"dropdown#" + this.getState().movieId}
            elements={elements}
            selectedItem={selectedItem}
            activeGroupClass="dropDownActive"
            groupName="dropDownFilter"
            parent={this.buttonsContainer}
            //nameForNode="miniCardListCarousel"
            setElement={this.setFilter.bind(this)}
        />);


        return (
            <div id="carouselButtons" className="bottomContainerTopButtons">
                {buttonsToRender}
            </div>);
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
