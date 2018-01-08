import { Action } from 'redux';
import { MapDispatchToPropsObject, ActionCreator } from 'react-redux';
import { SyncActionTypes, ISyncAction, ICardRelation, ICardAndRelations, CardRender, IBanner } from 'Reducers';
import { createAction } from 'redux-actions';
// import { DiveAPI, InlineResponse200, TvEventResponse, Chunk } from 'Services';
import { Card, EaAPI, Helper, Single, Duple, ApiRelationModule } from 'Services';
import { SUPPORTED_CARD_TYPES, FilterTypeEnum, LIMIT_FOR_RELATIONS, TESTING_CHANNEL } from 'Constants';
// import * as chunkExample from './../../services/__mocks__/chunkExample.json';
// import { IChunk, IChunkScene } from "src/app/types/chunk";

declare const DiveAPI: EaAPI;

export interface ISyncActions extends MapDispatchToPropsObject {
  openCard: ActionCreator<ISyncAction>;
  startScene: ActionCreator<ISyncAction>;
  updateScene: ActionCreator<ISyncAction>;
  setMovie: ActionCreator<ISyncAction>;
  setTime: ActionCreator<ISyncAction>;
  staticVOD: ActionCreator<void>;
  syncVOD: ActionCreator<void>;
  syncChannel: ActionCreator<void>;
  setSyncType: ActionCreator<ISyncAction>;
  setChunkStatus: ActionCreator<ISyncAction>;
  setSelectedOnSceneChange: ActionCreator<ISyncAction>;
  closeInfoMsg: ActionCreator<ISyncAction>;
  changeFilter: ActionCreator<ISyncAction>;
}

//
//  Action Creators
//
export const syncCreateAction = (type: SyncActionTypes, payload?: any): ReduxActions.ActionFunction0<Action> => {
  return createAction(type, payload);
};

