import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import socketMiddleware from '../middleware/socket.middleware';

import {
    /*UIReducer, TvReducer, CardReducer, SyncReducer, IUIState, ITvState, IAppConfig,
    ConfigReducer, GridReducer, IGridState, ICardState,*/ INavState, NavReducer, ISyncState, IUIState,
    /*UserReducer, IUserState, IErrorState, ErrorReducer,*/
} from 'Reducers';

// declare const __ENV__: string;

// const windowIfDefined = typeof window === 'undefined' ? null : window as any;
// const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface IState {
    nav: INavState;
    carousel: ISyncState;
    ui: { present: IUIState };
}
/*
const getMiddlewares = () => {
    return applyMiddleware(thunk, socketMiddleware());
};

export const store = createStore(
  combineReducers({
    nav: NavReducer,
  }),
  composeEnhancers(getMiddlewares()),
);
*/
declare const __ENV__: string;
