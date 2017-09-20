import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ShadowDOM from 'react-shadow';

import { store } from './store/store';
import { App } from 'Containers';
import { AccessToken, DiveAPIClass } from "@dive-tv/api-typescript-library";
import { Card } from 'Services';

const history = createBrowserHistory();
// let DiveAPI: diveApi.DiveAPI;

export const init = (params: { apiKey: string, deviceId: string, selector: string }) => {
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
    const APIinstance = new DiveAPIClass(
        { env: "PRE", storeToken: "cookies", apiKey: params.apiKey, deviceId: params.deviceId },
    );
    APIinstance.setLocale("es-ES");
    (window as any).DiveAPI = APIinstance;
    APIinstance.postTokenAndSave({ deviceId: this.deviceId, grantType: "device_credentials" })
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
            ReactDOM.render(
                //<ShadowDOM /*include={'styles.css'}*/>
                  <div className="diveContainer">
                    <link href="/styles.css" rel="stylesheet" />
                    <Provider store={store}>
                        <App />
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
    /*DiveAPI.getCard({cardId: "c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3"}).catch((response) => {
      console.warn(response);
    });*/
    //DiveAPI.getStaticMovieScene({relations: true, clientMovieId: "", timestamp: 1500});
    // console.log("STYLES", styles);
    //});
};

// init({ selector: "#root", apiKey: "dG91Y2h2aWVfYXBpOkYyUUhMZThYdEd2R1hRam50V3FMVXFjdGI5QmRVdDRT", deviceId: "test" });

// index.html hot reload trick
if (process.env.NODE_ENV !== 'production') {
  require('file-loader!./index.html');
}
