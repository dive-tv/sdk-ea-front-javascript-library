import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ShadowDOM from 'react-shadow';

import { store } from './store/store';
import { App } from 'Containers';
import { AccessToken, DiveAPIClass } from "@dive-tv/api-typescript-library";
import { Card, KeyMap, loadHbbtvKeys } from 'Services';
import { DIVE_ENVIRONMENT, TESTING_CHANNEL, changeVodSelector, changeVodParentSelector, VOD_MODE } from 'Constants';
import * as css from './scss/main.scss';
import { UIActions, SyncActions } from 'Actions';
import { Theme } from 'Components';
import { ITheme } from 'Theme';

declare const KeyEvent: any;

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;

// tslint:disable-next-line:max-line-length
export const init = (
    params: {
        apiKey: string,
        deviceId: string,
        containerSelector: string,
        showMenu?: boolean,
        theme?: ITheme,
        vodOptions?: {
            vodSelector: string,
            vodSync: "ONE_SHOT" | "STREAMING",
            vodParent?: string,
        },
    }) => {
    return new Promise((resolve, reject) => {
        const showMenu = params.showMenu === undefined ? false : params.showMenu;
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
        if (params.vodOptions) {
            if (params.vodOptions.vodSelector) {
                changeVodSelector(params.vodOptions.vodSelector);
            }
            if (params.vodOptions.vodParent) {
                changeVodParentSelector(params.vodOptions.vodParent);
            }
        }
        try {
            if (KeyEvent) {
                loadHbbtvKeys();
            }
        } catch (e) {
            console.error("NO KEYMAP FOUND");
        }

        const APIinstance = new DiveAPIClass(
            { env: DIVE_ENVIRONMENT, storeToken: "webstorage", apiKey: params.apiKey, deviceId: params.deviceId },
        );
        // APIinstance.basePath = APIinstance.basePath.replace("https", "http://192.168.0.100:3000/proxy?url=https");
        console.log("BP", APIinstance.basePath);
        APIinstance.setLocale("es-MX");
        console.log("Setted locale");
        (window as any).DiveAPI = APIinstance;
        console.log("global instance");
        APIinstance.postTokenAndSave({ deviceId: this.deviceId, grantType: "device_credentials" })
            .then((response: AccessToken) => {
                console.log("Authorized!");
                (window as any).DiveAPI = APIinstance;
                // tslint:disable-next-line:no-console
                console.log("DiveAPI generated, available through DiveSDK.API or window.DiveAPI (global)");
                if (typeof params.containerSelector !== "string") {
                    console.error(`You should provide a selector that resolves to an existing DOM Element
                        in the initialization parameter 'selector'`);
                    throw new Error(`You should provide a selector that resolves to an existing DOM Element
                        in the initialization parameter 'selector'`);
                }
                return true;
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
                console.log("MOUNTING REACT");
                ReactDOM.render(
                    //<ShadowDOM /*include={'styles.css'}*/>
                    <div className="diveContainer" style={{ width: "100%", height: "100%" }}>
                        <style /*scoped={true}*/>{css[0][1]}</style>
                        <Theme theme={params.theme} />
                        <Provider store={store}>
                            <App showMenu={showMenu} />
                        </Provider>
                    </div>
                    //</ShadowDOM >,
                    ,
                    document.querySelector(params.containerSelector),
                );
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error("ERROR LOADING", error);
                reject(`ERROR LOADING: ${error}`);
            });
    });
};

export function test() {
    // tslint:disable-next-line:max-line-length
    init({
        containerSelector: "#root",
        apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT",
        deviceId: "test",
        vodOptions: { vodParent: ".video-js", vodSelector: ".vjs-tech", vodSync: "STREAMING" },
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
    }
}

export function demoVOD(withVideo = false) {
    // tslint:disable-next-line:max-line-length
    if (withVideo === true) {
        const testVideo = document.createElement("video");
        testVideo.setAttribute("controls", "controls");
        testVideo.src = 'http://media.w3.org/2010/05/bunny/movie.mp4';
        (document.body as any).prepend(testVideo);
        testVideo.play();
    }
    init({
        containerSelector: "#root",
        apiKey: "cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2",
        deviceId: "test",
        vodOptions: { vodParent: ".vph5-player", vodSelector: "#video", vodSync: "STREAMING" },
        showMenu: false,
    })
        .then(() => {
            let movieId = getIdByProvider();
            movieId = "577062";
            return syncVOD({ movieId, timestamp: store.getState().carousel.currentTime || 1 });
        })
        .then(() => {
            store.dispatch(UIActions.open({
                top: 'VODVIDEO',
                bottom: 'CAROUSEL',
            }) as any);
        });
}

export function syncVOD(params: { movieId: string, timestamp: number, theme?: ITheme }) {
    const { movieId, timestamp } = params;
    if (VOD_MODE === "ONE_SHOT") {
        return store.dispatch(SyncActions.staticVOD({ movieId, timestamp }) as any);
    } else {
        return store.dispatch(SyncActions.syncVOD({ movieId, timestamp, protocol: "https" }) as any);
    }
}

// tslint:disable-next-line:max-line-length
// demoRTVE();
// test();
// demoVOD(true);

/*init({
    selector: "#root",
    apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT",
    deviceId: "test",
    //theme: { background: 'green' },
});*/

// index.html hot reload trick
/* DISABLED FOR WINDOWS
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/
