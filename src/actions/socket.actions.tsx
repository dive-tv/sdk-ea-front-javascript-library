import { Action } from 'redux';
import { /*MapDispatchToProps, */MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction/*, ActionFunction0*/ } from 'redux-actions';
import {Card} from 'Services'

export type SocketActionTypes = "SOCKET/AUTHENTICATED" | "SOCKET/UNAUTHORIZED" | "SOCKET/ERROR"
    | "SOCKET/MOVIE_START" | "SOCKET/MOVIE_END" | "SOCKET/SCENE_START"
    | "SOCKET/SCENE_UPDATE" | "SOCKET/SCENE_END";

export interface ISocketDataUnauth extends Object {
    message: string;
    code: string;
    type: string;
}

export interface ISocketDataError extends Object {
    status: number;
    description: string;
}

export interface ISocketDataMovieStart extends Object {
    movie_id: string
}

export interface ISocketDataCards extends Object {
    cards?: Card[]
}


export interface ISocketActions extends MapDispatchToPropsObject {

    unauthReceived: ActionCreator<ISocketAction>;
    errorReceived: ActionCreator<ISocketAction>;
    movieStartReceived: ActionCreator<ISocketAction>;
    sceneStartReceived: ActionCreator<ISocketAction>;
    sceneUpdateReceived: ActionCreator<ISocketAction>;

}

 export interface ISocketAction extends Action {
      type: SocketActionTypes;
      payload?: ISocketDataUnauth | ISocketDataError | ISocketDataMovieStart | ISocketDataCards
}

function socketCreateAction(
    type: SocketActionTypes,
    payload?: ISocketDataUnauth | ISocketDataError | ISocketDataMovieStart | ISocketDataCards | any,
): ReduxActions.ActionFunction0<Action> {
    return createAction(type, payload);
}

export const SocketActions: ISocketActions = {

    authReceived: socketCreateAction("SOCKET/AUTHENTICATED"),
    unauthReceived: socketCreateAction("SOCKET/UNAUTHORIZED", (payload: ISocketDataUnauth): ISocketDataUnauth => (payload)),
    errorReceived: socketCreateAction("SOCKET/ERROR", (payload: ISocketDataError): ISocketDataError => (payload)),

    movieStartReceived: socketCreateAction("SOCKET/MOVIE_START", (payload: ISocketDataMovieStart): ISocketDataMovieStart => (payload)),
    movieEndReceived: socketCreateAction("SOCKET/MOVIE_END"),
    
    sceneStartReceived: socketCreateAction("SOCKET/SCENE_START", (payload: ISocketDataCards): ISocketDataCards => (payload)),
    sceneUpdateReceived: socketCreateAction("SOCKET/SCENE_UPDATE", (payload: ISocketDataCards): ISocketDataCards => (payload)),
    sceneEndReceived: socketCreateAction("SOCKET/SCENE_END"), 
};
