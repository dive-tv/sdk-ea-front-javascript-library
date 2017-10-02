import * as React from 'react';
import * as classNames from 'classnames';
import { DirectionButton, NavigationContainer, DirectionButtonList } from "Components";
import { navigable, INavigable } from "HOC";

export interface IDropDownListProps {
    elements: string[];
    selectedGroupName: string;
    groupName: string;
    
}

export interface IDropDownListState {
    selected: number;
}

export const dropDownInitialState: IDropDownListState = {
    selected: 0
};

export class DropDownListClass extends React.PureComponent<IDropDownListProps, IDropDownListState> {

    private list: JSX.Element = <div className="dropdownList">
        {this.renderChildren()}
    </div>

    constructor(props: IDropDownListProps) {
        super(props);

        this.state = dropDownInitialState;
    }

    /*public componentDidUpdate(oldProps: IDropDownListProps, oldState: IDropDownListState) {
        if (oldState.selected !== this.state.selected) {
            setTimeout(() => {
                this.forceUpdate();
            }, 500);
        }
    }*/

    public render(): any {

        let children: JSX.Element;

        if (this.props.selectedGroupName === this.props.groupName) {
            children = this.list;
        }

        console.log("selected --->", this.state.selected);

        return (
            <div className="dropdownContainer">
                {this.props.elements[this.state.selected]}
                {children}
            </div>)
    }

    private selectOption(option: number) {
        console.log("selected --->", option)
        this.setState({ ...this.state, selected: option});
    }

    private renderChildren(): JSX.Element[] {

        const children: JSX.Element[] = [];

        this.props.elements.map((element: string, index: number) => {

            const actionOnClick = () => {
                this.selectOption(index);
            };

            children.push(<div className="dropDownListChildren" key={"element#" + element}>
                <NavigationContainer parent={this} columns={1} clickAction={actionOnClick}>{element}</NavigationContainer>
            </div>);
        })

        return children;
    }
}

export const DropDownList = navigable(DropDownListClass);