import * as React from "react";

import { CardDetailResponse } from "Services";

export interface IValidatable {
    validate: (card: CardDetailResponse, modyleType: string, parent: any) => JSX.Element | null; // React.Component<any, any>;
    moduleName: string;
}

export function isValidatable(object: any): object is IValidatable {
    return object && 'validate' in object;
}
/*
export class CardModule<C> {
    public static validate: (moduleClass: IValidatable, card: CardDetailResponse)
        => React.Component<any, any> | undefined;
}
*/
/*
interface ICardModuleStatic<C extends new (...args: any[]) => ICardModule<C>> {
    validate: (card: CardDetailResponse) => boolean;
}

export interface ICardModule<C extends new (...args: any[]) => any> {
    constructor: any;
}*/
