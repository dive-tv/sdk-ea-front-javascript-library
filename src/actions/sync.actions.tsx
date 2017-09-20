import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { SyncActionTypes, ISyncAction } from 'Reducers';
import { createAction } from 'redux-actions';
// import { DiveAPI, InlineResponse200, TvEventResponse, Chunk } from 'Services';
import { Card, DiveAPIClass } from 'Services';
// import * as chunkExample from './../../services/__mocks__/chunkExample.json';
// import { IChunk, IChunkScene } from "src/app/types/chunk";

declare const DiveAPI: DiveAPIClass;

export interface ISyncActions extends MapDispatchToPropsObject {
    openCard: ActionCreator<ISyncAction>;
    dataSync: ActionCreator<void>;
    startScene: ActionCreator<ISyncAction>;
    updateScene: ActionCreator<ISyncAction>;
    setMovie: ActionCreator<ISyncAction>;
    syncChannel: ActionCreator<void>;
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
    //socketConnected: syncCreateAction("SOCKET/AUTHENTICATED", (movieId: string) => (movieId)),
    setChunkStatus: syncCreateAction("SYNC/SET_CHUNK_STATUS", (chunkStatus: string) => (chunkStatus)),
    setSyncType: syncCreateAction("SYNC/SET_SYNC_TYPE", (syncType: "SOCKET" | "YOUTUBE") => (syncType)),
    setSelectedOnSceneChange: syncCreateAction("SYNC/SET_SELECTED_ON_SCENE_CHANGE", (val: boolean) => (val)),
    syncChannel: (tvEvent: any/*TvEventResponse*/) => (dispatch: any) => {
        console.log("[SOCKET]"); 
        dispatch(SyncActions.setSyncType("SOCKET"));
        DiveAPI.syncWithMovieStreaming({
            channelId: "la2", callbacks: {
                onError: () => { console.log("[SOCKET] onError"); },
                onMovieStart: (movie: any) => {
                    if (movie && movie.movie_id) {
                        dispatch(SyncActions.setMovie(movie.movie_id));
                    }
                },
                onMovieEnd: () => { console.log("[SOCKET] onMovieEnd"); },
                onSceneStart: (scene: any) => {
                    console.log("[SOCKET] onSceneStart", scene);
                    if (scene && scene.cards) {
                        dispatch(SyncActions.startScene(scene.cards))
                    }else{
                        dispatch(SyncActions.startScene([]))
                    }
                },
                onSceneUpdate: (scene: any) => {
                    console.log("[SOCKET] onSceneUpdate", scene);
                    if (scene.cards) {
                        dispatch(SyncActions.updateScene(scene.cards))
                    }
                },
                onSceneEnd: () => { console.log("[SOCKET] onSceneEnd"); },
                onPauseStart: () => { console.log("[SOCKET] onPauseStart"); },
                onPauseEnd: () => { console.log("[SOCKET] onPauseEnd"); },
            }
        });
    },
    dataSync: (movieId: string) => (dispatch: any) => {
        dispatch(SyncActions.setChunkStatus("LOADING"));
        // dispatch(SyncActions.setMovie(movieId));
        // dispatch(SyncActions.updateTime(5555)); // Esto hay que quitarlo. es para probar.
    },
    startScene: syncCreateAction("SYNC/START_SCENE", (cards: Array<Card>[]) => (cards)),
    updateScene: syncCreateAction("SYNC/UPDATE_SCENE", (cards: Array<Card>[]) => (cards)),
    endScene: syncCreateAction("SYNC/END_SCENE", (cards: Array<Card>[]) => (cards)),
    setTime: syncCreateAction("SYNC/SET_TIME", (time: number) => (time)),
};
