import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList } from "Components";
import { navigable, INavigable } from "HOC";

export interface IDropDownListProps {
    elements: string[];
    selectedItem: string;
    groupName: string;
    setNodeByName?: (name: string) => any;
    nameForNode?: string;
    setElement: (element: string) => void;
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
            <div className="dropdownContainer">
                {this.props.selectedItem}
                <div className="dropdownList">
                    {this.renderChildren()}
                </div>
            </div>)
    }

    private selectOption(option: string) {
        this.props.setElement(option);

        if (this.props.nameForNode && this.props.setNodeByName) {
            this.props.setNodeByName(this.props.nameForNode);
        }
    }

    private renderChildren(): JSX.Element[] {

        const children: JSX.Element[] = [];

        this.props.elements.map((element: string) => {

            const actionOnClick = () => {
                this.selectOption(element);
            };

            const classes = classNames({
                selected: element === this.props.selectedItem
            }, "dropDownListChildren")


            children.push(<div className={classes} key={"element#" + element}>
                <NavigationContainer className="dropDownListChildrenNav" parent={this} columns={1} groupName={this.props.groupName} clickAction={actionOnClick}>{element}</NavigationContainer>
            </div>);
        })

        return children;
    }
}

export const DropDownList = navigable(DropDownListClass);