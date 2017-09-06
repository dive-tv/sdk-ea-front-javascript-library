import * as React from 'react';
import * as classNames from 'classnames';

import { navigable } from "HOC";

export interface IDirectionButtonProps {
    direction: 'left' | 'right' | 'up' | 'down';
}
export class DirectionButtonClass extends React.PureComponent<IDirectionButtonProps, {}> {

    public render() {
        const classes = classNames('directionButton', this.props.direction);
        return (
            <div className={classes}></div>
        );
    }
    
}

export const DirectionButton = navigable(DirectionButtonClass);
