import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList, DropDownList } from "Components";
import { navigable, INavigable } from "HOC";
import { Localize, Helper } from 'Services';
import { FilterTypeEnum } from 'Constants';

export interface IButtonsContainerProps {
  movieId: string;
  filter: FilterTypeEnum;
  showCloseButton?: boolean
  closeCarousel: () => void;
  setFilter: (filterName: FilterTypeEnum) => void;
}

export class CarouselButtonsContainerClass extends React.PureComponent<IButtonsContainerProps, any> {


  public render(): any {
    // console.log("[CarouselButtonsContainer][render]");
    const elements: string[] = [];
    let selectedItem: string = "";

    const { showCloseButton } = this.props;
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
        {showCloseButton == null || showCloseButton === true ?
          <div className="btnClose">
            <NavigationContainer key="carouselClose" className="carouselButton bctButton close customBtn"
              parent={this}
              onClick={(e) => this.onClickClose(e.currentTarget)} />
          </div>
          : null
        }
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
  private onClickClose(target: EventTarget) {
    if (this.props.closeCarousel) {
      this.props.closeCarousel();

      Helper.triggerEvent('diveSDK-onclose');
    }

  }
}

export const CarouselButtonsContainer = navigable(CarouselButtonsContainerClass);