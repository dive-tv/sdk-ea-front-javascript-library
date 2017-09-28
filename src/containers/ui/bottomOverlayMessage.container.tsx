import * as React from 'react';

import { NavigationContainer } from "Components";
import { navigable } from 'HOC';

interface IBOMProps {
    navigationParent: any;
    setNodeByName?: (name: string) => any;
    closePausedMsg: () => any;
};
export class BottomOverlayMessageClass extends React.PureComponent<IBOMProps, { hidden: boolean }> {
    constructor(props: IBOMProps) {
        super(props);
        this.state = { hidden: false };
    }
    public render(): any {
        return this.state && this.state.hidden ? null : this.getChildren();
    }

    public componentWillUnmount() {
        if (this.props.setNodeByName) {
            setTimeout(() => {
                console.log("PLATANO");
                this.props.setNodeByName("CAROUSEL");
            }, 50);
        }
    }

    private getChildren() {
        return (
            <div className="bottomMessage fillParent">
                <div className="messageContainer bottomContainerTopButtons">
                    <div className="closeContainer">
                        <NavigationContainer className="carouselButton bctButton close"
                            parent={this}
                            modal={true}
                            isDefault={true}
                            columns={1}
                            onClick={() => {
                                this.props.closePausedMsg();
                            }}
                        />
                    </div>
                    <div>{this.props.children}</div>
                </div>
            </div>);
    }
}

export const BottomOverlayMessage = navigable(BottomOverlayMessageClass)
