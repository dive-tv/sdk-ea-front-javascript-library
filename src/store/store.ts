import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import socketMiddleware from '../middleware/socket.middleware';
import undoable, { includeAction } from 'redux-undo';


import {
    INavState, NavReducer, ISyncState, SyncReducer, IUIState, UIReducer
} from 'Reducers';

declare const __ENV__: string;

const windowIfDefined = typeof window === 'undefined' ? null : window as any;
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const getMiddlewares = () => {
  // if (__ENV__ !== "production") {
  //   return applyMiddleware(/*createLogger({
  //         predicate: () => (window as any).enableActionLogger,
  //     }),*/ thunk /*, persistedState*//*, socketMiddleware()*/);
  // } else {
    return applyMiddleware(thunk /*, persistedState,*/, socketMiddleware());
  // }
};

export const store = createStore(
  combineReducers({
    nav: NavReducer,
    carousel: SyncReducer,
    ui: UIReducer,
  }),
  composeEnhancers(getMiddlewares()),
);
