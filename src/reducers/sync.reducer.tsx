import { Action } from 'redux';
import { SocketActionTypes } from 'Actions';
import {Card} from 'Services';
export type ChannelStatus = "off" | "playing" | "paused" | "end" | "ready";

export interface ISyncState {
    type?: "SOCKET" | "YOUTUBE";
    socketStatus: string;
    //chunkStatus: ServiceStatus;
    movieId?: string;
    cards: Card[];
    demo: string;
    currentTime: number; // Time in seconds
    timeMovie: number; // Time of socket (milis)
    timeMovieSynced: number; // date.now when socket(milis)
    timeRatio: number;
    lastUpdatedTime: number;
    channelStatus?: ChannelStatus;
    selectedOnSceneChange: boolean;
    // timeNow: number;
}
export interface ISyncAction extends Action {
    type: SyncActionTypes;
    payload?: any;
}

export type SyncActionTypes = "SYNC/OPEN_CARD" | "SYNC/START" | "SYNC/SET_TIME" | "SYNC/UPDATE_TIME" |
    "SYNC/SET_CARDS" | "SYNC/SET_SCENE" | "SYNC/SET_MOVIE" | "SYNC/CHUNK_FAILED" | "SYNC/INIT_TIME" |
    "SYNC/SET_SELECTED_ON_SCENE_CHANGE" |
    "SOCKET/CONNECTED" | "SYNC/SET_TRAILER" | "SYNC/SET_SYNC_TYPE" | "SYNC/SET_CHUNK_STATUS" | SocketActionTypes;

export const SyncReducer = (state: ISyncState = initialSyncState, action: ISyncAction): ISyncState => {
    switch (action.type) {
        case 'SYNC/SET_MOVIE':
            return {
                ...state, movieId: action.payload,
                cards: [],
            };
        case 'SYNC/UPDATE_TIME': // UPDATEA EL TIEMPO CON EL NOW
            return {
                ...state,
                currentTime: calcTime(state, Date.now()),
                lastUpdatedTime: Date.now(),
            };
        case 'SYNC/SET_CARDS':
            if (state.cards instanceof Array && action.payload instanceof Array &&
                state.cards.length !== action.payload.length) {
                return { ...state, cards: action.payload };
            } else {
                return state;
            }
        case 'SYNC/SET_SCENE':
                return { ...state, cards: [] };

        case 'SYNC/SET_TRAILER':
            return { ...state, demo: action.payload };
        case 'SYNC/SET_SYNC_TYPE':
            return {
                ...state, type: action.payload, socketStatus: 'INIT',
                timeMovieSynced: initialSyncState.timeMovieSynced,
                currentTime: initialSyncState.currentTime,
                lastUpdatedTime: initialSyncState.lastUpdatedTime,
            };

        // SOCKET OPTIONS
        case 'SOCKET/CONNECTED':
            return { ...state, socketStatus: 'CONNECTED' };
        case 'SYNC/INIT_TIME':
        case 'SOCKET/PLAYING_RECEIVED':
            // console.log('SOCKET/PLAYING_RECEIVED');
            return {
                ...state,
                timeMovie: action.payload.timestamp * 1000,
                timeRatio: action.payload.timeRatio,
                timeMovieSynced: Date.now(),
                currentTime: action.payload.timestamp * action.payload.timeRatio,
                lastUpdatedTime: Date.now(),
                channelStatus: "playing",
            };
        case "SOCKET/READY_RECEIVED":
            return { ...state, channelStatus: "ready" };

        case 'SOCKET/PAUSED_RECEIVED':
            return { ...state, channelStatus: "paused" };
        case 'SOCKET/OFF_RECEIVED':
            return { ...state, channelStatus: "off" };
        case 'SOCKET/END_RECEIVED':
            return { ...state, channelStatus: "end" };

        case 'SYNC/SET_TIME': // UPDATEA EL TIEMPO CON EL QUE NOSOTROS LE PASEMOS(en milis)
            const calcedTime = calcTime(state, action.payload);
            if (calcedTime !== state.currentTime) {
                return {
                    ...state,
                    currentTime: calcTime(state, action.payload),
                    lastUpdatedTime: Date.now(),
                    timeMovieSynced: state.timeMovieSynced === 0 ? Date.now() : state.timeMovieSynced,
                };
            } else {
                return state;
            }
        case 'SYNC/SET_SELECTED_ON_SCENE_CHANGE':
            return { ...state, selectedOnSceneChange: action.payload };

        default:
            return state;
    }
};

const calcTime = (state: ISyncState, time: number) => {
    // console.log("[calcTime] state: ", state);
    // console.log("[calcTime] time: ", time);
    return (state.timeMovie + (time - state.timeMovieSynced) * state.timeRatio) / 1000;
};

export const initialSyncState: ISyncState = {
    selectedOnSceneChange: true,
    socketStatus: 'INIT',
    movieId: undefined,
    cards: [],
    demo: "",
    currentTime: 0,
    timeMovie: 0,
    timeMovieSynced: 0,
    timeRatio: 1,
    lastUpdatedTime: 0,
};
