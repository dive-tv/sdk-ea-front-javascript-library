import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { SyncActionTypes, ISyncAction, ICardRelation, ICardAndRelations, CardRender } from 'Reducers';
import { createAction } from 'redux-actions';
// import { DiveAPI, InlineResponse200, TvEventResponse, Chunk } from 'Services';
import { Card, DiveAPIClass, Helper, Single, Duple } from 'Services';
import { SUPPORTED_CARD_TYPES } from 'Constants';
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
                        dispatch(SyncActions.startScene(processCard(scene.cards)));
                    } else {
                        dispatch(SyncActions.startScene([]));
                    }
                },
                onSceneUpdate: (scene: any) => {
                    console.log("[SOCKET] onSceneUpdate", scene);
                    if (scene.cards) {
                        // console.log("processCard: ", processCard(scene.cards));
                        dispatch(SyncActions.updateScene(processCard(scene.cards)));
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

const processCard = (cards: Card[]): Array<ICardRelation | ICardAndRelations> => {
    const limit = 3;
    if (cards == null) return [];
    cards = cards.reverse();
    let relCards: Array<ICardRelation | ICardAndRelations> = [];

    for (const card of cards) {
        if(card.type === 'person'){
            continue;
        }

        relCards = [...relCards, card as ICardRelation];

        if (card.relations) {
            for (const rel of card.relations) {
                let childrenCards: ICardRelation[];
                //Cogemos todas las relaciones dentro del mismo tipo 
                childrenCards = Helper.getRelationCardsFromRelation(rel).map((el: Card, i: number) => {
                    return { ...el, parentId: card.card_id, childIndex: i } as ICardRelation
                });
                //Metemos a primer nivel un número igual a {limit}
                relCards = [...relCards, ...childrenCards.slice(0, limit)];
                if (childrenCards.length > limit) {
                    relCards = [...relCards, { type: 'moreRelations', card: card, cards: childrenCards }]
                }
            }
        }
    }
    
    //Filtramos por las cards soportables.
    return relCards.filter((card: CardRender) => {
        return card && card.type &&
            (SUPPORTED_CARD_TYPES.indexOf(card.type) > -1 || card.type === 'moreRelations')
    });;

}

