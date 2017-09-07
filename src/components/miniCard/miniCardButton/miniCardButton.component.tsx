import * as React from 'react';
import * as classNames from 'classnames';

import { navigable } from 'HOC';
import { Localize } from 'Services';

export interface IMiniCardButtonState {
    type: 'MORE' | 'SAVE';
    liked?: boolean;
}

export interface IMiniCardButtonMethods {
    clickAction: any;
}

type MiniCardButtonProps = IMiniCardButtonState & IMiniCardButtonMethods;

export class MiniCardButtonClass extends React.PureComponent<MiniCardButtonProps, {}> {

    public render() {
        switch (this.props.type) {
            case 'MORE':
                return <div className="miniCardButton fillParent more" onClick={this.props.clickAction}>+</div>;
            case 'SAVE':
                const classesApplied = classNames({
                    icon: true,
                    like: this.props.liked ? false : true,
                    liked: this.props.liked ? true : false,
                });
                return <div className="miniCardButton fillParent" onClick={this.props.clickAction}>
                    <span className={classesApplied}></span>
                    {this.props.liked ? Localize('CAROUSEL_CARD_SAVED') : Localize('CAROUSEL_CARD_SAVE')}
                </div>;

            default:
                return <div className="miniCardButton fillParent" onClick={this.props.clickAction}></div>;
        }

    }

}

export const MiniCardButton = navigable(MiniCardButtonClass);