export const SyncActions: ISyncActions = {
  openCard: syncCreateAction("SYNC/OPEN_CARD", (card: Card) => (card)),
  setMovie: syncCreateAction("SYNC/SET_MOVIE", (movieId: string) => (movieId)),
  //socketConnected: syncCreateAction("SOCKET/AUTHENTICATED", (movieId: string) => (movieId)),
  setChunkStatus: syncCreateAction("SYNC/SET_CHUNK_STATUS", (chunkStatus: string) => (chunkStatus)),
  setSyncType: syncCreateAction("SYNC/SET_SYNC_TYPE", (syncType: "SOCKET" | "YOUTUBE" | "STATIC_VOD") => (syncType)),
  setSelectedOnSceneChange: syncCreateAction("SYNC/SET_SELECTED_ON_SCENE_CHANGE", (val: boolean) => (val)),
  staticVOD: (params: { movieId: string, timestamp: number, protocol?: "http" | "https", videoRef: HTMLVideoElement | HTMLObjectElement, videoParentRef?: HTMLElement }) => (dispatch: any) => {
    dispatch(SyncActions.setSyncType("STATIC_VOD"));
    dispatch(SyncActions.setVideoRefs({ videoRef: params.videoRef, videoParentRef: params.videoParentRef }));
    dispatch(SyncActions.setMovie(params.movieId));
    DiveAPI.getStaticMovieScene({ relations: true, clientMovieId: params.movieId, timestamp: params.timestamp })
      .then((cards: Card[]) => {
        dispatch(SyncActions.startScene(processCard(cards)));
      });
  },
  syncVOD: (params: { movieId: string, timestamp: number, protocol?: "http" | "https", videoRef: HTMLVideoElement | HTMLObjectElement, videoParentRef?: HTMLElement }) => (dispatch: any) => {
    // dispatch(SyncActions.setMovie(params.movieId));

    dispatch(SyncActions.setSyncType("SOCKET"));
    dispatch(SyncActions.setVideoRefs({ videoRef: params.videoRef, videoParentRef: params.videoParentRef }));
    let indexedBanners = {};
    DiveAPI.syncWithMovieVOD({
      movieId: params.movieId,
      timestamp: params.timestamp || 1,
      protocol: params.protocol,
      socketTransports: ['polling', 'websocket'],
      callbacks: {
        onError: () => { console.log("[SOCKET] onError"); },
        onMovieStart: (movie: any) => {
          if (movie && movie.movie_id) {
            dispatch(SyncActions.setMovie(movie.movie_id));
            fetch('https://cdn.dive.tv/config/claro/ads.json')
              .then((response) => {
                return response.json();
              })
              .then((banners: any[]) => {
                indexedBanners = processBanners(movie.movie_id, banners);
              });
          }
        },
        onMovieEnd: () => { console.log("[SOCKET] onMovieEnd"); },
        onSceneStart: (scene: any) => {
          if (scene && scene.cards) {
            dispatch(SyncActions.startScene(processCard(scene.cards, indexedBanners)));
          } else {
            dispatch(SyncActions.startScene([]));
          }
        },
        onSceneUpdate: (scene: any) => {
          // console.log("[SOCKET] onSceneUpdate", scene);
          if (scene.cards) {
            // console.log("processCard: ", processCard(scene.cards));
            dispatch(SyncActions.updateScene(processCard(scene.cards, indexedBanners)));
          }
        },
        onSceneEnd: () => { dispatch(SyncActions.endScene()); },
        onPauseStart: () => { dispatch(SyncActions.broadcastPause()); },
        onPauseEnd: () => { dispatch(SyncActions.broadcastPauseEnd()); },
      },
    });
  },
  syncChannel: (channelId: string) => (dispatch: any) => {
    console.log("[SOCKET]");
    dispatch(SyncActions.setSyncType("SOCKET"));

    DiveAPI.syncWithMovieStreaming({
      protocol: "http",
      channelId,
      socketTransports: [
        'websocket',
      ],
      callbacks: {
        onConnect: () => { console.log("[SOCKET] onConnect"); },
        onAuthenticated: () => { console.log("[SOCKET] onAuthenticated"); },
        onError: (e) => { console.error("[SOCKET] onError", e); },
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
  startScene: syncCreateAction("SYNC/START_SCENE", (cards: Array<Card>[]) => (cards)),
  updateScene: syncCreateAction("SYNC/UPDATE_SCENE", (cards: Array<Card>[]) => (cards)),
  broadcastPause: syncCreateAction("SYNC/PAUSE_START"),
  broadcastPauseEnd: syncCreateAction("SYNC/PAUSE_END"),
  endScene: syncCreateAction("SYNC/END_SCENE", (cards: Array<Card>[]) => (cards)),
  setTime: syncCreateAction("SYNC/SET_TIME", (time: number) => (time)),
  closeInfoMsg: syncCreateAction("SYNC/CLOSE_INFO_MSG"),
  changeFilter: syncCreateAction("SYNC/CHANGE_FILTER", (filter: FilterTypeEnum) => filter),
  setVideoRefs: syncCreateAction("SYNC/SET_VIDEOREFS", (params: { videoRef: HTMLVideoElement | HTMLObjectElement, videoParentRef?: HTMLElement }) => params),
};

const processCard = (cards: Card[], banners?: { [key: string]: any }): Array<ICardRelation | ICardAndRelations> => {
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
    let castedCard = card as ICardRelation;
    if (banners && banners[card.card_id]) {
      castedCard.banner = banners[card.card_id];
    }

    relCards = [...relCards, castedCard as ICardRelation];

    if (card.relations) {

      for (const rel of card.relations) {

        let childrenCards: ICardRelation[] = Helper.getRelationCardsFromRelationCarousel(card.type, rel as ApiRelationModule) as ICardRelation[];

        if (childrenCards) {

          // Cogemos todas las relaciones dentro del mismo tipo filtrando previamente.
          childrenCards = Helper.getRelationCardsFromRelationCarousel(card.type, rel as ApiRelationModule).filter((el: Card) => {
            let castedChildrenCard = card as ICardRelation;
            if (banners && banners[castedChildrenCard.card_id]) {
              castedChildrenCard.banner = banners[castedChildrenCard.card_id];
            }
            return castedChildrenCard && (SUPPORTED_CARD_TYPES.indexOf(card.type) > -1);
          }) as ICardRelation[];

          childrenCards = formatFashion(childrenCards).map((el: Card, i: number) => {
            return { ...el, parentId: card.card_id, childIndex: i } as ICardRelation;
          });

          // Metemos a primer nivel un número igual a {limit}
          relCards = [...relCards, ...childrenCards.slice(0, LIMIT_FOR_RELATIONS)];
          if (childrenCards.length > LIMIT_FOR_RELATIONS) {
            relCards = [...relCards, { type: 'moreRelations', card, cards: childrenCards }];
          }
        }
      }
    }
  }
  // Filtramos por las cards soportables.
  return relCards;
};

const processBanners = (movieId: string, banners: any[]): { [key: string]: IBanner } => {
  let processedBanners: { [key: string]: IBanner } = {};
  if (banners && banners.length) {
    for (let i = 0; i < banners.length; i++) {
      const bannersForMovie = banners[i];
      if (bannersForMovie.movie_id == movieId) {
        for (let j = 0; j < bannersForMovie.data.length; j++) {
          let banner: any = bannersForMovie.data[j];
          processedBanners[banner.card_id] = {
            image_url: banner.image_url,
            banner_size: banner.banner_size,
            link_url: banner.link_url,
          } as IBanner;
        }
      }
    }
  }
  return processedBanners;
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
