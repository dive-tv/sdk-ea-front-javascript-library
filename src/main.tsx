import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ShadowDOM from 'react-shadow';

import { store } from './store/store';
import { App } from 'Containers';
import { Card, KeyMap, loadHbbtvKeys, AccessToken, EaAPI, MovieStatus, ChannelStatus, DemoService } from 'Services';
import { DIVE_ENVIRONMENT, TESTING_CHANNEL, changeVodSelector, changeVodParentSelector, VOD_MODE } from 'Constants';
import * as css from './scss/main.scss';
import { UIActions, SyncActions, SocketActions } from 'Actions';
import { Theme, Main } from 'Components';
import { ITheme } from 'Theme';
import * as Vimeo from 'Vimeo';
import { VideoType } from 'Reducers';
// import * as Vimeo from './services/vimeo-player';

// import Vimeo = require('./services/vimeo-player');
// import Player from '@vimeo/player';
// const Vimeo: any = require('Vimeo');

declare const KeyEvent: any;
// declare const Vimeo: any;

let videoType: VideoType = "VIDEO";

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;
let APIinstance: EaAPI = null;

export const getVimeo = () => Vimeo;
export interface IDiveConfig {
  platform?: 'HBBTV' | 'WEB';
  environment?: 'DEV' | 'PRE' | 'PRO';
  test?: boolean;
  token?: any;
}

export interface IInitParams {
  showMenu: boolean;
  apiKey: string;
  deviceId: string;
  selector: string;
  theme?: ITheme;
  platform?: 'HBBTV' | 'WEB';
}

export let config: IDiveConfig = {
  platform: 'WEB',
  environment: DIVE_ENVIRONMENT,
  test: false,
};

/*DEPRECADA */
export const init = (params: IInitParams) => {

  if (params && params.platform != null) {
    config.platform = params.platform;
  }

  if (typeof params !== "object") {
    console.error("You should provide initialization parameters as an object.");
    throw new Error("You should provide initialization parameters as an object.");
  }
  if (typeof params.apiKey !== "string") {
    console.error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
    throw new Error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
  }
  if (typeof params.deviceId !== "string") {
    console.error(`You should provide a unique deviceId id in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
    throw new Error(`You should provide a unique deviceId id in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
  }

  try {
    if (KeyEvent) {
      loadHbbtvKeys();
    }
  } catch (e) {
    console.error("NO KEYMAP FOUND");
  }

  APIinstance = new EaAPI(
    { env: DIVE_ENVIRONMENT, storeToken: "webstorage", apiKey: params.apiKey, deviceId: params.deviceId },
  );

  console.log("BP basePath", APIinstance.basePath);
  APIinstance.setLocale("en-UK");
  // APIinstance.setLocale("es-ES");
  (window as any).DiveAPI = APIinstance;
  return APIinstance.loginWithDevice(params.deviceId)
    .then((response: AccessToken) => {
      console.log("Authorized!");
      (window as any).DiveAPI = APIinstance;
      // tslint:disable-next-line:no-console
      console.log("DiveAPI generated, available through DiveSDK.API or window.DiveAPI (global)");
      if (typeof params.selector !== "string") {
        console.error(`You should provide a selector that resolves to an existing DOM Element
        in the initialization parameter 'selector'`);
        throw new Error(`You should provide a selector that resolves to an existing DOM Element
        in the initialization parameter 'selector'`);
      }
    })
    .then(() => {
      // const theme = {/*background:"green", text:"fuchsia", title: "blue", backgroundCardSection: "orange", backgroundCarouselCard:"cyan"*/};

      ReactDOM.render(
        <Main showMenu={params.showMenu} theme={params.theme} platform={config.platform} />,
        document.querySelector(params.selector),
      );
    })
    .catch((error: any) => {
      console.error("ERROR LOADING", error);
    });
  /*
  DiveAPI.getCard({cardId: "c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3"}).catch((response) => {
    console.warn(response);
  });
  */
  // DiveAPI.getStaticMovieScene({relations: true, clientMovieId: "", timestamp: 1500});
  // console.log("STYLES", styles);
  // });
};

export const demoVOD = () => DemoService.demoVOD(init, syncVOD, vodResume, vodPause);

export interface ISyncVODParams {
  movieId: string;
  timestamp: number;
  theme?: ITheme;
  videoRef: HTMLVideoElement | HTMLObjectElement;
  videoParent?: HTMLElement;
  isDemo?: boolean;
}

/*DEPRECADA*/
export const syncVOD = (params: ISyncVODParams) => {
  const { movieId, videoRef, videoParent, isDemo } = params;
  let { timestamp } = params;
  timestamp = timestamp || 1;
  if (VOD_MODE === "ONE_SHOT") {
    store.dispatch(SyncActions.staticVOD({ movieId, timestamp, videoRef, videoParentRef: videoParent }) as any);
  } else {
    store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef, videoParentRef: videoParent }) as any);
  }
  if (videoRef != null) {
    store.dispatch(UIActions.open({
      top: 'VODVIDEO',
      bottom: 'CAROUSEL',
    }) as any);

    /*if (isDemo !== true) {
      store.dispatch(UIActions.setDivider(60));
    }*/
  }
};

