import * as React from 'react';
import * as ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { navigable } from 'HOC';
import { Card, DiveAPIClass, RelationModule, Duple, Single } from 'Services';
import { MiniCard, MoreRelations } from 'Components';
import { IUIActions, /*UserActions*/ IUserActions, UIActions } from "Actions";

declare const DiveAPI: DiveAPIClass;

export interface IMiniCardListState {
    elements: Array<Card | RelationModule>;
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
            if (this.props.setSelectedOnSceneChange !== undefined && this.props.elements.length > 0) {
                this.props.setSelectedOnSceneChange(false);
            }
        }
    }

    public render() {
        // console.log("Elements: ", this.props.elements);
        return (
            <ul className="miniCardList" >
                {
                    this.props.elements.map(
                        (sceneCard: Card, i: number, sceneCards: Card[]) => {
                            return this.element({
                                el: sceneCard,
                                key: sceneCard.card_id + '#' + sceneCard.version,
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

    private element(params: {
        el: Card, key: number | string,
        count: number, index: number, parent: any,
    }): JSX.Element {
        const { el, key, count, index, parent } = params;
        const card: Card = params.el;

        let result: JSX.Element = (
            <MiniCard
                focusChainClass="childFocused"
                activeGroupClass="activeGroup"
                groupName={(el.card_id + '' + el.version).toString()}
                element={card}
                parent={this}
                forceFirst={true}
                forceOrder={index}
                clickActionMore={this.clickActionMore.bind(this)(card)}
                clickActionLike={this.clickActionLike.bind(this)(card)}
                // trackVisibility={this.trackVisibility.bind(this)(card)}
                onFocusCallback={this.onFocusCallback.bind(this)(card)}
                key={card.card_id + '#' + card.version}
                id={`${key}`}
                isScrollable={true}
                // scrollPadding={100}
                navClass="scrollable"
            />);

        return result;

        // return (<MoreRelations
        //         parent={this}
        //         focusChainClass="childFocused moreRelations"
        //         forceFirst={true}
        //         forceOrder={index}
        //         onFocusCallback={this.onFocusCallback.bind(this)(card)}
        //         key={card.card_id + '#' + card.version}
        //         isScrollable={true}
        //         navClass="scrollable"
        // />);
    }

    private clickActionLike(originalCard: Card) {
        return (paramCard: Card) => {
            const card = paramCard || originalCard;
            if (!card) {
                return;
            }
            // tslint:disable-next-line:no-console
            console.log("LIKE", card.card_id);
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
            console.log("Card clicked", card);
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
