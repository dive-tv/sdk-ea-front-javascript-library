import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ShadowDOM from 'react-shadow';

import { store } from './store/store';
import { App } from 'Containers';
import { AccessToken, DiveAPIClass } from "@dive-tv/api-typescript-library";
import { Card, KeyMap } from 'Services';
import { DIVE_ENVIRONMENT, changeVodSelector } from 'Constants';
import * as css from './scss/main.scss';

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
        vodOptions?: {
            vodSelector: string,
            vodSync: "ONE_SHOT" | "STREAMING",
        } }) => {
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
    if (params.vodOptions && params.vodOptions.vodSelector) {
        changeVodSelector(params.vodOptions.vodSelector);
    }
    try {
        if (KeyEvent) {
            const km: any = KeyMap;
            km.UP = KeyEvent.VK_UP;
            km.DOWN = KeyEvent.VK_DOWN;
            km.LEFT = KeyEvent.VK_LEFT;
            km.RIGHT = KeyEvent.VK_RIGHT;
            km.ENTER = KeyEvent.VK_ENTER;
        }
    } catch (e) {
        console.error("NO KEYMAP FOUND");
    }

    const APIinstance = new DiveAPIClass(
        { env: DIVE_ENVIRONMENT, storeToken: "webstorage", apiKey: params.apiKey, deviceId: params.deviceId },
    );
    // APIinstance.basePath = APIinstance.basePath.replace("https", "http://192.168.17.47:3000/proxy?url=https");
    console.log("BP", APIinstance.basePath);
    APIinstance.setLocale("es-ES");
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
                <div className="diveContainer" style={{ width: "100%", height: "100%"}}>
                    <style scoped={true}>{css[0][1]}</style>
                    <Provider store={store}>
                        <App showMenu={showMenu}/>
                    </Provider>
                </div>
                //</ShadowDOM >,
                ,
                document.querySelector(params.containerSelector),
            );
        })
        .catch((error) => {
            console.error("ERROR LOADING", error);
        });
};

// tslint:disable-next-line:max-line-length
// init({ selector: "#root", apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT", deviceId: "test" });

// index.html hot reload trick
/* DISABLED FOR WINDOWS
declare const __ENV__: any;
if (__ENV__ !== 'production') {
    require('file-loader!./index.html');
}*/
