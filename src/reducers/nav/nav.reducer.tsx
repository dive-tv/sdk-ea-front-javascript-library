import { Action } from 'redux';

//
//  Actions
//
export type NavActionTypes = "NAV/ADD_NODE" | "NAV/DELETE_NODE" | "NAV/KEY" | "NAV/SELECTED" | "NAV/ACTIVATED" |
    "NAV/SELECT_LEAF" |
    "NAV/MOVE_HORIZONTAL" | "NAV/MOVE_VERTICAL" | "NAV/SELECT_BY_ID" | "NAV/SELECT_BY_NAME";

export interface INavAction extends Action {
    type: NavActionTypes;
    payload?: any;
}
export interface INavState {
    navigation: Map<number, INavigable>;
    lastKey: string;
    selected: number;
    selectedNav: INavigable | undefined;
    lastSelected: number;
    activated: number;
    lastActivated: number;
    navNames: Map<string, number>;
}

type KeyArrows = "UP" | "DOWN" | "RIGHT" | "LEFT";

export const NavReducer = (state: INavState = initialNavState, action: INavAction): INavState => {
    // console.log("[CURRENT][NavReducer] state: ", state);
    switch (action.type) {
        case 'NAV/ADD_NODE':
            const nav: INavigable = action.payload as INavigable;

            // INIT PARENT IF IS NOT SETTED. UPDATE PARENT IF IS SETTED
            if (nav.parentId !== -1) {
                const parentState: INavigable = state.navigation.get(nav.parentId) as INavigable;
                if (parentState === undefined) {
                    state.navigation.set(
                        nav.parentId,
                        { parentId: -1, id: nav.parentId, children: [[nav.id]], columns: 1 },
                    );
                } else {
                    const lastChildrenTuplaIndex = parentState.children.length - 1;
                    const lastChildrenTuplaLength: number = parentState.children[lastChildrenTuplaIndex].length;
                    if (nav.columns !== undefined &&
                        nav.columns === lastChildrenTuplaLength) {
                        parentState.children = [...parentState.children, [nav.id]];
                    } else {
                        if (nav.forceOrder !== undefined) {
                            // Caso en el que queremos forzar el orden del elemento
                            const arr: number[] = [...parentState.children[lastChildrenTuplaIndex]];
                            arr.splice(nav.forceOrder, 0, nav.id);
                            parentState.children[lastChildrenTuplaIndex] = arr;
                        } else {
                            // Caso normal
                            parentState.children[lastChildrenTuplaIndex] =
                                [...parentState.children[lastChildrenTuplaIndex], nav.id];
                        }

                    }

                    state.navigation.set(parentState.id, parentState);
                }
            }

            // INIT CURRENT ELEMENT IF IS NOT SETTED.
            const navState: INavigable | undefined = state.navigation.get(nav.id);
            if (navState === undefined) {
                state.navigation.set(nav.id, nav);
            } else {
                state.navigation.set(nav.id, { ...nav, ...navState, parentId: nav.parentId });
            }

            if (nav.name !== undefined) {
                state.navNames.set(nav.name, nav.id);
            }

            return state;

        case 'NAV/DELETE_NODE':
            const deleteNav: INavigable | undefined = state.navigation.get(action.payload);
            // DELETE FROM PARENT
            if (deleteNav !== undefined && deleteNav.parentId >= 0) {
                const deleteNavParent: INavigable | undefined = state.navigation.get(deleteNav.parentId);
                if (deleteNavParent !== undefined) {
                    for (let i = 0; i < deleteNavParent.children.length; i++) {
                        const index = indexOf(deleteNavParent.children[i], action.payload);
                        if (index >= 0) {
                            const children = [...deleteNavParent.children[i]];
                            children.splice(index, 1);
                            if (children.length >= 0) {
                                deleteNavParent.children[i] = children;
                            } else if (i > 0) {
                                deleteNavParent.children.splice(i, 1);
                            }
                            break;
                        }
                    }

                    state.navigation.set(deleteNavParent.id, deleteNavParent);
                }
            }

            // DELETE CURRENT
            if (deleteNav !== undefined) {
                state.navigation.delete(deleteNav.id);
            }

            return state;

        case 'NAV/KEY':
            return { ...state, lastKey: action.payload };

        case 'NAV/SELECTED':
            if (isOutOfModal(state.navigation, state.selected, action.payload)) {
                return state;
            }

            return {
                ...state,
                lastSelected: state.selected,
                selected: action.payload,
                selectedNav: state.navigation.get(action.payload),
            };
        case 'NAV/SELECT_LEAF':
            const id: number = getFirstLeaf(state, action.payload);
            return {
                ...state,
                lastSelected: state.selected,
                selected: id,
                selectedNav: state.navigation.get(id),
            };

        case 'NAV/ACTIVATED':
            return { ...state, lastActivated: state.activated, activated: action.payload };

        case 'NAV/MOVE_HORIZONTAL':
            let newSelected = state.selected;
            let loopSelected = state.selected;
            const current: INavigable | undefined = state.navigation.get(state.selected);
            if (current !== undefined && current.parentId >= 0) {
                let parent: INavigable | undefined = state.navigation.get(current.parentId);
                let looping = true;

                loopWhile:
                while (looping) {
                    looping = false;
                    if (parent === undefined) {
                        continue;
                    }

                    loop1:
                    for (const list of parent.children) {
                        for (let j = 0; j < list.length; j++) {
                            const num: number = list[j];
                            if (num === loopSelected) {
                                // En el caso de que el elemento por el que se va a pasar sea modal,
                                // retornamos el state anterior.
                                if ((state.navigation.get(loopSelected) as INavigable).modal) {
                                    return state;
                                }

                                if (action.payload === 1 && j < list.length - 1) {
                                    // Once selected the element, go down in nodes until leaf
                                    newSelected = getFirstLeaf(state, list[j + 1]);
                                    break loopWhile;
                                } else if (action.payload === -1 && j > 0) {
                                    // Once selected the element, go down in nodes until leaf(the last one)
                                    newSelected = getLastLeaf(state, list[j - 1]);
                                    break loopWhile;
                                } else {

                                    if (parent.parentId >= 0) {
                                        loopSelected = parent.id;
                                        parent = state.navigation.get(parent.parentId);
                                        looping = true;
                                        break loop1;
                                    }
                                }

                            }
                        }
                    }
                }
            }
            return {
                ...state, lastSelected: state.selected, selected: newSelected,
                selectedNav: state.navigation.get(newSelected),
            };

        case 'NAV/MOVE_VERTICAL':
            let newSelected2 = state.selected;
            let loopSelected2 = state.selected;
            const current2: INavigable | undefined = state.navigation.get(state.selected);
            if (current2 !== undefined && current2.parentId >= 0) {
                let parent: INavigable | undefined = state.navigation.get(current2.parentId);
                let looping = true;

                loopWhile:
                while (looping) {
                    looping = false;
                    if (parent === undefined) {
                        continue;
                    }

                    loop1:
                    for (let j = 0; j < parent.children.length; j++) {
                        if (parent.children[j].length > 0) {
                            const index: number = indexOf(parent.children[j], loopSelected2);
                            if (index < 0) {
                                continue;
                            }

                            const num: number = parent.children[j][index];
                            if (num === loopSelected2) {
                                // En el caso de que el elemento por el que se va a pasar sea modal,
                                // retornamos el state anterior.
                                if ((state.navigation.get(loopSelected2) as INavigable).modal) {
                                    return state;
                                }
                                if (action.payload === 1 && j < parent.children.length - 1) {
                                    // Once selected the element, go down in nodes until leaf
                                    newSelected2 = getFirstLeaf(state, parent.children[j + 1][0]);
                                    break loopWhile;
                                } else if (action.payload === -1 && j > 0) {
                                    // Once selected the element, go down in nodes until leaf(the last one)
                                    newSelected2 = getLastLeaf(state, parent.children[j - 1][0]);
                                    break loopWhile;
                                } else {
                                    if (parent.parentId >= 0) {
                                        loopSelected2 = parent.id;
                                        parent = state.navigation.get(parent.parentId);
                                        looping = true;
                                        break loop1;
                                    }
                                }

                            }
                        }
                    }
                }
            }
            return {
                ...state, lastSelected: state.selected, selected: newSelected2,
                selectedNav: state.navigation.get(newSelected2),
            };

        case 'NAV/SELECT_BY_NAME':
            const name: string = action.payload as string;
            const selectionByName: number = getFirstLeaf(state, state.navNames.get(name) as number);
            if (selectionByName !== undefined) {
                return {
                    ...state, lastSelected: state.selected, selected: selectionByName,
                    selectedNav: state.navigation.get(selectionByName),
                };
            } else {
                return state;
            }

        case 'NAV/SELECT_BY_ID':
            const selectionById: number = getFirstLeaf(state, action.payload);
            if (selectionById !== undefined) {
                return {
                    ...state, lastSelected: state.selected, selected: selectionById,
                    selectedNav: state.navigation.get(selectionById),
                };
            } else {
                return state;
            }

        default:
            return state;
    }
};