// LLAMADAS FINALES DEL API SDK

export const initialize = (
  selector: string,
  apiKey: string,
  userId: string,
  locale?: string,
  theme?: ITheme,
  options?: IDiveConfig,
): Promise<void> => {
  if (APIinstance && APIinstance.socket) {
    APIinstance.socket.close();
  }

  if (options != null) {
    config = { ...config, ...options };
  }
  console.log("[initialize] options: ", options);
  if (typeof locale !== "string") {
    locale = 'en-UK';
  }

  if (typeof apiKey !== "string" && config.token == null) {
    console.error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
    throw new Error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
  }
  if (typeof userId !== "string" && config.token == null) {
    console.error(`You should provide a unique client id (or token) in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
    throw new Error(`You should provide a unique client id (or token) in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
  }

  try {
    if (KeyEvent) {
      loadHbbtvKeys();
    }
  } catch (e) {
    console.error("NO KEYMAP FOUND");
  }
  if (config.token != null) {
    APIinstance = new EaAPI(
      { environment: config.environment, storeToken: "webstorage", deviceId: null },
    );

  } else {
    APIinstance = new EaAPI(
      { environment: config.environment, storeToken: "webstorage", apiKey, deviceId: userId },
    );
  }


  APIinstance.setLocale(locale);
  // APIinstance.setLocale("es-ES");
  (window as any).DiveAPI = APIinstance;

  let call: any;
  if (!config.token) {
    console.log("[loginWithDevice]");
    call = APIinstance.loginWithDevice(userId);
  } else {
    console.log("[loginWithToken]");
    call = APIinstance.loginWithToken(config.token);
    // render();
    call = new Promise<any>((resolve, reject) => {
      resolve();
    });
  }

  return call
    .then((response: AccessToken) => {
      // tslint:disable-next-line:no-console
      console.log("Authorized!");
      (window as any).DiveAPI = APIinstance;
      // tslint:disable-next-line:no-console
      console.log("DiveAPI generated, available through DiveSDK.API or window.DiveAPI (global)");
      if (typeof selector !== "string") {
        // tslint:disable-next-line:no-console
        console.error(`You should provide a selector that resolves to an existing DOM Element
        in the initialization parameter 'selector'`);
        throw new Error(`You should provide a selector that resolves to an existing DOM Element
        in the initialization parameter 'selector'`);
      }
    })
    .then(() => {
      render();
    })
    .catch((error: any) => {
      console.error("ERROR LOADING", error);
    });

  function render() {
    ReactDOM.render(
      // ShadowDOM /*include={'styles.css'}*/>
      <Main showMenu={false} theme={theme} platform={config.platform} />,
      document.querySelector(selector),
    );
    let group;
    if (config.test !== true) {
      group = {
        top: "EMPTY",
        bottom: "CAROUSEL",
      };
      store.dispatch(UIActions.open(group) as any);
      store.dispatch(UIActions.setDivider(0));
    }
  }
};

export const vodIsAvailable = (movieId: string): Promise<boolean> => {
  if (APIinstance == null) {
    console.error("APIinstance is null. initialize() is needed.");
  }

  return new Promise((resolve, reject) => {
    APIinstance.getReadyMovies({ clientMovieIdList: [movieId] })
      .then((response: MovieStatus[]) => {
        // TODO
        if (response !== undefined && response.length >= 1) {
          console.log("RESPONDE VOD AVAILABLE: ", response);
          resolve(response[0].ready);
        }

      })
      .catch((error: any) => {
        console.error("ERROR LOADING", error);
      });
  });
};

// tslint:disable-next-line:max-line-length
export const vodStart = (movieId: string, timestamp: number, videoRef?: HTMLVideoElement | HTMLObjectElement, params?: { demo: boolean, videoParent?: HTMLElement, playerAPI: any }): any => {
  let ret;
  const videoParentRef = params && params.videoParent ? params.videoParent : null;
  console.log("APIinstance.socket.authenticated: ", APIinstance.socket.authenticated);
  if (VOD_MODE === "ONE_SHOT") {
    ret = store.dispatch(SyncActions.staticVOD({ movieId, timestamp, videoRef, videoParentRef, videoType, playerAPI: params.playerAPI }) as any);
  } else {
    
    if (params != undefined && params.playerAPI !== undefined) {
      console.log("params (with playerAPI) : ", params);
      ret = store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef, videoParentRef, videoType, playerAPI: params.playerAPI }) as any);
    } else {
      console.log("params (without playerAPI) : ", params);
      ret = store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef, videoParentRef, videoType }) as any);
    }
  }

  if (params && params.demo) {
    if (videoRef != null) {
      store.dispatch(UIActions.open({
        top: 'VODVIDEO',
        bottom: 'CAROUSEL',
      }) as any);
    }
  }
  return ret;
};
// tslint:disable-next-line:max-line-length
export const vodVimeoStart = (movieId: string, timestamp: number, videoRef?: HTMLIFrameElement, params?: { demo: boolean, videoParent?: HTMLElement, playerAPI: any }): any => {
  const videoParentRef = params && params.videoParent ? params.videoParent : null;
  const player = new Vimeo(videoRef);
  videoType = "VIMEO";
  return vodStart(movieId, timestamp, player, params);
};

