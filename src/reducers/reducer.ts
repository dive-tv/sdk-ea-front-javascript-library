import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import socketMiddleware from '../middleware/socket.middleware';

import {
    /*UIReducer, TvReducer, CardReducer, SyncReducer, IUIState, ITvState, IAppConfig,
    ConfigReducer, GridReducer, IGridState, ICardState,*/ INavState, NavReducer, ISyncState
    /*UserReducer, IUserState, IErrorState, ErrorReducer,*/
} from 'Reducers';

export interface IState {
    nav: INavState;
    carousel: ISyncState
}

/*const persistedState = (store: Store<IState>) => (next: any) => () => {
    // setSessionStorage(SESSION_STORAGE_KEY, next());
};*/
const getMiddlewares = () => {
    /*if (__ENV__ !== "production") {
        return applyMiddleware(createLogger({
            predicate: () => (window as any).enableActionLogger,
        }), thunk, socketMiddleware());
    } else {*/
        return applyMiddleware(thunk /*, persistedState*/, socketMiddleware());
    //}
};
const windowIfDefined = typeof window === 'undefined' ? null : window as any;
// const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || getMiddlewares();

(window as any).enableActionLogger = false;
declare const __ENV__: string;
