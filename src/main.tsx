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

declare const KeyEvent: any;

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;
let APIinstance: EaAPI = null;

export interface IDiveConfig {
  platform?: 'HBBTV' | 'WEB';
  environment?: 'DEV' | 'PRE' | 'PRO';
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
};
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

  const APIinstance = new EaAPI(
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

    if (isDemo !== true) {
      store.dispatch(UIActions.setDivider(60));
    }
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
    { environment: options.environment, storeToken: "webstorage", apiKey, deviceId: userId },
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

      const testGroup = {
        top: "EMPTY",
        bottom: "CAROUSEL",
      };
      store.dispatch(UIActions.open(testGroup) as any);
      store.dispatch(UIActions.setDivider(0));

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

export const vodStart = (movieId: string, timestamp: number, videoRef?: HTMLVideoElement | HTMLObjectElement): any => {
  if (VOD_MODE === "ONE_SHOT") {
    return store.dispatch(SyncActions.staticVOD({ movieId, timestamp, videoRef }) as any);
  } else {
    return store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef }) as any);
  }
};

export const vodPause = () => {
  console.log("APIinstance.socket.authenticated: ", APIinstance.socket.authenticated);
  if (APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_pause", JSON.stringify({ timestamp: 0 }));
  }
};

export const vodResume = (timestamp: number) => {
  if (APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_continue", JSON.stringify({ timestamp: Math.max(0, timestamp | 0) }));
  }
};

export const vodSeek = (timestamp: number) => {
  if (APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_set", JSON.stringify({ timestamp: Math.max(0, timestamp | 0) }));
  }
};

export const vodEnd = () => {
  if (APIinstance.socket.authenticated) {
    APIinstance.socket.emit("vod_end");
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

  initialize('#root', vodKey, "test", 'en-UK', null, { environment: DIVE_ENVIRONMENT }).then((value) => {
    console.log("DO IT!!!");

    channelIsAvailable(TESTING_CHANNEL).then((val: boolean) => {
      console.log("channelIsAvailable: ", val);
    });

    vodIsAvailable('63501863951').then((val: boolean) => {
      console.log("vodIsAvailable: ", val);
    });

    vodStart('63501863951', 0);


  });
};




// index.html hot reload trick
/* DISABLED FOR WINDOWS 
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/


