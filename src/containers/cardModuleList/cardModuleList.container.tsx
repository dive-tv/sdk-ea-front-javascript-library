import * as React from 'react';
import { Card } from "Services";
import { cardModuleConfig, cardModuleClasses, isValidatable } from "CardModules";
import { navigable } from "HOC";
import { NavigationContainer, Loading } from "Components";

export interface ICardModuleListProps {
    card: Card;
}
export class CardModuleList extends React.PureComponent<ICardModuleListProps, {}> {
    public render(): JSX.Element {
        return (
            <div className="cardModulesContainer">
                {this.props.card ? this.decideModules(this.props.card) : <Loading />}
            </div>
        );
    }

    private decideModules(card: Card): JSX.Element[] {
        const modules: Array<React.Component<any, any>> = [];
        const moduleList: JSX.Element[] = [];
        const cardModuleOrder = cardModuleConfig[card.type];
        if (card.type && cardModuleOrder && cardModuleOrder.sections &&
            cardModuleOrder.sections[0] &&
            cardModuleOrder.sections[0].modules instanceof Array) {
            cardModuleOrder.sections[0].modules
                .map((cardModule: { type: string }, idx: number): any => {
                    if (cardModule.type && cardModule.type !== "") {
                        const candidate = cardModuleClasses[cardModule.type];
                        if (isValidatable(candidate)) {
                            if (candidate) {
                                console.warn("Instantiating", cardModule.type);
                                const moduleInstance = candidate.validate(card, cardModule.type, this, {
                                    isScrollable: true,
                                    scrollPadding: 300,
                                    isDefault: moduleList.length === 0,
                                });
                                if (moduleInstance) {
                                    console.warn("Instantiating because validated", cardModule.type);
                                    const navClass = candidate.moduleName ?
                                        `${candidate.moduleName.toLocaleLowerCase()}-container cardModule-container scrollable` :
                                        "container";
                                    moduleList.push(
                                        <div className={navClass}
                                            key={`${card.card_id}_module_${idx}`}>
                                            {moduleInstance}
                                        </div>,
                                    );
                                }
                            } else {
                                console.warn("No existe el módulo o no ha validado", cardModule.type);
                            }
                        } else {
                            console.warn("No existe el módulo", cardModule.type);
                        }
                    }
                    return undefined;
                });
        }
        // TODO: handle error
        return moduleList;
    }
}

export const NavigableCardModuleList = navigable(CardModuleList);
