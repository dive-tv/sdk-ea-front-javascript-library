import * as React from 'react';
import * as ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigable } from 'HOC';
import { Card, DiveAPIClass, RelationModule, Duple, Single } from 'Services';
import { MiniCard, MoreRelations } from 'Components';
import { IUIActions, /*UserActions*/ IUserActions, UIActions } from "Actions";
import { CardRender, ICardAndRelations, ICardRelation } from 'Reducers';

declare const DiveAPI: DiveAPIClass;

export interface IMiniCardListState {
    elements: Array<CardRender>;
    movieId: string | undefined;
    wasSelectedOnChangeScene: boolean;
    idx?: number;
    getMovieTime: () => void;
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
        if (typeof this.props.elements !== typeof nextProps.elements) {
            return true;
        } else if (nextProps.elements && nextProps.elements.length !== this.props.elements.length) {
            return true;
        }
        return false;
    }

    public componentWillUpdate(nextProps: MiniCardListProps) {
        // console.log("[MiniCard][componentWillUpdate] ", nextProps);
        // Esto es para que en el cambio de escena, si el foco está en alguna minicard, se cargue la nueva escena
        // seleccionando el primer elemento.
        if (this.props.wasSelectedOnChangeScene) {
            if (this.props.setNodeById && this.props.idx) {
                this.props.setNodeById(this.props.idx);
            }

            if(this.props.elements.length > 0 && nextProps.elements.length === 0){
                if (ReactDOM.findDOMNode(this).querySelector(".childFocused")) {
                    this.props.setSelectedOnSceneChange(true);
                }
            }
            

            if (this.props.setSelectedOnSceneChange !== undefined && this.props.elements.length === 0 && nextProps.elements.length > 0) {
                this.props.setSelectedOnSceneChange(false);
            }
        }
    }

    public getRelations = (card: Card): Card[] => {
        const rels: Card[] = [];
        const limit = 3;
        if (card.relations instanceof Array) {
            // card.relations.map((el: Single | Duple, index: number) => {
            for(const el of card.relations){
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
            };
        }
        return rels;
    }

    public render() {
        // console.log("Elements: ", this.props.elements);
        return (
            <ul className="miniCardList" >
                {
                    this.props.elements.map(
                        (sceneCard: CardRender, i: number, sceneCards: CardRender[]) => {
                            return this.element({
                                el: sceneCard,
                                count: sceneCards.length,
                                index: i,
                                parent,
                            });
                        },
                    )
                }
            </ul >
        );
    }

    /*public componentWillUnmount() {
        if (ReactDOM.findDOMNode(this).querySelector(".childFocused")) {
            this.props.setSelectedOnSceneChange(true);
        }
    }*/

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
                    groupName={card.parentId != null ? (card.parentId + '' + card.version).toString() : (card.card_id + '' + card.version).toString()}
                    element={card}
                    parent={this}
                    forceFirst={true}
                    forceOrder={index}
                    clickActionMore={this.clickActionMore.bind(this)(card)}
                    clickActionLike={this.clickActionLike.bind(this)(card)}
                    // trackVisibility={this.trackVisibility.bind(this)(card)}
                    onFocusCallback={this.onFocusCallback.bind(this)(card)}
                    key={card.card_id + '#' + card.version}
                    id={card.card_id + '#' + card.version}
                    isScrollable={true}
                    // scrollPadding={100}
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
            this.props.uiActions.openCard(card.card_id, "offmovie");
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
