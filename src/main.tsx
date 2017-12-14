import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ShadowDOM from 'react-shadow';

import { store } from './store/store';
import { App } from 'Containers';
import { Card, KeyMap, loadHbbtvKeys, AccessToken, EaAPI } from 'Services';
import { DIVE_ENVIRONMENT, TESTING_CHANNEL, changeVodSelector, changeVodParentSelector, VOD_MODE } from 'Constants';
import * as css from './scss/main.scss';
import { UIActions, SyncActions } from 'Actions';
import { Theme } from 'Components';
import { ITheme } from 'Theme';

declare const KeyEvent: any;
declare const Vimeo: any;

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;

export const init = (params: {
  showMenu: boolean,
  apiKey: string,
  deviceId: string,
  selector: string,
  theme?: ITheme,
}) => {
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
  console.log("BP", APIinstance.basePath);
  APIinstance.setLocale("en");
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
      //APIinstance.getStaticMovieScene({ relations: true, clientMovieId: "m00001", timestamp: 4000 })
      //.then((response: Card[]) => {
      /*const newCards: any[] = [
          { card_id: "28e7cb52-01a2-3e95-a71f-4fc2d3e46f86", version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
          { card_id: "bd4f26ba-0c2a-3a16-bb7b-79aa066abf44"/*, version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" *///},
      //{ card_id: "e0143d7b-1e76-11e6-97ac-0684985cbbe3"/*, version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" */},

      //];
      //response = [...newCards, ...response];
      //console.log("response: ", response);
      // const theme = {/*background:"green", text:"fuchsia", title: "blue", backgroundCardSection: "orange", backgroundCarouselCard:"cyan"*/};
      //response = [...newCards, ...response];
      //console.log("response: ", response);

      ReactDOM.render(
        //<ShadowDOM /*include={'styles.css'}*/>
        <div className="diveContainer">
          <style /*scoped={true}*/>{css[0][1]}</style>
          <Theme theme={params.theme} />
          <Provider store={store}>
            <App showMenu={params.showMenu} />
          </Provider>
        </div>
        //</ShadowDOM >,
        ,
        document.querySelector(params.selector),
      );
    })
    .catch((error) => {
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

export function test() {
  // tslint:disable-next-line:max-line-length
  init({
    selector: "#root",
    apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT",
    deviceId: "test",
    showMenu: false,
    theme: {},
  })
    .then(() => {
      const testGroup = {
        top: "EMPTY",
        bottom: "CAROUSEL",
      };
      store.dispatch(UIActions.open(testGroup) as any);
      store.dispatch(SyncActions.syncChannel(TESTING_CHANNEL) as any);
    });
}

function getIdByProvider(): string {
  switch (window.location.host) {
    case "www.rtve.es": {
      const pos = window.location.href.search(/\/\d{7}/g) + 1;
      return window.location.href.substr(pos, 7);
    }
    case "www.clarovideo.com":
    case "www.clarovideo.com.mx": {
      const pos = window.location.href.search(/=\d{6}/g) + 1;
      return window.location.href.substr(pos, 7);
    }
    case "play.starzplayarabia.com": {
      const arr = window.location.href.split('/');
      let spId = '';

      // tslint:disable-next-line:prefer-conditional-expression
      if (arr[arr.length - 3] === 'movies') {
        // Para las movies se devuelve la última parte de la url (ejemplo: 64860712307)
        // https://play.starzplayarabia.com/en/movies/hitch/23950888433
        spId = arr[arr.length - 1];
      } else {
        // Para el caso de la serie, se cogen las dos últimas partes de la url (ejemplo: 36008488058/s2e12)
        // https://play.starzplayarabia.com/en/series/sons-of-anarchy/47919656343/s1e3
        spId = arr[arr.length - 2] + '-' + arr[arr.length - 1];
      }
      console.log("spId: ", spId);
      return spId;
    }

    case 'infomix.tv':
      const id = window.location.href.split("infomix.tv/")[1];
      return id;
  }
}

function getRefsByProvider(): Promise<{
  videoRef: HTMLVideoElement | HTMLObjectElement,
  videoParent?: HTMLElement,
}> {
  return new Promise((resolve, reject) => {
    // videoRef: HTMLVideoElement | HTMLObjectElement, videoParent?: HTMLElement
    switch (window.location.host) {
      case "www.rtve.es": {
        resolve({
          videoRef: document.getElementsByClassName('vjs-tech')[0] as HTMLVideoElement,
          videoParent: document.getElementsByClassName('video-js')[0] as HTMLElement,
        });
      }
      case "www.clarovideo.com":
      case "www.clarovideo.com.mx": {
        resolve({
          videoRef: document.getElementById('video') as HTMLVideoElement,
          videoParent: document.getElementsByTagName('vph5-container')[0] as HTMLElement,
        });
      }
      case "play.starzplayarabia.com": {
        resolve({
          videoRef: document.getElementById('bitdash-video-starzplayer') as HTMLVideoElement,
          videoParent: document.getElementsByTagName('starzplayer')[0] as HTMLElement,
        });
      }
      case 'infomix.tv': {
        const script = document.createElement('script');
        script.src = "https://player.vimeo.com/api/player.js?retert=34535";
        script.onload = () => {
          const iframe = document.querySelector('iframe');
          const player = new Vimeo.Player(iframe);
          resolve({
            videoRef: player as HTMLVideoElement,
            videoParent: document.querySelector('iframe') as HTMLElement,
          });
        }
        document.head.appendChild(script);
      }
    }
  })
}

export function demoVOD() {

  getRefsByProvider().then((vodRefs) => {
    const { videoRef, videoParent } = vodRefs;
    init({
      selector: "#root",
      apiKey: "cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2",
      deviceId: "test",
      showMenu: false,
    })
      .then(() => {
        let movieId = getIdByProvider();
        // movieId = "577062"; // Creo que es sex and the city.
        // movieId = '63501863951'; // Jurassic World
        return syncVOD({ movieId, timestamp: (videoRef as any).currentTime, videoRef, videoParent });
      })
      .then(() => {
        store.dispatch(UIActions.open({
          top: 'VODVIDEO',
          bottom: 'CAROUSEL',
        }) as any);
        // store.dispatch(UIActions.setDivider(100));
      });
  })
}

export function syncVOD(params: {
  movieId: string,
  timestamp: number,
  theme?: ITheme,
  videoRef: HTMLVideoElement | HTMLObjectElement,
  videoParent?: HTMLElement,
}) {
  const { movieId, timestamp, videoRef, videoParent } = params;
  if (VOD_MODE === "ONE_SHOT") {
    return store.dispatch(SyncActions.staticVOD({ movieId, timestamp, videoRef, videoParentRef: videoParent }) as any);
  } else {
    return store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https", videoRef, videoParentRef: videoParent }) as any);
  }
}


// index.html hot reload trick
/* DISABLED FOR WINDOWS 
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/
