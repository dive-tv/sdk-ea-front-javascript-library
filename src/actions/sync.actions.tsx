import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { SyncActionTypes, ISyncAction } from 'Reducers';
import { createAction } from 'redux-actions';
// import { DiveAPI, InlineResponse200, TvEventResponse, Chunk } from 'Services';
import { ISocketDataTS } from "Actions";
import { Card } from 'Services';
// import * as chunkExample from './../../services/__mocks__/chunkExample.json';
// import { IChunk, IChunkScene } from "src/app/types/chunk";

export interface ISyncActions extends MapDispatchToPropsObject {
    openCard: ActionCreator<ISyncAction>;
    dataSync: ActionCreator<void>;
    setCards: ActionCreator<ISyncAction>;
    setMovie: ActionCreator<ISyncAction>;
    syncChannel: ActionCreator<void>;
    socketConnected: ActionCreator<ISyncAction>;
    setSyncType: ActionCreator<ISyncAction>;
    setChunkStatus: ActionCreator<ISyncAction>;
    setSelectedOnSceneChange: ActionCreator<ISyncAction>;
};

//
//  Action Creators
//
export const syncCreateAction = (type: SyncActionTypes, payload: any): ReduxActions.ActionFunction0<Action> => {
    return createAction(type, payload);
};

export const SyncActions: ISyncActions = {
    openCard: syncCreateAction("SYNC/OPEN_CARD", (cardId: string) => (cardId)),
    setMovie: syncCreateAction("SYNC/SET_MOVIE", (movieId: string) => (movieId)),
    socketConnected: syncCreateAction("SOCKET/CONNECTED", (movieId: string) => (movieId)),
    setChunkStatus: syncCreateAction("SYNC/SET_CHUNK_STATUS", (chunkStatus: string) => (chunkStatus)),
    setSyncType: syncCreateAction("SYNC/SET_SYNC_TYPE", (syncType: "SOCKET" | "YOUTUBE") => (syncType)),
    setSelectedOnSceneChange: syncCreateAction("SYNC/SET_SELECTED_ON_SCENE_CHANGE", (val: boolean) => (val)),
    syncChannel: (tvEvent: any/*TvEventResponse*/) => (dispatch: any) => {
        const channelId = tvEvent !== undefined && tvEvent.channel_id !== undefined && tvEvent.card !== undefined ?
            tvEvent.channel_id + '#' + tvEvent.card.card_id : undefined;
        dispatch(SyncActions.setSyncType("SOCKET"));
        dispatch(SyncActions.setMovie(tvEvent.card.card_id));
        dispatch({
            type: "CONNECT",
            payload: {
                channelId,
            },
        });
    },
    dataSync: (movieId: string) => (dispatch: any) => {
        dispatch(SyncActions.setChunkStatus("LOADING"));
        // dispatch(SyncActions.setMovie(movieId));
        // dispatch(SyncActions.updateTime(5555)); // Esto hay que quitarlo. es para probar.
    },
    setCards: syncCreateAction("SYNC/SET_CARDS", (cards: Array<Card>[]) => (cards)),
    setTime: syncCreateAction("SYNC/SET_TIME", (time: number) => (time)),
};
