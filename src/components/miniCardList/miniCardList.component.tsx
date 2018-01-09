import * as lodash from 'lodash';
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigable } from 'HOC';
import { Card, EaAPI, RelationModule, Duple, Single } from 'Services';
import { MiniCard, MoreRelations, NavigableBanner } from 'Components';

import { IUIActions, /*UserActions*/ IUserActions, UIActions } from "Actions";
import { CardRender, ICardAndRelations, ICardRelation } from 'Reducers';
import { FilterTypeEnum } from 'Constants';

declare const DiveAPI: EaAPI;

export interface IMiniCardListState {
  elements: Array<CardRender>;
  movieId: string | undefined;
  wasSelectedOnChangeScene: boolean;
  idx?: number;
  getMovieTime: () => void;
  activeFilter: FilterTypeEnum,
  sceneCount: number,
}

export interface IMiniCardListMethods {
  clickAction?: any;
  setSelectedOnSceneChange?: any;
  setNodeById?: (idx: number) => any;
}

type MiniCardListProps = IMiniCardListState & IMiniCardListMethods &
  { uiActions: IUIActions, userActions: IUserActions };

export class MiniCardListClass extends React.Component<MiniCardListProps, {}> {

  public shouldComponentUpdate(nextProps: MiniCardListProps) {
    //Si cambia de escena
    if (this.props.sceneCount !== nextProps.sceneCount) {
      return true;
    }

    if (typeof this.props.elements !== typeof nextProps.elements) {
      // Si no son del mismo tipo los elementos entrantes de los que hay
      return true;
    } else if (nextProps.elements && nextProps.elements.length !== this.props.elements.length) {
      //Si hay distinto número de elementos
      return true;
    } else if (nextProps.activeFilter !== this.props.activeFilter) {
      //Si cambia el filtro
      return true;
    }
    return false;
  }

  public componentDidMount() {
    this.SetIfSelected();
  }

  public SetIfSelected() {
    if (this.props.wasSelectedOnChangeScene && this.props.elements.length > 0) {
      if (this.props.setNodeById && this.props.idx) {
        this.props.setNodeById(this.props.idx);
      }
      if (this.props.setSelectedOnSceneChange !== undefined) {
        this.props.setSelectedOnSceneChange(false);
      }
      this.forceUpdate();
    }
  }

  public componentWillUnmount() {
    if (ReactDOM.findDOMNode(this).querySelector(".childFocused")) {
      // Check if prop is present, it is missing on allRelations > MinicardList for example.
      if (this.props.setSelectedOnSceneChange) {
        this.props.setSelectedOnSceneChange(true);
      }
    }
  }

  public componentDidUpdate(prevProps: MiniCardListProps) {
    this.SetIfSelected();
  }

  public getRelations = (card: Card): Card[] => {
    const rels: Card[] = [];
    const limit = 3;
    if (card.relations instanceof Array) {
      // card.relations.map((el: Single | Duple, index: number) => {
      for (const el of card.relations) {
        const rel = el as Single | Duple;
        // console.log("[MiniCardList][getRelations]: ", rel);
        switch (rel.content_type) {
          case 'home_deco':
            const relSingle = el as Single;
            rels.push(...relSingle.data);
            break;
          case 'wears':
            // console.log("[MiniCardList][getRelations]wears: ", rel);
            break;
        }
      }
    }
    return rels;
  }

  public render() {
    // console.log("[MiniCardList][render]");
    // console.log("Elements: ", this.props.elements);
    const cardsToRender = lodash.uniqBy(this.props.elements, "card_id");
    let navIndex = 0;
    let bannerShown = false;
    const cardsToShow: JSX.Element[] = [];
    for (let i = 0; i < cardsToRender.length; i++) {
      const sceneCard = cardsToRender[i];
      cardsToShow.push(this.element({
        el: sceneCard,
        count: cardsToRender.length,
        index: navIndex++,
        parent,
      }));
      if (sceneCard.banner && !bannerShown) {
        bannerShown = true;
        cardsToShow.push(
          <NavigableBanner
            data={sceneCard.banner}
            parent={this}
            forceFirst={true}
            forceOrder={navIndex++}
            isScrollable={true}
            clickAction={() => {
              window.open(sceneCard.banner.link_url, '_blank');
            }}
            scrollPadding={400}
            navClass="scrollable bannerContainer"
          />,
        );
      }
    }
    return (
      <ul className="miniCardList" >
        {cardsToShow}
      </ul >
    );
  }

