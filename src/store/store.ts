import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import socketMiddleware from '../middleware/socket.middleware';
import undoable, { includeAction } from 'redux-undo';
import {createLogger} from 'redux-logger';

import {
  INavState, NavReducer, ISyncState, SyncReducer, IUIState, UIReducer,
} from 'Reducers';

declare const __ENV__: string;

const windowIfDefined = typeof window === 'undefined' ? null : window as any;
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
(window as any).enableActionLogger = true;
const getMiddlewares = () => {
  if (__ENV__ !== "production") {
    console.log("NO PROD MIDDLEWARES");
    return applyMiddleware(createLogger({
           predicate: () => (window as any).enableActionLogger,
       }), thunk /*, persistedState*/, socketMiddleware());
  } else {
    return applyMiddleware(thunk /*, persistedState,*/, socketMiddleware());
  }
};

export const store = createStore(
  combineReducers({
    nav: NavReducer,
    carousel: SyncReducer,
    ui: undoable(UIReducer, {
      filter: includeAction('UI/OPEN'), // see `Filtering Actions` section
      initTypes: ['@@redux/INIT', '@@INIT'], // history will be (re)set upon init action type
      limit: 50, // false, // set to a number to turn on a limit for the history
      undoType: "UI/UI_BACK", // define a custom action type for this undo action
    }),
  }),
  composeEnhancers(getMiddlewares()),
);
