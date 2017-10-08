import { ICardAndRelations } from './sync.reducer';
import { Action } from 'redux';
import { Card, Localize } from 'Services';
//
//  Actions
//
export type UIActionTypes = "UI/SET_DIVIDER" | "UI/UI_BACK" | "UI/OPEN_SYNC" |
    "UI/OPEN_CARD" | "UI/CLOSE_CARD" | "UI/OPEN" | "UI/ADD_TEST_CARDS" | "UI/OPEN_ALL_RELATIONS";

export type UILayerTopTypes = "TV" | "EMPTY" | "VODVIDEO";
export type UILayerBottomTypes = "CAROUSEL" | "CARD" | "CARDS" |
    "PROFILE" | "HELP" | "ERROR" | "EMPTY" | "ALL_RELATIONS";

type KeyArrows = "UP" | "DOWN" | "RIGHT" | "LEFT";
export type MenuVisualState = "VISIBLE" | "HIDE";

export interface IMenuElement {
    id: string;
    title: string;
    sections: IUIGroup;
    icon: string;
}

export interface IUIState {
    containers: IUIContainer[];
    divider: DividerSize;
    card?: Card;
    prevCards?: Card[];
    allRelations?: ICardAndRelations;
}

//
//  Actions
//
export interface IUIGroup {
    top: UILayerTopTypes;
    bottom: UILayerBottomTypes;
}

export interface IUIContainer {
    component: UILayerTopTypes | UILayerBottomTypes;
}

export interface IUIAction extends Action {
    type: UIActionTypes;
    payload?: any | IUIGroup;
}

export interface IMenuState {
    elements: Array<{ title: string, sections: IUIGroup, icon: string }>;
}

type DividerSize = 0 | 60 | 100;

export const UIReducer = (state: IUIState = initialUIState, action: IUIAction): IUIState => {
    switch (action.type) {
        case "UI/SET_DIVIDER":
            console.log("UI/SET_DIVIDER", action.payload);
            if (action.payload === state.divider) {
                return state;
            }
            return { ...state, divider: action.payload };
        case 'UI/OPEN_SYNC':
            const newContainers: IUIContainer[] = [...state.containers];
            newContainers[1].component = 'CAROUSEL';
            return { ...state, divider: 60, containers: newContainers };
        case 'UI/OPEN':
            const newContainers2: IUIContainer[] = [
                { component: action.payload.top }, { component: action.payload.bottom },
            ];
            let dividerVal: DividerSize = 100;

            if (["GRID", "CAROUSEL", "HOME", "CARDS", "CARD", "PROFILE", "HELP"].indexOf(action.payload.bottom) >= 0) {
                dividerVal = 60;
            }
            if (dividerVal !== state.divider ||
                state.containers[0].component !== newContainers2[0].component ||
                state.containers[1].component !== newContainers2[1].component) {
                return { ...state, divider: dividerVal, containers: newContainers2 };
            } else {
                return state;
            }

        case 'UI/UI_BACK':
            return { ...state, card: undefined, prevCards: [] };

        case 'UI/OPEN_CARD':
            // const newContainers3: IUIContainer[] = [state.containers[0], { component: "CARD" }];
            let prevCards: Card[] = state.prevCards;
            if (state.card !== undefined) {
                prevCards = [...state.prevCards, state.card];
            }
            return { ...state, divider: 60, /*containers: newContainers3,*/ card: action.payload, prevCards };

        case 'UI/CLOSE_CARD':
            if (state.prevCards.length === 0) {
                return state;
            }
            const [last] = state.prevCards.slice(-1);
            const restCards = state.prevCards.slice(0, -1);
            return { ...state, prevCards: restCards, card: last };
        case 'UI/OPEN_ALL_RELATIONS':
            const allRelationsContainer: IUIContainer[] = [state.containers[0], { component: "ALL_RELATIONS" }];
            return { ...state, divider: 60, containers: allRelationsContainer, allRelations: action.payload };

        default:
            return state;
    }
};

export const initialUIState: IUIState = {
    containers: [
        {
            component: "EMPTY",
        },
        {
            component: "CAROUSEL",
        },
    ],
    card: undefined,
    allRelations: undefined,
    prevCards: [],
    divider: 60,
};