  private element(params: {
    el: CardRender,
    count: number, index: number, parent: any,
  }): JSX.Element {
    const { el, count, index, parent } = params;
    const cardRender: CardRender = params.el;

    if (cardRender.type !== "moreRelations") {
      const card = cardRender as ICardRelation;
      return (
        <MiniCard
          focusChainClass="childFocused"
          activeGroupClass="activeGroup"
          // tslint:disable-next-line:max-line-length
          groupName={card.parentId != null ? (card.parentId + '' + card.version).toString() : (card.card_id + '' + card.version).toString()}
          element={card}
          parent={this}
          forceFirst={true}
          forceOrder={index}
          clickActionMore={this.clickActionMore.bind(this)(card)}
          clickActionLike={this.clickActionLike.bind(this)(card)}
          // trackVisibility={this.trackVisibility.bind(this)(card)}
          onFocusCallback={this.onFocusCallback.bind(this)(card)}
          key={card.card_id + '#' + card.version + this.props.sceneCount}
          id={card.card_id + '#' + card.version}
          isScrollable={true}
          scrollPadding={100}
          navClass="scrollable"
        />);

    } else {
      const moreRelations = cardRender as ICardAndRelations;
      const actionOnClick = () => {
        this.clickMoreRelations(moreRelations);
      };
      return (<MoreRelations
        parent={this}
        focusChainClass="childFocused moreRelations"
        groupName={(moreRelations.card.card_id + '' + moreRelations.card.version).toString()}
        activeGroupClass="activeGroup"
        forceFirst={true}
        forceOrder={index}
        key={
          // tslint:disable-next-line:max-line-length
          moreRelations.card.card_id + '#' + moreRelations.card.version + '&moreRelations' + moreRelations.cards.length
        }
        isScrollable={true}
        scrollPadding={100}
        navClass="scrollable"
        clickAction={actionOnClick}
      />);
    }
  }

  private clickMoreRelations(card: ICardAndRelations) {

    if (!card) {
      return;
    }
    this.props.uiActions.openAllRelations(card);
  }

  private clickActionLike(originalCard: Card) {
    return (paramCard: Card) => {
      const card = paramCard || originalCard;
      if (!card) {
        return;
      }
      // tslint:disable-next-line:no-console
      this.props.userActions.likeCard(card)
        .then(() => {
          console.log("Liked success");
        });
      // TODO: Check if device or user account
      /*
      DiveAPI.postLikes({ cardId: card.card_id })
          .then(() => {
              // TODO: Bottom message "Liked" ? or just change the icon?;
          })
          .catch((e) => {
              switch (e.status) {
                  case 403:
                      // TODO: Go to login
                      console.warn("GO TO LOGIN");
                      break;
                  default:
                      console.error("Error saving card", e);
                      break;
              }
          });
      */
    };
  }

  private clickActionMore(originalCard: Card) {
    return (paramCard: Card) => {
      const card = paramCard || originalCard;
      if (!card) {
        return;
      }
      this.props.uiActions.openCard(card, "offmovie", true);
    };
  }

  private onFocusCallback(originalCard: Card) {
    return (paramCard: Card) => {
      const card = paramCard || originalCard;
    };
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // userActions: bindActionCreators(UserActions, dispatch),
    uiActions: bindActionCreators(UIActions, dispatch),
  };
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
  return { ...stateProps, ...ownProps, ...dispatchProps };
};

export const MiniCardList = connect(
  undefined,
  mapDispatchToProps,
  mergeProps,
  { withRef: true },
)(navigable(MiniCardListClass));
