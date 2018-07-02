import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList, DropDownList } from "Components";
import { navigable, INavigable } from "HOC";
import { Localize, Helper } from 'Services';
import { FilterTypeEnum } from 'Constants';

// tslint:disable-next-line:no-namespace
export module CardDetailBtns {
  export interface IProps {
    closeAllCards: () => void;
    closeCard: () => void;
  }
  export interface IState {

  }
}

export class CardDetailBtnsClass extends React.PureComponent<CardDetailBtns.IProps, any> {

  public render(): any {

    return (
      <div className="bottomContainerTopButtons">
        <div className="cardDetailBtn">
          <NavigationContainer key="cdClose" className="bctButton close customBtn"
            parent={this}
            clickAction={() => {
              this.props.closeAllCards();
            }}
            columns={2}
          >
          </NavigationContainer>

        </div>

        <div className="cardDetailBtn">
          <NavigationContainer key="cdBack" className="bctButton back customBtn"
            parent={this}
            clickAction={() => {
              this.props.closeCard();
            }}
            columns={2}
          >
            {'<'}
          </NavigationContainer>
        </div>
      </div>
    );
  }
}

export const CardDetailBtns = navigable(CardDetailBtnsClass);
