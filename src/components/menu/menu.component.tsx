import * as React from 'react';
import * as classNames from 'classnames';
import { IMenuElement, MenuVisualState } from 'Reducers';
import { navigable } from 'HOC';
import { MenuItem } from 'Components';

// Esto habría que meterlo en el container o ¿actions?
export interface IMenuMethods {
    open?: () => any;
    addMenuId: (id: number) => any;
    removeMenuId: (id: number) => any;
    setMenuActivated: (id: number) => any;
    // setActivated?: (id: number) => any;
    setSelected?: (id: number) => any;
}

export interface IMenuState {
    elements: IMenuElement[];
    title: string;
    menuVisualState: MenuVisualState;
    menuIds: number[];
    selected?: number;
    menuActivated: number;
}
type MenuProps = IMenuState & IMenuMethods;

export class MenuClass extends React.PureComponent<MenuProps, {}> {
    private isMenuClosed: boolean = false;
    private defaultSelected: any;

    public render() {
        const elementStyle: React.CSSProperties = { height: `${100 / this.props.elements.length}%` };
        const elements: any = this.props.elements.map((element: IMenuElement, i: number) => (
            <li style={elementStyle} key={i}>
                <MenuItem
                    ref={(el: any) => {
                        if (el && element.id === "sync") {
                            this.defaultSelected = el;
                        }
                    }}
                    isDefault={element.id === "sync"}
                    focusChainClass="focused"
                    element={element}
                    clickAction={this.props.open ? this.props.open.bind(this, element.sections) : null}
                    addMenuId={this.props.addMenuId}
                    removeMenuId={this.props.removeMenuId}
                    menuActivated={this.props.menuActivated}
                    setMenuActivated={this.props.setMenuActivated}
                    parent={this}
                    columns={1}
                />
            </li>
        ));

        return (
            <div className="menu">
                <div className="closed" onClick={this.onClick}></div>
                <ul className="list fillParent">
                    {elements}
                </ul>
            </div>
        );
    }

    public onClick = (e: any) => {
        if (this.props.setSelected !== undefined) {
            this.props.setSelected(this.props.menuActivated);
        }
    }

    public componentDidMount() {
        if (this.props.setSelected && this.defaultSelected) {
            this.props.setSelected(this.defaultSelected.getWrappedInstance().navId);
        }
    }
}

export const Menu = navigable(MenuClass);