// Get children recursively and return all of them in an array
const getRecursiveChildren = (navigation: Map<number, INavigable>, id: number): number[] => {
    // DELETE RECURSIVE CHILDS
    let before: number[] = [];
    const node: INavigable | undefined = navigation.get(id);
    if (node !== undefined) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < node.children.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < node.children[i].length; j++) {
                before = [...before, node.children[i][j]];
                before = [...before, ...getRecursiveChildren(navigation, node.children[i][j])];
            }
        }
    }

    return before;
};

// TODO GET FIRST child that is leaf.
const getFirstLeaf = (state: INavState, id: number): number => {
    let current: INavigable | undefined = state.navigation.get(id);
    let looping = true;
    while (current !== undefined && looping) {
        if (current.children[0].length > 0) {
            current = state.navigation.get(current.children[0][0]) as INavigable;
        } else {
            looping = false;
        }

    }
    if (current !== undefined) {
        return current.id;
    } else {
        return id;
    }

};

// Get last child leaf
const getLastLeaf = (state: INavState, id: number): number => {
    let current: INavigable | undefined = state.navigation.get(id);
    let looping = true;
    while (current !== undefined && looping) {
        if (current.forceFirst === true && current.children[0].length > 0) {
            current = state.navigation.get(current.children[0][0]) as INavigable;
        } else if (current.children[current.children.length - 1].length > 0) {
            const pos: number = current.children[current.children.length - 1][current.children[0].length - 1];
            current = state.navigation.get(pos) as INavigable;
        } else {
            looping = false;
        }
    }

    if (current !== undefined) {
        return current.id;
    } else {
        return id;
    }
};

const indexOf = (array: number[], num: number) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === num) {
            return i;
        }
    }
    return -1;
};

const isOutOfModal = (navigation: Map<number, INavigable>, id: number, newId: number): boolean => {
    let idModal: number = -1;
    let nav: INavigable;
    // Miramos si la selección actual tiene algún padre modal
    do {
        nav = navigation.get(id)  as INavigable;
        if (nav === undefined) {
            break;
        }

        if (nav.modal === true) {
            idModal = nav.id;
        }
        id = nav.parentId;
    } while (idModal < 0 && id !== undefined);

    if (idModal === -1) {
        return false;
    }

    // Miramos si en la nueva selección está el padre modal, si se ha encontrado uno previamente.
    if (idModal >= 0) {
        do {
            nav = navigation.get(newId)  as INavigable;
            if (nav.id === idModal) {
                return false;
            }
            id = nav.parentId;
        } while (idModal < 0 && id !== undefined);
    }

    return true;
};

export const initialNavState: INavState = {
    navigation: new Map<number, INavigable>(),
    lastKey: '',
    selected: 3,
    selectedNav: undefined,
    activated: -1,
    lastSelected: -1,
    lastActivated: -1,
    navNames: new Map<string, number>(),
};
