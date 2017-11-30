import { ICardAndRelations } from './../reducers/sync.reducer';
import { IUIAction } from './../reducers/ui.reducer';
import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction } from 'redux-actions';

import { UIActionTypes, IUIGroup, ICardRelation, IBanner } from 'Reducers';
import { Card, EaAPI } from "Services";

declare const DiveAPI: EaAPI;

export interface ICardWithBanner extends Card {
    banner?: IBanner;
}

export interface IUIActions extends MapDispatchToPropsObject {
    goBack: ActionCreator<IUIAction>;
    openCard: ActionCreator<void>;
    closeCard: ActionCreator<IUIAction>;
    performOpenCard: ActionCreator<IUIAction>;
    openSync: ActionCreator<IUIAction>;
    open: ActionCreator<void>;
    addTestCards: ActionCreator<IUIAction>;
    openAllRelations: ActionCreator<IUIAction>;
    setDivider: ActionCreator<IUIAction>;
}

//
//  Action Creators
//
export const uiCreateAction = (type: UIActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
    return createAction(type, payload);
};

export const UIActions: IUIActions = {
    goBack: uiCreateAction("UI/UI_BACK", () => (0)),
    setDivider: uiCreateAction("UI/SET_DIVIDER", (divider: number) => (divider)),
    openCard: (requestedCard: Card, relations: string, first?: boolean) => (dispatch: any) => {
        const cardId = requestedCard.card_id;
        if (cardId && cardId.length > 0) {
            dispatch(UIActions.performOpenCard());
        }
        if (first) {
            dispatch(UIActions.open({ top: undefined, bottom: "CARD" }));
        }
        DiveAPI.getCard({ cardId })
            .then((card: Card) => {
                let cardWidthBanners = card;
                if ((requestedCard as ICardWithBanner).banner) {
                    (card as ICardWithBanner).banner = (requestedCard as ICardWithBanner).banner;
                }
                dispatch(UIActions.performOpenCard(card));
            })
            .catch((error: any) => {
                console.error("Error getting card", error);
                // TODO: display error?
            });
        // dispatch(UIActions.performOpenCard({ card_id: cardId }));
    },
    closeCard: uiCreateAction("UI/CLOSE_CARD"),
    performOpenCard: uiCreateAction("UI/OPEN_CARD", (card: Card) => (card)),
    openSync: uiCreateAction("UI/OPEN_SYNC"),
    open: (group: IUIGroup) => (dispatch: any) => {
        dispatch(UIActions.performOpen(group));
    },
    performOpen: uiCreateAction("UI/OPEN", (group: IUIGroup) => (group)),
    addTestCards: uiCreateAction("UI/ADD_TEST_CARDS", (cards: Card[]) => (cards)),
    openAllRelations: uiCreateAction("UI/OPEN_ALL_RELATIONS", (cards: ICardAndRelations) => (cards)),
    addMenuId: uiCreateAction("UI/ADD_MENU_ID", (id: number) => (id)),
    removeMenuId: uiCreateAction("UI/REMOVE_MENU_ID", (id: number) => (id)),
    setMenuActivated: uiCreateAction("UI/SET_MENU_ACTIVATED", (id: number) => (id)),
};
