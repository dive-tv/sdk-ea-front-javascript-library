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
// import Player from '@vimeo/player';

declare const KeyEvent: any;
declare const Vimeo: any;

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;
let APIinstance: EaAPI = null;

export interface IDiveConfig {
  platform?: 'HBBTV' | 'WEB';
  environment?: 'DEV' | 'PRE' | 'PRO';
  test?: boolean;
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
    console.error(`You should provide a unique client id in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
    throw new Error(`You should provide a unique client id in order to authenticate him,
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
  let { movieId, timestamp, videoRef, videoParent, isDemo } = params;
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


//LLAMADAS FINALES DEL API SDK

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

  if (typeof apiKey !== "string") {
    console.error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
    throw new Error("You should provide a Dive API KEY in the initialization parameter 'apiKey");
  }
  if (typeof userId !== "string") {
    console.error(`You should provide a unique client id in order to authenticate him,
      provide it through the initialization parameter 'clientId'`);
    throw new Error(`You should provide a unique client id in order to authenticate him,
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
    { environment: config.environment, storeToken: "webstorage", apiKey, deviceId: userId },
  );

  APIinstance.setLocale(locale);
  // APIinstance.setLocale("es-ES");
  (window as any).DiveAPI = APIinstance;
  return APIinstance.loginWithDevice(userId)
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



    })
    .catch((error: any) => {
      console.error("ERROR LOADING", error);
    });




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
          console.log("RESPONDE VOD AVAILABLE: ", response)
          resolve(response[0].ready);
        }

      })
      .catch((error: any) => {
        console.error("ERROR LOADING", error);
      });
  });
};

// tslint:disable-next-line:max-line-length
export const vodStart = (movieId: string, timestamp: number, videoRef?: HTMLVideoElement | HTMLObjectElement, params?: { demo: boolean, videoParent?: HTMLElement }): any => {
  let ret;
  const videoParentRef = params && params.videoParent ? params.videoParent : null;
  if (VOD_MODE === "ONE_SHOT") {
    ret = store.dispatch(SyncActions.staticVOD({ movieId, timestamp, videoRef, videoParentRef }) as any);
  } else {
    ret = store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef, videoParentRef }) as any);
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
export const vodVimeoStart = (movieId: string, timestamp: number, videoRef?: HTMLIFrameElement, params?: { demo: boolean, videoParent?: HTMLElement }): any => {
  let ret;
  const videoParentRef = params && params.videoParent ? params.videoParent : null;
  const script = document.createElement('script');
  script.src = 'https://player.vimeo.com/api/player.js?retert=34535';
  script.onload = () => {
    // const player = new Player(videoRef, {});
    const player = new Vimeo.Player(videoRef);
    if (VOD_MODE === "ONE_SHOT") {
      ret = store.dispatch(SyncActions.staticVOD({ movieId, timestamp, player, videoParentRef }) as any);
    } else {
      ret = store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", player, videoParentRef }) as any);
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
  document.head.appendChild(script);

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


//TESTS

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

  initialize('#root', stcKey, "test", 'en-UK', null, { environment: 'PRO' }).then((value) => {
    console.log("DO IT!!!");

    /*channelIsAvailable(TESTING_CHANNEL).then((val: boolean) => {
      console.log("channelIsAvailable: ", val);
    });*/

    vodIsAvailable('63501863951').then((val: boolean) => {
      console.log("vodIsAvailable: ", val);
    });

    const movieFootballMatch: string = '15e640df-3f1b-34c2-a8b9-e982077cad9a';
    const movieNewYear: string = '3783561e-7143-3552-8b07-01f2bb54f38d';
    const movieSideways: string = '31f4ea4f-cf8b-389a-a17d-61c8b53a13fb';
    const movieWhiteFamous: string = 'e94796cf-9aff-3c21-900e-fba94a337f7c';
    vodStart(movieFootballMatch, 0);


  });
};




// index.html hot reload trick
/* DISABLED FOR WINDOWS 
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/


