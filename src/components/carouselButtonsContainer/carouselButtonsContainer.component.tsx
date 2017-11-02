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

        for (const item in FilterTypeEnum) {
            if (FilterTypeEnum.hasOwnProperty(item)) {
                if (FilterTypeEnum[item] === this.props.filter) {
                    selectedItem = FilterTypeEnum[item];
                }
                elements.push(FilterTypeEnum[item]);
            }
        }

        return (
            <div id="carouselButtons" className="bottomContainerTopButtons">
                <div className="btnClose">
                    <NavigationContainer key="carouselClose" className="carouselButton bctButton close customBtn"
                        parent={this}
                        /*onClick={this.props.closeCarousel}*/ />
                </div>
                <div className="dropDown">
                    <DropDownList
                        key={"dropdown#" + this.props.movieId}
                        elements={elements}
                        selectedItem={selectedItem}
                        activeGroupClass="dropDownActive childFocused"
                        groupName="dropDownFilter"
                        parent={this}
                        // nameForNode="miniCardListCarousel"
                        setElement={this.props.setFilter} />
                </div>
            </div>
        );
    }
}

export const CarouselButtonsContainer = navigable(CarouselButtonsContainerClass);