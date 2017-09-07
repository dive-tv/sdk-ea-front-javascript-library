import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
// import * as React from 'react';
import { INavAction, NavActionTypes } from 'Reducers';
import { createAction } from 'redux-actions';
import { INavigable } from "HOC";

export interface INavActions extends MapDispatchToPropsObject {
    addNode: ActionCreator<INavAction>;
    deleteNode: ActionCreator<INavAction>;
    setLastKey: ActionCreator<INavAction>;
    setSelected: ActionCreator<INavAction>;
    setActivated: ActionCreator<INavAction>;
    moveHorizontal: ActionCreator<INavAction>;
    moveVertical: ActionCreator<INavAction>;
    setNodeById: ActionCreator<INavAction>;
    setNodeByName: ActionCreator<INavAction>;
}

//
//  Action Creators
//
export const navCreateAction = (type: NavActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
    return createAction(type, payload);
};

export const NavActions: INavActions = {
    addNode: navCreateAction('NAV/ADD_NODE', (nav: INavigable) => nav),
    setLastKey: navCreateAction('NAV/KEY', (key: string) => key),
    setSelected: navCreateAction('NAV/SELECTED', (id: number) => id),
    setLeaf: navCreateAction('NAV/SELECT_LEAF', (id: number) => id),
    setActivated: navCreateAction('NAV/ACTIVATED', (id: number) => id),
    moveHorizontal: navCreateAction('NAV/MOVE_HORIZONTAL', (id: 1 | -1) => id),
    moveVertical: navCreateAction('NAV/MOVE_VERTICAL', (id: 1 | -1) => id),
    deleteNode: navCreateAction('NAV/DELETE_NODE', (id: number) => id),
    setNodeByName: navCreateAction('NAV/SELECT_BY_NAME', (name: string) => name),
    setNodeById: navCreateAction('NAV/SELECT_BY_ID', (id: number) => id),

};
