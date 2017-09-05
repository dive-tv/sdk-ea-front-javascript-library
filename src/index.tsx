import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from './store';
import { App } from './containers/App';
import * as diveApi from 'api-typescript-library';

const store = configureStore();
const history = createBrowserHistory();
let DiveAPI: diveApi.DiveAPI;

export const initSDK = (params: { apiKey: string, deviceId: string, selector: string }) => {
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
  DiveAPI = new diveApi.DiveAPI(
    { env: "DEV", storeToken: "webstorage", apiKey: params.apiKey, deviceId: params.deviceId },
  );
  DiveAPI.setLocale("es-ES");
  DiveAPI.postTokenAndSave({ deviceId: this.deviceId, grantType: "device_credentials" })
    .then(() => {
      console.log("Authorized!");
      (window as any).DiveAPI = DiveAPI;
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
      DiveAPI.getCard({cardId: "76b9b155-80e9-457a-85bf-47bc535a2678"}, {mode: "no-cors"});
    });

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector(params.selector),
  );
};

export const API = DiveAPI;