// tslint:disable-next-line:max-line-length
export const vodYoutubeStart = (movieId: string, timestamp: number, player: any, params?: { demo: boolean, videoParent?: HTMLElement }): any => {
  const videoParentRef = params && params.videoParent ? params.videoParent : null;
  videoType = "YOUTUBE";
  return vodStart(movieId, timestamp, player.a, { ...params, playerAPI: player });
};

export const vodPause = () => {
  console.log("APIinstance.socket.authenticated: ", APIinstance.socket.authenticated);
  if (APIinstance && APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_pause", JSON.stringify({ timestamp: 0 }));
  } else {
    console.error("APIinstance is null. initialize() is needed.");
  }
};

export const vodResume = (timestamp: number) => {
  if (APIinstance && APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_continue", JSON.stringify({ timestamp: Math.max(0, timestamp | 0) }));
  } else {
    console.error("APIinstance is null. initialize() is needed.");
  }
};

export const vodSeek = (timestamp: number) => {
  console.log(APIinstance);
  if (APIinstance && APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_set", JSON.stringify({ timestamp: Math.max(0, timestamp | 0) }));
  } else {
    console.error("APIinstance is null. initialize() is needed.");
  }
};

export const vodEnd = () => {
  if (APIinstance && APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_end");
  } else {
    console.error("APIinstance is null. initialize() is needed.");
  }
};

