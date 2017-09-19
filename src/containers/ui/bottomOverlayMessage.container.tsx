import * as React from 'react';

import { NavigationContainer } from "Components";

interface IBOMProps {
    navigationParent: any;
};
export class BottomOverlayMessage extends React.PureComponent<IBOMProps, { hidden: boolean }> {
    constructor(props: IBOMProps) {
        super(props);
        this.state = { hidden: false };
    }
    public render(): any {
        return this.state && this.state.hidden ? null : this.getChildren();
    }
    private getChildren() {
        return (
            <div className="bottomMessage fillParent">
                <NavigationContainer
                    modal={true}
                    parent={this.props.navigationParent}
                    isDefault={true}
                    propagateParent={true}
                    columns={1}>
                    <div className="messageContainer">
                        <div className="closeContainer">
                            <NavigationContainer className="carouselButton carouselClose"
                                parent={this}
                                isDefault={true}
                                columns={1}
                                onClick={() => {
                                    this.setState({ hidden: true });
                                }}
                            ></NavigationContainer>
                        </div>
                        {this.props.children}
                    </div>
                </NavigationContainer>
            </div>);
    }
}
