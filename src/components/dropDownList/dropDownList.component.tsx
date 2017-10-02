import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList } from "Components";
import { navigable, INavigable } from "HOC";

export interface IDropDownListProps {
    elements: string[];
    selected: number;
    groupName: string;
    setNodeByName?: (name: string) => any;
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
                {this.props.elements[this.props.selected]}
                <div className="dropdownList">
                    {this.renderChildren()}
                </div>
            </div>)
    }

    private selectOption(option: number) {
        this.setState({ ...this.state, selected: option });
        this.props.setNodeByName("miniCardListCarousel");
    }

    private renderChildren(): JSX.Element[] {

        const children: JSX.Element[] = [];

        this.props.elements.map((element: string, index: number) => {
            
            const actionOnClick = () => {
                this.selectOption(index);
            };

            children.push(<div className="dropDownListChildren" key={"element#" + element}>
                <NavigationContainer className="dropDownListChildrenNav" parent={this} columns={1} groupName={this.props.groupName} clickAction={actionOnClick}>{element}</NavigationContainer>
            </div>);
        })

        return children;
    }
}

export const DropDownList = navigable(DropDownListClass);