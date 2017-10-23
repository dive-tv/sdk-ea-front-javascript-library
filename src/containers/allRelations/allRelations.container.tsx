import * as React from 'react';

import { DiveAPIClass, Card, Helper } from "Services";
import { Loading, MiniCardList, NavigationContainer } from "Components";
import { navigable } from "HOC";
import { ICardAndRelations } from 'Reducers';
import { IUIActions } from 'Actions';

declare const DiveAPI: DiveAPIClass;

export interface IAllRelationsContainerProps {
    cards: ICardAndRelations;
    openSync: ()=>any;
}

export class AllRelationsContainerClass extends React.PureComponent<IAllRelationsContainerProps> {

    public constructor () {
        super();

        this.closeAllRelations = this.closeAllRelations.bind(this);
    }

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
        );
    }

    private getButtons(): JSX.Element {
        return (
            <div id="carouselButtons" className="buttonContainer bottomContainerTopButtons carouselButtonsContainer">
                <div className="bottomContainerTopButtons">
                <NavigationContainer key="carouselClose" className="carouselButton bctButton close "
                    forceOrder={0}
                    parent={this}
                    onClick={this.closeAllRelations} 
                    navClass="btnClose"
                    />
                    </div>
            </div>);
    }

    private closeAllRelations() {
        this.props.openSync();
    }

}

export const AllRelationsContainer = navigable(AllRelationsContainerClass);
