import { Action } from 'redux';
import { SocketActionTypes } from 'Actions';
import { Card } from 'Services';
import { FilterTypeEnum } from 'Constants';

export type ChannelStatus = "off" | "playing" | "paused" | "end" | "ready";
export type CardRender = ICardRelation | ICardAndRelations;

export interface ISyncState {
    type?: "SOCKET" | "YOUTUBE";
    socketStatus: string;
    //chunkStatus: ServiceStatus;
    movieId?: string;
    cards: CardRender[];
    filter: FilterTypeEnum;
    demo: string;
    currentTime: number; // Time in seconds
    timeMovie: number; // Time of socket (milis)
    timeMovieSynced: number; // date.now when socket(milis)
    timeRatio: number;
    lastUpdatedTime: number;
    channelStatus?: ChannelStatus;
    selectedOnSceneChange: boolean;
    showInfoMsg: boolean;
}
export interface ISyncAction extends Action {
    type: SyncActionTypes;
    payload?: any;
}

export interface ICardRelation extends Card {
    parentId: string | null,
    childIndex: number | null,
}

export interface ICardAndRelations {
    type: string;
    card: Card;
    cards: Card[];
}



export type SyncActionTypes = "SYNC/OPEN_CARD" | "SYNC/START" | "SYNC/SET_TIME" | "SYNC/UPDATE_TIME" |
    "SYNC/START_SCENE" | "SYNC/UPDATE_SCENE" | "SYNC/END_SCENE" | "SYNC/PAUSE_START" | "SYNC/PAUSE_END" |
    "SYNC/SET_MOVIE" | "SYNC/CHUNK_FAILED" | "SYNC/INIT_TIME" | "SYNC/SET_SELECTED_ON_SCENE_CHANGE" |
    "SOCKET/CONNECTED" | "SYNC/SET_TRAILER" | "SYNC/SET_SYNC_TYPE" | "SYNC/SET_CHUNK_STATUS" | "SYNC/CLOSE_INFO_MSG" |
    "SYNC/CHANGE_FILTER" |  SocketActionTypes;

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
        case 'SYNC/START_SCENE':
            let cards = state.cards;
            if (state.cards instanceof Array && action.payload instanceof Array &&
                state.cards.length !== action.payload.length) {
                cards = action.payload;
            } else {
                cards = [];
            }
            return { ...state, cards, selectedOnSceneChange: true, channelStatus: "playing" };
        case 'SYNC/UPDATE_SCENE':
            if (action.payload instanceof Array && action.payload.length) {
                return { ...state, cards: [...action.payload, ...state.cards], channelStatus: "playing" };
            } else {
                return state;
            }
        case 'SYNC/END_SCENE':
            return { ...state, cards: [], channelStatus: "playing" };
        case 'SYNC/PAUSE_START':
            
            return { ...state, channelStatus: "paused", showInfoMsg: true};
        case 'SYNC/PAUSE_END':
            return { ...state, channelStatus: "playing", showInfoMsg: false};

        case 'SYNC/CLOSE_INFO_MSG':
            return { ...state, showInfoMsg: false};

        case 'SYNC/SET_TRAILER':
            return { ...state, demo: action.payload };
        case 'SYNC/SET_SYNC_TYPE':
            return {
                ...state, type: action.payload, socketStatus: 'INIT',
                timeMovieSynced: initialSyncState.timeMovieSynced,
                currentTime: initialSyncState.currentTime,
                lastUpdatedTime: initialSyncState.lastUpdatedTime,
            };

        case 'SYNC/SET_SELECTED_ON_SCENE_CHANGE':
            return { ...state, selectedOnSceneChange: action.payload };

        case 'SYNC/CHANGE_FILTER':
            return { ...state, filter: action.payload };

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
    movieId: "m00001",
    cards: [],
    filter: FilterTypeEnum.All,
    demo: "",
    currentTime: 0,
    timeMovie: 0,
    timeMovieSynced: 0,
    timeRatio: 1,
    lastUpdatedTime: 0,
    showInfoMsg: false
};
