import { ICardAndRelations } from './sync.reducer';
import { Action } from 'redux';
import { Card, Localize } from 'Services';
//
//  Actions
//
export type UIActionTypes = "UI/SET_DIVIDER" | "UI/UI_BACK" | "UI/OPEN_SYNC" |
    "UI/OPEN_CARD" | "UI/OPEN" | "UI/ADD_TEST_CARDS" | "UI/OPEN_ALL_RELATIONS";

export type UILayerTopTypes = "TV" | "EMPTY";
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
    testCards: Array<{ card_id: string, version?: string }>;
    allRelations?: ICardAndRelations;
}

//
//  Actions
//
export interface IUIGroup {
    top: UILayerTopTypes;
    bottom: UILayerBottomTypes;
};

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
                state.containers[0].component !== newContainers2[1].component) {
                return { ...state, divider: dividerVal, containers: newContainers2 };
            } else {
                return state;
            }

        case 'UI/OPEN_CARD':
            const newContainers3: IUIContainer[] = [state.containers[0], { component: "CARD" }];
            return { ...state, divider: 60, containers: newContainers3, card: action.payload };

        case 'UI/ADD_TEST_CARDS':

            return { ...state, testCards: [...state.testCards, action.payload] }
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
    testCards: [
        { card_id: "28e7cb52-01a2-3e95-a71f-4fc2d3e46f86", version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { card_id: "bd4f26ba-0c2a-3a16-bb7b-79aa066abf44"/*, version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" */ },
        { card_id: "e0143d7b-1e76-11e6-97ac-0684985cbbe3"/*, version: "0jOeUIeLCaOcSI4FSebNj4+E7VZ" */ },
        { "card_id": "df5b9dd1-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "f266ee0a-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "de57c239-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "f0913395-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        /*{ "card_id": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "efedb82c-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "e13fdc41-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "4f59462f-7ce9-11e5-b7c2-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "6e4559b7-740b-11e5-b7c2-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" },
        { "card_id": "eec95ac4-1e76-11e6-97ac-0684985cbbe3", "version": "0jOeUIeLCaOcSI4FSebNj4+E7VZ" }*/

    ],
    divider: 60,
};