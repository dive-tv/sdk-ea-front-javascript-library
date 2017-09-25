import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import socketMiddleware from '../middleware/socket.middleware';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import {
    INavState, NavReducer, ISyncState, SyncReducer, IUIState, UIReducer,
} from 'Reducers';

declare const __ENV__: string;

const windowIfDefined = typeof window === 'undefined' ? null : window as any;
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

const getMiddlewares = () => {
  // if (__ENV__ !== "production") {
  //   return applyMiddleware(/*createLogger({
  //         predicate: () => (window as any).enableActionLogger,
  //     }),*/ thunk /*, persistedState*//*, socketMiddleware()*/);
  // } else {
    return applyMiddleware(thunk /*, persistedState,*/, socketMiddleware(), routerMiddleware(history));
  // }
};

export const store = createStore(
  combineReducers({
    nav: NavReducer,
    carousel: SyncReducer,
    ui: UIReducer,
    router: routerReducer,
  }),
  composeEnhancers(getMiddlewares()),
);
