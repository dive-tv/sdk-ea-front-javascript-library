import { Action } from 'redux';
import { CardUser } from 'Services';

//
//  Action types
//
export type UserActionTypes = "USER/SET_USER" | "USER/LIKE_CARD";
export interface IUserAction extends Action {
    type: undefined | UserActionTypes;
    payload?: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IUserState {
}

export const UserReducer =
(state: IUserState | {} = initialUserState, action: IUserAction): IUserState | {} => {
    switch (action.type) {
        case "USER/SET_USER":
            return action.payload as IUserState;
        default:
            return state;
    }
};

export const initialUserState = {};
