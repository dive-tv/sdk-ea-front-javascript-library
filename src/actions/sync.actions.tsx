import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { SyncActionTypes, ISyncAction, ICardRelation, ICardAndRelations, CardRender } from 'Reducers';
import { createAction } from 'redux-actions';
// import { DiveAPI, InlineResponse200, TvEventResponse, Chunk } from 'Services';
import { Card, DiveAPIClass, Helper, Single, Duple, ApiRelationModule } from 'Services';
import { SUPPORTED_CARD_TYPES, TESTING_CHANNEL, FilterType } from 'Constants';
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
    closeInfoMsg: ActionCreator<ISyncAction>;
    changeFilter: ActionCreator<ISyncAction>;
};

//
//  Action Creators
//
export const syncCreateAction = (type: SyncActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
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
            protocol: "http",
            channelId: TESTING_CHANNEL, callbacks: {
                onError: () => { console.log("[SOCKET] onError"); },
                onMovieStart: (movie: any) => {
                    if (movie && movie.movie_id) {
                        dispatch(SyncActions.setMovie(movie.movie_id));
                    }
                },
                onMovieEnd: () => { console.log("[SOCKET] onMovieEnd"); },
                onSceneStart: (scene: any) => {
                    if (scene && scene.cards) {
                        dispatch(SyncActions.startScene(processCard(scene.cards)));
                    } else {
                        dispatch(SyncActions.startScene([]));
                    }
                },
                onSceneUpdate: (scene: any) => {
                    // console.log("[SOCKET] onSceneUpdate", scene);
                    if (scene.cards) {
                        // console.log("processCard: ", processCard(scene.cards));
                        dispatch(SyncActions.updateScene(processCard(scene.cards)));
                    }
                },
                onSceneEnd: () => { dispatch(SyncActions.endScene()); },
                onPauseStart: () => { dispatch(SyncActions.broadcastPause()); },
                onPauseEnd: () => { dispatch(SyncActions.broadcastPauseEnd()); },
            },
        });
    },
    dataSync: (movieId: string) => (dispatch: any) => {
        dispatch(SyncActions.setChunkStatus("LOADING"));
    },
    startScene: syncCreateAction("SYNC/START_SCENE", (cards: Array<Card>[]) => (cards)),
    updateScene: syncCreateAction("SYNC/UPDATE_SCENE", (cards: Array<Card>[]) => (cards)),
    broadcastPause: syncCreateAction("SYNC/PAUSE_START"),
    broadcastPauseEnd: syncCreateAction("SYNC/PAUSE_END"),
    endScene: syncCreateAction("SYNC/END_SCENE", (cards: Array<Card>[]) => (cards)),
    setTime: syncCreateAction("SYNC/SET_TIME", (time: number) => (time)),
    closeInfoMsg: syncCreateAction("SYNC/CLOSE_INFO_MSG"),
    changeFilter: syncCreateAction("SYNC/CHANGE_FILTER", (filter: FilterType) => filter)
};

const processCard = (cards: Card[]): Array<ICardRelation | ICardAndRelations> => {
    const limit = 3;
    if (cards == null) return [];
    cards = cards.reverse();
    let relCards: Array<ICardRelation | ICardAndRelations> = [];

    for (const card of cards) {
        // Casos en los que no hay que pintar la card.
        if (card == null || card.type === undefined ||
            card.type === 'person' ||
            !(SUPPORTED_CARD_TYPES.indexOf(card.type) > -1)) {
            continue;
        }

        relCards = [...relCards, card as ICardRelation];

        if (card.relations) {

            for (const rel of card.relations) {

                let childrenCards: ICardRelation[] = Helper.getRelationCardsFromRelationCarousel(card.type, rel as ApiRelationModule) as ICardRelation[];

                if (childrenCards) {

                    // Cogemos todas las relaciones dentro del mismo tipo filtrando previamente.
                    childrenCards = Helper.getRelationCardsFromRelationCarousel(card.type, rel as ApiRelationModule).filter((el: Card) => {
                        return el && (SUPPORTED_CARD_TYPES.indexOf(card.type) > -1);
                    }) as ICardRelation[];

                    childrenCards = formatFashion(childrenCards).map((el: Card, i: number) => {
                        return { ...el, parentId: card.card_id, childIndex: i } as ICardRelation
                    });

                    // Metemos a primer nivel un número igual a {limit}
                    relCards = [...relCards, ...childrenCards.slice(0, limit)];
                    if (childrenCards.length > limit) {
                        relCards = [...relCards, { type: 'moreRelations', card, cards: childrenCards }];
                    }
                }
            }
        }
    }
    // Filtramos por las cards soportables.
    return relCards;
};

const formatFashion = (children: ICardRelation[]): ICardRelation[] => {

    let filtered: ICardRelation[] = [];

    for (const rel of children) {

        if (rel.type !== 'look') {
            filtered = [...filtered, rel];
            continue;
        }

        if (rel.relations && rel.relations.length > 0) {
            filtered = [...filtered, ...Helper.getRelationCards(rel.relations) as ICardRelation[]]
        }
    }

    return filtered;
};
