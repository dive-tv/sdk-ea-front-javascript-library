import * as React from 'react';

import { DiveAPIClass, Card, Helper } from "Services";
import { Loading, MiniCardList, NavigationContainer } from "Components";
import { navigable } from "HOC";
import { ICardAndRelations } from 'Reducers';

declare const DiveAPI: DiveAPIClass;

export interface IAllRelationsContainerProps {
    cards: ICardAndRelations;
}

export class AllRelationsContainerClass extends React.PureComponent<IAllRelationsContainerProps> {

    public render(): any {
        return (
            <div className="containerCarousel fillParent">
                {this.getButtons()}
                <div className="cards">
                    <MiniCardList
                        elements={[this.props.cards.card, ...this.props.cards.cards]}
                        parent={this}
                        columns={1}
                        groupName="MiniCardList"/>
                </div>
            </div >
        )
    }


    private getButtons(): JSX.Element {
        return (
            <div id="carouselButtons" className="buttonContainer bottomContainerTopButtons">
                <NavigationContainer key="carouselClose" className="carouselButton bctButton close"
                    forceOrder={0}
                    parent={this}
                    onClick={this.closeCarousel}/>
            </div>);
    }

    private closeCarousel() {
        //this.props.uiActions.open({ top: "TV", bottom: "GRID" });
    }

}

export const AllRelationsContainer = navigable(AllRelationsContainerClass);
