import { SocketActions } from 'Actions';
import { Store, Dispatch } from 'redux';
import * as io from 'socket.io-client';
import {  DIVE_ENVIRONMENT } from 'Constants';
import { DiveAPIClass } from 'Services';


declare const DiveAPI: DiveAPIClass;

const socketMiddleware = () => {
    let socket: SocketIOClient.Socket | undefined;

    const onOpen = (socketIo: SocketIOClient.Socket, store: Store<any>, channel: string) => (evt: MessageEvent) => {
        // Send a handshake, or authenticate with remote end Tell the store we're
        // connected
        store.dispatch(SocketActions.socketConnected());
        if (socket !== undefined) {
            socket.on('channelStatus', onMessage(socket, store));
            socket.emit('tuneChannel', channel);
        }
    };

    const onClose = (socketIo: SocketIOClient.Socket, store: Store<any>) => (evt: CloseEvent) => {
        if (socket !== undefined) {
            socket.close();
        }
        // Tell the store we've disconnected
        store.dispatch(SocketActions.socketDisconnected());
    };
    const onEnd = (socketIo: SocketIOClient.Socket, store: Store<any>) => (evt: CloseEvent) => {
        if (socket !== undefined) {
            socket.close();
        }
        store.dispatch(SocketActions.socketDisconnected());
    };
    const onError = (socketIo: SocketIOClient.Socket, store: Store<any>) => (evt: CloseEvent) => {
        if (socket !== undefined) {
            socket.close();
        }
        store.dispatch(SocketActions.socketDisconnected());
    };

    const onTimeout = (socketIo: SocketIOClient.Socket, store: Store<any>) => (evt: CloseEvent) => {
        if (socket !== undefined) {
            socket.close();
        }
        store.dispatch(SocketActions.socketDisconnected());
    };

    const onMessage = (socketIo: SocketIOClient.Socket, store: Store<any>) => (evt: any) => {
        // tslint:disable-next-line:no-unused-variable
        const next = store.dispatch;
        // Parse the JSON message received on the websocket
        const data = evt;
        const status = data.status;
        const timestamp = data.timestamp;
        const timeRatio = data.time_ratio;
        switch (status) {
            case "ready":
                // Dispatch an action that adds the received message to our state
                store.dispatch(SocketActions.readyReceived({ timeRatio }));
                break;
            case "playing":
                // Dispatch an action that adds the received message to our state
                store.dispatch(SocketActions.playingReceived({ timestamp, timeRatio }));
                break;
            case "paused":
                // Dispatch an action that adds the received message to our state
                store.dispatch(SocketActions.pausedReceived({ timestamp, timeRatio }));
                break;
            case "off":
                // Dispatch an action that adds the received message to our state
                store.dispatch(SocketActions.offReceived());
                break;
            case "end":
                // Dispatch an action that adds the received message to our state
                store.dispatch(SocketActions.endReceived());
                break;
            default:
                break;
        }
    };

    const getUrl = (env: "DEV" | "PRE" | "PRO"): string => {
        const socketPath: string = 'stream.dive.tv';
        switch (env) {
            case "DEV":
                return "https://dev-" + socketPath;
            case "PRE":
                return "https://pre-" + socketPath;
            case "PRO":
            default:
                return 'https://' + socketPath;
        }

    };

    const handler = (store: Store<any>) => (next: Dispatch<any>) => (action: any) => {
        switch (action.type) {

            // The user wants us to connect
            case 'CONNECT':
                // Start a new connection to the server
                if (socket !== undefined) {
                    socket.close();
                }
                // Send an action that shows a "connecting..." status for now
                store.dispatch(SocketActions.socketConnecting());

                // Attempt to connect (we could send a 'failed' action on error) socket = new
                // WebSocket(action.payload.url);
                const diveToken = DiveAPI.getSavedToken();
                if (diveToken === undefined) {
                    console.error("No token present while trying to connect the socket");
                    throw new Error("No token present while trying to connect the socket");
                }

                const url = action.payload.url !== undefined ? action.payload.url : getUrl(DIVE_ENVIRONMENT);

                socket = io.connect(url, {
                    forceNew: true,
                    query: `token=${diveToken.access_token}`,
                    rejectUnauthorized: false,
                    secure: true,
                    transports: ["websocket", "xhr-polling", "polling", "htmlfile"],
                });

                const channel = action.payload.channelId;
                socket.on('connect', onOpen(socket, store, channel));
                socket.on('connect_error', onError(socket, store));
                socket.on('error', onError(socket, store));
                socket.on('connect_timeout', onTimeout(socket, store));
                socket.on('disconnect', onClose(socket, store));
                socket.on('end', onEnd(socket, store));
                break;

            // The user wants us to disconnect
            case 'DISCONNECT':
                if (socket !== undefined) {
                    socket.close();
                }

                socket = undefined;

                // Set our state to disconnected
                store.dispatch(SocketActions.socketDisconnected());
                break;

            // This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }
    };

    return handler;
};

export default socketMiddleware;
