import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction } from 'redux-actions';

import { IUIAction, CardActionTypes, IUIGroup } from 'Reducers';
import { DiveAPI, TrailerResponse, CardDetailResponse } from "Services";
import { SyncActions, ISocketDataTS } from "Actions";

export interface ICardActions extends MapDispatchToPropsObject {
    goBack: ActionCreator<IUIAction>;
    openCard: ActionCreator<void>;
    performOpenCard: ActionCreator<IUIAction>;
}

//
//  Action Creators
//
export const cardAction = (type: CardActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
    return createAction(type, payload);
};

export const UIActions: ICardActions = {
    goBack: cardAction("UI/UI_BACK", () => (0)),
    openCard: (cardId: string) => (dispatch: any) => {
        if (cardId && cardId.length > 0) {
            dispatch(UIActions.performOpenCard());
        }
        DiveAPI.getCards({ cardId })
            .then((card: CardDetailResponse) => {
                dispatch(UIActions.performOpenCard(card));
            })
            .catch((error) => {
                console.error("Error getting card", error);
                // TODO: display error?
            });
    },
    performOpenCard: cardAction("UI/OPEN_CARD", (card: CardDetailResponse) => (card)),
    openSync: cardAction("UI/OPEN_SYNC"),
    open: (group: IUIGroup) => (dispatch: any) => {
        if (group.top === "YOUTUBE") {
            dispatch(UIActions.openDemo());
        } else {
            dispatch(UIActions.performOpen(group));
        }
    },
    performOpen: cardAction("UI/OPEN", (group: IUIGroup) => (group)),
};
