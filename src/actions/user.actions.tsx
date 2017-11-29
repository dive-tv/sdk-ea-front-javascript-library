import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction } from 'redux-actions';

import { IUserAction, UserActionTypes, IUserState } from "Reducers";
import { Card, EaAPI } from "Services";

declare const DiveAPI: EaAPI;

export interface IUserActions extends MapDispatchToPropsObject {
    setUser: ActionCreator<IUserAction>;
    likeCard: ActionCreator<any>;
}

export const userCreateAction = (type: UserActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
    return createAction(type, payload);
};
/*
export const UserActions: IUserActions = {
    // setUser: userCreateAction("USER/SET_USER", (user: UserProfileResponse) => (user as IUserState)),
    likeCard: (card: Card) => (dispatch: any) => {
        return new Promise((resolve, reject) => {
            DiveAPI.postLikes({ cardId: card.card_id })
                .then(() => {
                    // TODO: Bottom message "Liked" ? or just change the icon?;
                    resolve();
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
                    reject();
                });
        });
    },
};*/
