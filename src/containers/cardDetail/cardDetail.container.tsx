import * as React from 'react';

import { DiveAPIClass, Card, Helper } from "Services";
import { Loading, CardDetail } from "Components";
import { navigable } from "HOC";

declare const DiveAPI: DiveAPIClass;

export interface ICardDetailContainerProps {
    cardId: string;
    version: string;
}
export interface ICardDetailContainerState {
    status: "LOADING" | "LOADED";
    card?: Card;
}
export class CardDetailContainerClass extends
    React.PureComponent<ICardDetailContainerProps, ICardDetailContainerState> {
    constructor() {
        super();
        this.state = { status: "LOADING", card: undefined };
    }
    public componentDidMount() {
        if (this.state && this.state.status === "LOADING") {
            DiveAPI.getCardVersion({ cardId: this.props.cardId, version: this.props.version, products: true })
                .then((card: Card) => {              
                    this.setState({ ...this.state, status: "LOADED", card });
                });
        }
    }

    public render(): any {
        const subcomponent = !this.state || this.state.status !== "LOADED" ?
            <Loading /> :
            <CardDetail parent={this} card={this.state.card} />;
        return subcomponent;
    }
}

export const CardDetailContainer = navigable(CardDetailContainerClass);
