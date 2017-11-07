import * as React from 'react';
import * as classNames from 'classnames';

import { navigable } from "HOC";
import { DirectionButton } from "Components";

export interface IDirectionButtonListObj {
    direction: 'left' | 'right' | 'up' | 'down';
    action?: () => void;
}
export interface IDirectionButtonListProps {
    btns: IDirectionButtonListObj[];
    template?: 'horizontal' | 'vertical';
}
export class DirectionButtonListClass extends React.PureComponent<IDirectionButtonListProps, {}> {

    public render(): any {
        return (
            <ul className={'directionButtonList ' + this.props.template}>
                {this.props.btns.map((btn: IDirectionButtonListObj, i: number) => (
                    <li className="btn" key={i}>
                        <DirectionButton
                            direction={btn.direction}
                            clickAction={btn.action}
                            parent={this}
                            scrollPadding={400}
                            columns={this.props.template !== 'vertical' ? this.props.btns.length : 1}
                        />
                    </li>
                ))
                }
            </ul>
        );
    }

}

export const DirectionButtonList = navigable(DirectionButtonListClass);
