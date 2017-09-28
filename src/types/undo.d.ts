declare module "redux-undo"{
    import {Reducer} from 'redux';
    
    interface IActionTypes {
        UNDO: '@@redux-undo/UNDO',
        REDO: '@@redux-undo/REDO',
        JUMP_TO_FUTURE: '@@redux-undo/JUMP_TO_FUTURE',
        JUMP_TO_PAST: '@@redux-undo/JUMP_TO_PAST'
    }
    export const ActionTypes: IActionTypes;

    export function undoable(reducer: Reducer<any>, config?: any): any;
    export function distinctState(): any;
    export interface ActionCreators{
        undo(): { type: string };
        redo(): { type: string };
        jumpToFuture(index: number): { type: string, index: number };
        jumpToPast(index: number): { type: string, index: number };
    }
    export function includeAction(action: string): any;

    export default undoable;
}