export const channelIsAvailable = (channelId: string): Promise<boolean> => {
  if (APIinstance == null) {
    console.error("APIinstance is null. initialize() is needed.");
  }

  return new Promise((resolve, reject) => {
    APIinstance.getReadyChannels({ channelIdList: [channelId] })
      .then((response: ChannelStatus[]) => {
        // TODO
        if (response !== undefined && response.length >= 1) {
          resolve(response[0].ready);
        }

      })
      .catch((error: any) => {
        console.error("ERROR LOADING", error);
      });
  });
};

export const tvStart = (channelId: string) => {
  return store.dispatch(SyncActions.syncChannel(channelId) as any);
};

export const show = () => {
  store.dispatch(UIActions.open({
    bottom: 'CAROUSEL',
  }) as any);
};

export const hide = () => {
  store.dispatch(UIActions.open({
    bottom: 'HIDE',
  }) as any);
};

// TESTS
export const test = () => {
  // tslint:disable-next-line:max-line-length
  init({
    selector: "#root",
    apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT",
    deviceId: "test",
    showMenu: false,
    theme: {},
    platform: 'HBBTV',
  })
    .then(() => {
      const testGroup = {
        top: "EMPTY",
        bottom: "CAROUSEL",
      };
      store.dispatch(UIActions.open(testGroup) as any);
      store.dispatch(SyncActions.syncChannel(TESTING_CHANNEL) as any);
    });
};

export const test2 = () => {
  const vodKey = 'cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2';
  const testKey = 'dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT';
  const stcKey = 'c3RjX2VhX2RldmljZTpuOGpqUzZBczk4dEFHdWFOeDc1aVhRZlBHV2NQNmVyRA==';
  const infomixKey = 'aW5mb21peF9lYV90ZXN0OlB0WlRidEU0OW9zU1dzVmlrUFhDUjUzc1JzWEdZeEFv';


  const tempToken = '{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3RyZWFtLXNlcnZlciIsImFwaS1zZXJ2ZXIiLCJkaXZlLXNlcnZlciIsIm9hdXRoLXNlcnZlciJdLCJncmFudF90eXBlIjoidXNlcl9jcmVkZW50aWFscyIsInVzZXJfaWQiOiJkaXZlLmRlbW8iLCJzY29wZSI6WyJkZXZpY2UiLCJ1c2VyIl0sImV4cCI6MTUyNDgzMzg4MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DQVRBTE9HIiwiUk9MRV9MSVNUUyIsIlJPTEVfREVNT19MT0dJTiIsIlJPTEVfT05FX1NIT1QiLCJST0xFX0FSX0xPR0lOIiwiUk9MRV9GVUxMX0NBUlJPVVNFTCIsIlJPTEVfUFJPRklMRSIsIlJPTEVfRlVMTF9DQVJST1VTRUxfQ0hBTk5FTCIsIlJPTEVfUE9DS0VUIiwiUk9MRV9UVl9HUklEIiwiUk9MRV9BUl9TRUFSQ0giLCJST0xFX09ORV9TSE9UX0NIQU5ORUwiLCJST0xFX0ZFRURCQUNLIiwiUk9MRV9BTEFSTSIsIlJPTEVfQ0FSRF9ERVRBSUwiLCJST0xFX0RFTU9fUExBWUJBQ0siLCJST0xFX0FSX0NBVEFMT0ciXSwiY2xpZW50X2lkIjoiZGl2ZV9kZW1vIiwianRpIjoiZmM2NTc0MzctNTRkZS00MDNkLTllNjUtNWQ1OTVjMDY2Yzg4In0.WrC1kvv9AeSXhtl_1De3HA-jx1Xb77Nok3Y8LsM5RS8","token_type":"bearer","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3RyZWFtLXNlcnZlciIsImFwaS1zZXJ2ZXIiLCJkaXZlLXNlcnZlciIsIm9hdXRoLXNlcnZlciJdLCJncmFudF90eXBlIjoidXNlcl9jcmVkZW50aWFscyIsInVzZXJfaWQiOiJkaXZlLmRlbW8iLCJzY29wZSI6WyJkZXZpY2UiLCJ1c2VyIl0sImF0aSI6ImZjNjU3NDM3LTU0ZGUtNDAzZC05ZTY1LTVkNTk1YzA2NmM4OCIsImV4cCI6MTU0MDM3Njg4MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DQVRBTE9HIiwiUk9MRV9MSVNUUyIsIlJPTEVfREVNT19MT0dJTiIsIlJPTEVfT05FX1NIT1QiLCJST0xFX0FSX0xPR0lOIiwiUk9MRV9GVUxMX0NBUlJPVVNFTCIsIlJPTEVfUFJPRklMRSIsIlJPTEVfRlVMTF9DQVJST1VTRUxfQ0hBTk5FTCIsIlJPTEVfUE9DS0VUIiwiUk9MRV9UVl9HUklEIiwiUk9MRV9BUl9TRUFSQ0giLCJST0xFX09ORV9TSE9UX0NIQU5ORUwiLCJST0xFX0ZFRURCQUNLIiwiUk9MRV9BTEFSTSIsIlJPTEVfQ0FSRF9ERVRBSUwiLCJST0xFX0RFTU9fUExBWUJBQ0siLCJST0xFX0FSX0NBVEFMT0ciXSwiY2xpZW50X2lkIjoiZGl2ZV9kZW1vIiwianRpIjoiYWZmMjVmYjEtZDczMi00NWU1LWFhMTEtYjg2YTRhOTFmMWUyIn0.s-1qiS2ewrhcD7K64IWCAvpV5cJpwf6cU9cxYWabNAI","expires_in":8998,"scope":"device user","user_id":"dive.demo","client_id":"dive_demo","jti":"fc657437-54de-403d-9e65-5d595c066c88"}';

  initialize('#root', null, "test", 'es-ES', null, { environment: 'PRO', token: JSON.parse(tempToken) }).then((value) => {
    console.log("DO IT!!!");

    //STC
    const movieFootballMatch: string = '15e640df-3f1b-34c2-a8b9-e982077cad9a';
    const movieNewYear: string = '3783561e-7143-3552-8b07-01f2bb54f38d';
    const movieSideways: string = '31f4ea4f-cf8b-389a-a17d-61c8b53a13fb';
    const movieWhiteFamous: string = 'e94796cf-9aff-3c21-900e-fba94a337f7c';

    //Infomix
    const infomix1: string = '259933678';
    const infomix2: string = '259934039';
    const infomix3: string = '259934261';
    const infomix4: string = '259934477';

    const movieTest: string = '0435786a-350a-3930-90b8-3d9bac14e5f3';

    vodStart(movieTest, 0);

  });
};

