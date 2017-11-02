import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList } from "Components";
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
}

export interface IDropDownListState {
}

export const dropDownInitialState: IDropDownListState = {
};

export class DropDownListClass extends React.PureComponent<IDropDownListProps, IDropDownListState> {

    constructor(props: IDropDownListProps) {
        super(props);

        this.state = dropDownInitialState;
    }

    public render(): any {
        return (
            <div className="dropdownContainer customBtn customBtnByChild">
                <label className="" onMouseOver={this.onMouseOver}>{Localize(this.props.selectedItem)}</label>
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

    private onMouseOver = (e: any) => {
        if (this.props.setNodeById) {
            this.props.setNodeById(this.props.idx);
        }
    }

    private renderChildren(): JSX.Element[] {

        const children: JSX.Element[] = [];

        this.props.elements.map((element: string) => {

            const actionOnClick = () => {
                this.selectOption(element);
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

export const DropDownList = navigable(DropDownListClass);
