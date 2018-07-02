import * as React from 'react';
import * as classNames from 'classnames';
import * as enhanceWithClickOutside from 'react-click-outside';
import { DirectionButton, NavigationContainer, DirectionButtonList, DIVE_CONFIG } from "Components";
import { navigable, INavigable } from "HOC";
import { Localize } from 'Services';

export interface IDropDownListProps {
  elements: string[];
  selectedItem: string;
  groupName: string;
  setNodeByName?: (name: string) => any;
  setNodeById?: (id: number) => any;
  nameForNode?: string;
  setElement: (element: string) => void;
  idx?: number;
  dropDownState: boolean;
  dropDownStateAction: (val?: boolean) => void;
}

export interface IDropDownListState {
  clicked: boolean;
}

export const dropDownInitialState: IDropDownListState = {
  clicked: false,
};

export class DropDownListClass extends React.PureComponent<IDropDownListProps, IDropDownListState> {

  private isHBBTV: boolean = false;

  constructor(props: IDropDownListProps) {
    super(props);

    this.isHBBTV = DIVE_CONFIG.platform === 'HBBTV';
    this.state = dropDownInitialState;
  }

  public componentDidUpdate(oldProps: IDropDownListProps) {
    if (this.props.dropDownState === false && oldProps.dropDownState === true) {
      this.props.setNodeById(this.props.idx);
    }
  }

  public render(): any {
    const classes = classNames("dropdownContainer customBtn customBtnByChild", {
      hbbtv: this.isHBBTV,
      clicked: this.props.dropDownState,
    });
    return (
      <div className={classes}>
        <label className="mainLabel"
          onMouseOver={this.onMouseOver}
          onMouseUp={this.onClick}
        >{Localize(this.props.selectedItem)}</label>
        <div className="dropdownList">
          {this.renderChildren()}
        </div>
      </div>
    );
  }

  private selectOption(option: string) {
    this.props.setElement(option);

    if (this.props.nameForNode && this.props.setNodeByName) {
      this.props.setNodeByName(this.props.nameForNode);
    }
  }

  public handleClickOutside = () => {
    // this.setState({ clicked: false });
    this.props.dropDownStateAction(false);
  }

  private onMouseOver = (e: any) => {
    if (true && this.props.setNodeById) {
      this.props.setNodeById(this.props.idx);
    }
  }

  private onClick = (e?: any) => {
    console.log("[DropDownList] onClick");
    // this.props.dropDownStateAction();
    this.props.setNodeById(this.props.idx);
    // this.setState({ clicked: !this.state.clicked });
    /*if (!this.isHBBTV && this.props.setNodeById) {
      this.props.setNodeById(this.props.idx);
    }*/
  }

  private renderChildren(): JSX.Element[] {

    const children: JSX.Element[] = [];
    if (!this.props.dropDownState) {
      return children;
    }

    this.props.elements.map((element: string) => {

      const actionOnClick = () => {
        if (this.props.dropDownState) {
          this.selectOption(element);
          // this.setState({ clicked: false });
          this.props.dropDownStateAction(false);
          this.props.setNodeById(this.props.idx);
        }
      };

      const classes = classNames({
        // selected: element === this.props.selectedItem,
        customTxtSelected2: element === this.props.selectedItem,
        customTxt: element !== this.props.selectedItem,
      }, "dropDownListChildren");

      children.push(<div className={classes} key={"element#" + element}>
        <NavigationContainer
          className="dropDownListChildrenNav"
          parent={this} columns={1}
          groupName={this.props.groupName}
          clickAction={actionOnClick}
        >
          {Localize(element)}
        </NavigationContainer>
      </div>);
    });

    return children;
  }
}

export const DropDownList = navigable(enhanceWithClickOutside(DropDownListClass));
