import { Action } from 'redux';
import { SocketActionTypes } from 'Actions';
import { Card } from 'Services';
import { FilterTypeEnum } from 'Constants';

export type ChannelStatus = "off" | "playing" | "paused" | "end" | "ready";
export type VideoType = "VIDEO" | "VIMEO" | "YOUTUBE";
export type CardRender = ICardRelation | ICardAndRelations;

export interface ISyncState {
  type?: "SOCKET" | "YOUTUBE";
  videoType: VideoType;
  socketStatus: string;
  // chunkStatus: ServiceStatus;
  movieId?: string;
  cards: CardRender[];
  filter: FilterTypeEnum;
  sceneCount: number;
  demo: string;
  currentTime: number; // Time in seconds
  timeMovie: number; // Time of socket (milis)
  timeMovieSynced: number; // date.now when socket(milis)
  timeRatio: number;
  lastUpdatedTime: number;
  channelStatus?: ChannelStatus;
  selectedOnSceneChange: boolean;
  showInfoMsg: boolean;
  videoRef?: HTMLVideoElement | HTMLObjectElement;
  parentVideoRef?: HTMLElement;
  playerAPI?: any;
  dropDownCarouselState: boolean;
}
export interface ISyncAction extends Action {
  type: SyncActionTypes;
  payload?: any;
}

export interface ICardRelation extends Card {
  parentId: string | null;
  childIndex: number | null;
  banner?: IBanner;
}

export interface IBanner {
  image_url: string;
  banner_size: string;
  link_url: string;
}

export interface ICardAndRelations {
  type: string;
  card: Card;
  cards: Card[];
  banner?: IBanner;
}

export type SyncActionTypes = "SYNC/OPEN_CARD" | "SYNC/START" | "SYNC/SET_TIME" | "SYNC/UPDATE_TIME" |
  "SYNC/START_SCENE" | "SYNC/UPDATE_SCENE" | "SYNC/END_SCENE" | "SYNC/PAUSE_START" | "SYNC/PAUSE_END" |
  "SYNC/SET_MOVIE" | "SYNC/CHUNK_FAILED" | "SYNC/INIT_TIME" | "SYNC/SET_SELECTED_ON_SCENE_CHANGE" |
  "SOCKET/CONNECTED" | "SYNC/SET_TRAILER" | "SYNC/SET_SYNC_TYPE" | "SYNC/SET_CHUNK_STATUS" | "SYNC/CLOSE_INFO_MSG" |
  "SYNC/CHANGE_FILTER" | "SYNC/SET_VIDEOREFS" | 'SYNC/DOWPDOWN_CAROUSEL_STATE' | SocketActionTypes;

export const SyncReducer = (state: ISyncState = initialSyncState, action: ISyncAction): ISyncState => {
  switch (action.type) {
    case 'SYNC/SET_MOVIE':
      return {
        ...state, movieId: action.payload,
        cards: [],
      };
    case 'SYNC/SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SYNC/UPDATE_TIME': // UPDATEA EL TIEMPO CON EL NOW
      return {
        ...state,
        currentTime: calcTime(state, Date.now()),
        lastUpdatedTime: Date.now(),
      };
    case 'SYNC/START_SCENE':
      if (action.payload instanceof Array) {
        return { ...state, cards: action.payload, selectedOnSceneChange: true, channelStatus: "playing", sceneCount: state.sceneCount + 1 };
      } else {
        return { ...state, cards: [], selectedOnSceneChange: true, channelStatus: "playing", sceneCount: state.sceneCount + 1 };
      }
    case 'SYNC/UPDATE_SCENE':
      if (action.payload instanceof Array && action.payload.length) {
        return { ...state, cards: [...action.payload, ...state.cards], channelStatus: "playing" };
      } else {
        return state;
      }
    case 'SYNC/END_SCENE':
      return { ...state, cards: [], channelStatus: "playing" };
    case 'SYNC/PAUSE_START':

      return { ...state, channelStatus: "paused", showInfoMsg: true };
    case 'SYNC/PAUSE_END':
      return { ...state, channelStatus: "playing", showInfoMsg: false };

    case 'SYNC/CLOSE_INFO_MSG':
      return { ...state, showInfoMsg: false };

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

    case 'SYNC/SET_VIDEOREFS':
      return {
        ...state,
        videoRef: action.payload.videoRef,
        parentVideoRef: action.payload.videoParentRef,
        videoType: action.payload.videoType,
        playerAPI: action.payload.playerAPI,
      };
    case 'SYNC/DOWPDOWN_CAROUSEL_STATE':
      console.log("DOWPDOWN_CAROUSEL_STATE - action.payload: ", action.payload); 
      const val: boolean = action.payload != null ? action.payload : !state.dropDownCarouselState;
      return { ...state, dropDownCarouselState: val };

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
  videoType: "VIDEO",
  selectedOnSceneChange: true,
  socketStatus: 'INIT',
  movieId: "",
  cards: [],
  filter: FilterTypeEnum.All,
  demo: "",
  currentTime: 0,
  timeMovie: 0,
  timeMovieSynced: 0,
  timeRatio: 1,
  lastUpdatedTime: 0,
  showInfoMsg: false,
  sceneCount: 0,
  dropDownCarouselState: false,
};
