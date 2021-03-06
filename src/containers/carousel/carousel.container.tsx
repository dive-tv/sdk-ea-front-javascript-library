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
import classNames = require('classnames');

// tslint:disable-next-line:no-namespace
export namespace Carousel {
  export interface IOwnProps {
    state: ISyncState;
  }

  export interface IActionProps {
    syncActions: ISyncActions;
    uiActions: MapDispatchToPropsObject;
  }

  export interface IState {
    rewinded: boolean;
    numCardsShown: number;
  }

  export type IAllProps = Carousel.IOwnProps & Carousel.IActionProps & INavigableProps & INavState & INavActions;
}

export class CarouselClass
  extends React.Component<Carousel.IAllProps, Carousel.IState> {
  private interval: any;
  private chunkRequested: boolean = false;
  private activeFilters: any[];
  private currentSceneText = Localize("CURRENT_SCENE");
  constructor(props: any) {
    super(props);
    this.state = { rewinded: false, numCardsShown: -1 };
    this.closeCarousel = this.closeCarousel.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);
  }

  public getState = (): ISyncState => {
    return this.props.state;
  }

  public componentWillUpdate(nextProps: Carousel.IOwnProps) {
    const nextCount: number = nextProps.state.cards.length;
    const count: number = this.props.state.cards.length;
    if (nextCount > count && count > 7) {
      this.setState({ ...this.state, numCardsShown: nextCount - count + this.state.numCardsShown });
      if (this.interval !== null) {
        clearTimeout(this.interval);
        this.interval = setTimeout(() => {
          clearTimeout(this.interval);
          this.setState({ ...this.state, numCardsShown: 0 });
          this.interval = setTimeout(() => {
            this.setState({ ...this.state, numCardsShown: -1 });
          }, 1000);
        }, 4000);
      }
    }

  }

  public render(): any {
    // console.log("[Carousel][render]");
    let cards: CardRender[] = this.props.state.cards !== undefined ? this.props.state.cards : [];

    cards = this.performFilter(cards);

    const newCardsClass = classNames({
      newCardText: true,
      show: this.state.numCardsShown > 0,
      hide: this.state.numCardsShown === 0,
    });
    return (
      <div className="containerCarousel fillParent customBkg">
        <CarouselButtonsContainer
          key='CAROUSEL_BUTTONS'
          parent={this}
          columns={1}
          forceFirst={true}
          showCloseButton={false}
          movieId={this.getState().movieId}
          filter={this.props.state.filter}
          setFilter={this.setFilter.bind(this)}
          closeCarousel={this.closeCarousel.bind(this)}
          navClass="carouselButtonsContainer"
          dropDownOpened={(val?: boolean) => this.props.syncActions.dropDownOpened(val)}
          dropDownState={this.getState().dropDownCarouselState}
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
                sceneCount={this.props.state.sceneCount}
                name="miniCardListCarousel"
                // key={"carouselList"}
                key={"carouselList_" + this.props.state.sceneCount}
                groupName="MiniCardList"
                activeFilter={this.props.state.filter}
                setSelectedOnSceneChange={this.props.syncActions.setSelectedOnSceneChange}
                wasSelectedOnChangeScene={this.props.state.selectedOnSceneChange}
              />
          }
        </div>
        {this.state.numCardsShown >= 0 ?
          <div className={newCardsClass}>
            {`${this.state.numCardsShown} ${Localize('NEW_CARDS')}`}
          </div>
          : null}

        {this.getMessageForCarousel()}
      </div >
    );
  }
  /*
    public shouldComponentUpdate(nextProps: Carousel.IAllProps, nextState: Carousel.IState): boolean {
      if ((this.props.state.cards.length !== nextProps.state.cards.length || this.props.state.filter !== nextProps.state.filter) || nextProps.state.cards.length === 0) {
        return true;
      }
      return false;
    }
  */
  private getCurrentTime() {
    return this.props.state.currentTime;
  }

  private performFilter(cards: CardRender[]): CardRender[] {

    // console.log("filter ---->", this.props.state.filter);

    const otherFilter: CardTypeEnum[] = [
      "historic", "home", "technology", "art",
      "weapon", "leisure_sport", "health_beauty",
      "food_drink", "fauna_flora", "business",
    ];
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

  private filterCards(
    cards: CardRender[], type: CardTypeEnum[], obligatoryChildren: boolean = false, relationType?: CardTypeEnum[],
  ): CardRender[] {

    const filterdCards: CardRender[] = [];
    let parentCard: CardRender | undefined;
    let childrenCount: number = 0;

    for (let card of cards) {

      const cardRelation: ICardAndRelations = card as ICardAndRelations;

      // si no tiene cards significa que es una card normal
      if (!cardRelation.cards) {

        const cardRelation: ICardRelation = card as ICardRelation;
        // si es un card
        if (!cardRelation.parentId) {

          // en caso de que la card anterior este guardada se pushea al array para no perderla
          // en caso de que no sea obligatorio tener relacciones asociadas.
          if (!obligatoryChildren && parentCard && childrenCount === 0) {
            filterdCards.push(parentCard);
          }

          // es de tipo valido
          if (type.indexOf(cardRelation.type) > -1) {
            // se guarda la card
            parentCard = cardRelation;
            childrenCount = 0;
          } else if (parentCard) {
            parentCard = undefined;
          }
          // si es una relacion y hay un parent card
        } else if (
          parentCard && cardRelation.parentId && relationType && relationType.indexOf(cardRelation.type) > -1
        ) {

          if (parentCard && childrenCount === 0) {
            filterdCards.push(parentCard);
          }

          filterdCards.push(cardRelation);
          childrenCount++;
        }

        // Es una card de "ver mas",
        // solo se muestra si el numero de relacciones es igual al limite de cards. Se comprueba
        // por si hay relaciones de distinto tipo del que se quiere filtrar
      } else if (childrenCount === LIMIT_FOR_RELATIONS) {

        // se filtran las cards del ver mas por el tipo filtrado
        cardRelation.cards = cardRelation.cards.filter((el: Card) => relationType.indexOf(el.type) > -1);
        filterdCards.push(cardRelation);
      }
    }

    if (!obligatoryChildren && parentCard && childrenCount === 0) {
      filterdCards.push(parentCard);
    }

    return filterdCards;
  }

  private setFilter(filterName: FilterTypeEnum) {
    this.props.syncActions.changeFilter(filterName);
  }

  private closeCarousel() {
    // this.props.uiActions.open({ top: "TV", bottom: "GRID" });
    // this.props.uiActions.goBack();
    // this.props.syncActions.closeSocket();

    this.props.uiActions.open({
      bottom: 'HIDE',
    });
  }

  private getMessageForCarousel() {
    let messageContent: boolean = false;
    const channelStatus = this.getState().channelStatus;
    if (this.props.state.showInfoMsg) {

      switch (channelStatus) {
        // case "paused":
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

const mapStateToProps = (state: IState): { state: ISyncState } => ({ state: { ...state.sync } });
const mapDispatchToProps = (dispatch: any): any => {
  return {
    syncActions: bindActionCreators(SyncActions, dispatch),
    uiActions: bindActionCreators(UIActions, dispatch),
  };
};

export const Carousel = navigable(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarouselClass));
