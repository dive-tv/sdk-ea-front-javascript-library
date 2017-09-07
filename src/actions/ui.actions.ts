import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction } from 'redux-actions';

import { IUIAction, UIActionTypes, IUIGroup } from 'Reducers';
import { Card, DiveAPIClass } from "Services";

declare const DiveAPI: DiveAPIClass;

export interface IUIActions extends MapDispatchToPropsObject {
    goBack: ActionCreator<IUIAction>;
    openCard: ActionCreator<void>;
    performOpenCard: ActionCreator<IUIAction>;
    openSync: ActionCreator<IUIAction>;
    open: ActionCreator<void>;
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
    openCard: (cardId: string, relations: string) => (dispatch: any) => {
        if (cardId && cardId.length > 0) {
            dispatch(UIActions.performOpenCard());
        }
        DiveAPI.getCard({ cardId })
            .then((card: Card) => {
                dispatch(UIActions.performOpenCard(card));
            })
            .catch((error: any) => {
                console.error("Error gettinapig card", error);
                // TODO: display error?
            });
    },
    performOpenCard: uiCreateAction("UI/OPEN_CARD", (card: Card) => (card)),
    openSync: uiCreateAction("UI/OPEN_SYNC"),
    open: (group: IUIGroup) => (dispatch: any) => {
        if (group.top === "YOUTUBE") {
            dispatch(UIActions.openDemo());
        } else {
            dispatch(UIActions.performOpen(group));
        }
    },
    performOpen: uiCreateAction("UI/OPEN", (group: IUIGroup) => (group)),
};
