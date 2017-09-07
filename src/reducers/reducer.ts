import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";

import {
    /*UIReducer, TvReducer, CardReducer, SyncReducer, IUIState, ITvState, IAppConfig,
    ConfigReducer, GridReducer, IGridState, ISyncState, ICardState,*/ INavState, NavReducer,
    /*UserReducer, IUserState, IErrorState, ErrorReducer,*/
} from 'Reducers';

export interface IState {
    nav: INavState;
}

/*const persistedState = (store: Store<IState>) => (next: any) => () => {
    // setSessionStorage(SESSION_STORAGE_KEY, next());
};*/

const windowIfDefined = typeof window === 'undefined' ? null : window as any;
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

(window as any).enableActionLogger = false;
declare const __ENV__: string;