export const testYoutube = () => {
  const vodKey = 'cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2';
  const testKey = 'dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT';
  const stcKey = 'c3RjX2VhX2RldmljZTpuOGpqUzZBczk4dEFHdWFOeDc1aVhRZlBHV2NQNmVyRA==';

  initialize('#root', stcKey, "test", 'en-UK', null, { environment: 'PRO' }).then((value) => {
    vodIsAvailable('63501863951').then((val: boolean) => {
      console.log("vodIsAvailable: ", val);
    });

    const ytPlayerRef: HTMLDivElement = document.querySelector('#ytPlayer');
    const YTClass: any = (window as any).YT;
    const player = new YTClass.Player('ytPlayer', { height: '360', width: '640', videoId: 'M7lc1UVf-VE' });
    (window as any).player = player;
    const movieFootballMatch: string = '15e640df-3f1b-34c2-a8b9-e982077cad9a';
    const movieNewYear: string = '3783561e-7143-3552-8b07-01f2bb54f38d';
    const movieSideways: string = '31f4ea4f-cf8b-389a-a17d-61c8b53a13fb';
    const movieWhiteFamous: string = 'e94796cf-9aff-3c21-900e-fba94a337f7c';
    vodYoutubeStart(movieNewYear, 0, player, { demo: true, videoParent: player.a.parentElement });
  });
};

// index.html hot reload trick
/* DISABLED FOR WINDOWS 
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/


