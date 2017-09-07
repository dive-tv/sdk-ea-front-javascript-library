import { Action } from 'redux';
import { Card, Localize } from 'Services';
//
//  Actions
//
export type UIActionTypes = "UI/SET_DIVIDER" | "UI/UI_BACK" | "UI/OPEN_SYNC" |
    "UI/OPEN_CARD" | "UI/OPEN" | "UI/ADD_MENU_ID" | "UI/REMOVE_MENU_ID" | "UI/SET_MENU_ACTIVATED";

export type UILayerTopTypes = "TV" | "YOUTUBE" | "AV" | "EMPTY";
export type UILayerBottomTypes = "GRID" | "CAROUSEL" | "HOME" | "CARD" | "CARDS" |
    "PROFILE" | "HELP" | "ERROR" | "EMPTY";

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
    menu: IMenuElement[];
    menuActivated: number;
    menuIds: number[];
    menuVisualState: MenuVisualState;
    card?: Card;
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

type DividerSize = 60 | 100;

export const UIReducer = (state: IUIState = initialUIState, action: IUIAction): IUIState => {
    switch (action.type) {
        case "UI/SET_DIVIDER":
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
            const newContainers3: IUIContainer[] = [state.containers[0], {component: "CARD"}];
            return { ...state, divider: 60, containers: newContainers3, card: action.payload };

        case 'UI/ADD_MENU_ID':
            return { ...state, menuIds: [...state.menuIds, action.payload] };

        case 'UI/REMOVE_MENU_ID':
            const i: number = state.menuIds.indexOf(action.payload);
            if (i >= 0) {
                const newMenuIds: number[] = [...state.menuIds];
                newMenuIds.splice(i, 1);
                return { ...state, menuIds: newMenuIds };
            }
            return state;

        case 'UI/SET_MENU_ACTIVATED':
            return { ...state, menuActivated: action.payload };

        default:
            return state;
    }
};

export const initialUIState: IUIState = {
    containers: [
        {
            component: "TV",
        },
        {
            component: "EMPTY",
        },
    ],
    card: undefined,
    divider: 100,
    menuVisualState: 'VISIBLE',
    menuIds: [],
    menuActivated: -1,
    menu: [
        {
            id: 'help',
            title: Localize('MENU_SETTINGS'),
            sections: {
                top: 'TV',
                bottom: 'HELP',
            },
            icon: 'HELP',
        },
        {
            id: 'demo',
            title: Localize('MENU_DEMO'),
            sections: {
                top: 'YOUTUBE',
                bottom: 'CAROUSEL',
            },
            icon: 'DEMO',
        },
        {
            id: 'profile',
            title: Localize('MENU_PROFILE'),
            sections: {
                top: 'TV',
                bottom: 'PROFILE',
            },
            icon: 'PROFILE',
        },
        {
            id: 'cards',
            title: Localize('MENU_CARDS'),
            sections: {
                top: 'TV',
                bottom: 'CARDS',
            },
            icon: 'CARDS',
        },
        {
            id: 'sync',
            title: Localize('MENU_SYNC'),
            sections: {
                top: 'TV',
                bottom: 'GRID',
            },
            icon: 'GRID',
        },
    ],
};
