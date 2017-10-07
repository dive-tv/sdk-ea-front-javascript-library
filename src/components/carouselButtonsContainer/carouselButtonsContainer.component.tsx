import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList, DropDownList } from "Components";
import { navigable, INavigable } from "HOC";
import { Localize } from 'Services';
import { FilterTypeEnum } from 'Constants';

export interface IButtonsContainerProps {
    movieId: string;
    filter: FilterTypeEnum;
    closeCarousel: () => void;
    setFilter: (filterName: FilterTypeEnum) => void;
}

export class CarouselButtonsContainerClass extends React.PureComponent<IButtonsContainerProps> {

    public render(): any {

        const elements: string[] = [];
        let selectedItem: string = "";

        for (let item in FilterTypeEnum) {

            if (FilterTypeEnum[item] === this.props.filter) {
                selectedItem = FilterTypeEnum[item];
            }

            elements.push(FilterTypeEnum[item]);
        }

        return (
            <div id="carouselButtons" className="bottomContainerTopButtons">

                <NavigationContainer key="carouselClose" className="carouselButton bctButton close"
                    parent={this}
                    onClick={this.props.closeCarousel}/>

                <DropDownList
                    key={"dropdown#" + this.props.movieId}
                    elements={elements}
                    selectedItem={selectedItem}
                    activeGroupClass="dropDownActive"
                    groupName="dropDownFilter"
                    parent={this}
                    //nameForNode="miniCardListCarousel"
                    setElement={this.props.setFilter}/>
            </div>)
    }
}

export const CarouselButtonsContainer = navigable(CarouselButtonsContainerClass);