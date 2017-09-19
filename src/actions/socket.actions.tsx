import { Action } from 'redux';
import { /*MapDispatchToProps, */MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { createAction/*, ActionFunction0*/ } from 'redux-actions';

export type SocketActionTypes = "SOCKET/CONNECTED" | "SOCKET/CONNECTING" | "SOCKET/DISCONNECTED"
    | "SOCKET/READY_RECEIVED" | "SOCKET/PLAYING_RECEIVED" | "SOCKET/PAUSED_RECEIVED"
    | "SOCKET/OFF_RECEIVED" | "SOCKET/END_RECEIVED";

export interface ISocketData extends Object {
    timeRatio: number;
}
export interface ISocketDataTS extends ISocketData {
    timestamp: number;
}
export interface ISocketActions extends MapDispatchToPropsObject {
    socketConnected: ActionCreator<ISocketAction>;
    socketConnecting: ActionCreator<ISocketAction>;
    socketDisconnected: ActionCreator<ISocketAction>;
}

export interface ISocketAction extends Action {
    type: SocketActionTypes;
    payload?: ISocketData | ISocketDataTS;
}

function socketCreateAction(
    type: SocketActionTypes,
    payload?: ISocketData | ISocketDataTS | any,
): ReduxActions.ActionFunction0<Action> {
    return createAction(type, payload);
}

export const SocketActions: ISocketActions = {
    endReceived: socketCreateAction("SOCKET/END_RECEIVED"), // Cuando acaba la peli
    offReceived: socketCreateAction("SOCKET/OFF_RECEIVED"), // Emisión cancelada
    pausedReceived: socketCreateAction("SOCKET/PAUSED_RECEIVED", // Cuando está en anuncios
        (payload: ISocketDataTS): ISocketDataTS => (payload)),
    // Cuando empieza, cuando vuelve de pause y ajuste de tiempo
    playingReceived: socketCreateAction("SOCKET/PLAYING_RECEIVED",
        (payload: ISocketDataTS): ISocketDataTS => (payload)),
    readyReceived: socketCreateAction("SOCKET/READY_RECEIVED", // La peli está, pero aún no ha empezado
        (timeRatio: number): ISocketData => ({ timeRatio })),
    socketConnected: socketCreateAction("SOCKET/CONNECTED"),
    socketConnecting: socketCreateAction("SOCKET/CONNECTING"),
    socketDisconnected: socketCreateAction("SOCKET/DISCONNECTED"), // Si se desconecta, hacer intento de reconexión.
};
