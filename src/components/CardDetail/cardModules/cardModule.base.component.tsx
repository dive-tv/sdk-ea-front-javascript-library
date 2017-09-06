import * as React from "react";

import { Card } from "Services";

export interface IValidatable {
    validate: (card: Card, modyleType: string, parent: any) => JSX.Element | null; // React.Component<any, any>;
    moduleName: string;
}

export function isValidatable(object: any): object is IValidatable {
    return object && 'validate' in object;
}
/*
export class CardModule<C> {
    public static validate: (moduleClass: IValidatable, card: Card)
        => React.Component<any, any> | undefined;
}
*/
/*
interface ICardModuleStatic<C extends new (...args: any[]) => ICardModule<C>> {
    validate: (card: Card) => boolean;
}

export interface ICardModule<C extends new (...args: any[]) => any> {
    constructor: any;
}*/
