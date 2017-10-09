import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { IMenuElement } from 'Reducers';
import { navigable } from 'HOC';
import { IMenuMethods } from 'Components';

export interface IMenuElementState {
    element: IMenuElement;
    idx?: number;
    selected?: number;
    menuActivated: number;

}

export type MenuItemProps = IMenuElementState & IMenuMethods;

export class MenuItemClass extends React.Component<MenuItemProps, {}> {

    public componentDidMount() {
        if (this.props.idx !== undefined) {
            this.props.addMenuId(this.props.idx);
        }

    }
    public componentWillUnmount() {
        if (this.props.idx !== undefined) {
            this.props.removeMenuId(this.props.idx);
        }
    }

    public render() {
        const classes = classNames({
            navActive: this.props.menuActivated === this.props.idx,
        }, 'menuElement', this.props.element.id);
        const iconClasses = classNames('icon', 'fillParent', this.props.element.id);

        return (
            <div className={classes} key={this.props.element.id}
                onClick={this.action}>
                <div className={iconClasses}>
                </div>
                <div className="title">{this.props.element.title}</div>
            </div>
        );

    }

    public action = () => {
        if (this.props.idx !== undefined && this.props.setMenuActivated !== undefined) {
            this.props.setMenuActivated(this.props.idx);
        }
    }
}

export const MenuItem = navigable(MenuItemClass);
