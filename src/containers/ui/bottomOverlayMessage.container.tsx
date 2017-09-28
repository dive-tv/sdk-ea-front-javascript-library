import * as React from 'react';

import { NavigationContainer } from "Components";
import { Localize } from 'Services';
import { navigable } from 'HOC';

interface IBOMProps {
    channelStatus: string;
    navigationParent: any;
    setNodeByName?: (name: string) => any;
    closeInfoMsg: () => any;
};
export class BottomOverlayMessageClass extends React.PureComponent<IBOMProps> {

    private adMessageContent: JSX.Element;
    private endMessageContent: JSX.Element;
    private offMessageContent: JSX.Element;
    private readyMessageContent: JSX.Element;


    constructor(props: IBOMProps) {
        super(props);
        this.state = { hidden: false };

        this.adMessageContent = (
            <div key="adMessageContent" className="fillParent adMessage carouselMessageContent">
                <div className="adMessageLeft">
                    <h1>{Localize("PIZZA_OR_POP_CORN")}</h1>
                    <p className="text1">{Localize("WE_RECOMMEND")}</p>
                    <p className="text2">{Localize("MAKE_POP_CORN")}</p>
                </div>
                <div className="adMessageRight">
                    <h1>{Localize("TVGRID_COMMERCIAL_TXT")}</h1>
                </div>
            </div>
        );

        this.endMessageContent = (
            <div key="endMessageContent" className="fillParent endMessage carouselMessageContent centeredMessage">
                <div className="messageCenter">
                    <h1>{Localize("EVERYTHING_END")}</h1>
                    <p className="text1">{Localize("MOVIE_ENDED")}</p>
                    <div className="buttonsContainer">
                        <NavigationContainer
                            className="genericBtn"
                            parent={this}
                            isDefault={true}
                            columns={1}
                            key="messageCloseCarousel"
                            onClick={() => {
                                //this.props.uiActions.open({ top: "TV", bottom: "GRID" });
                            }}
                        >{Localize("OKAY")}</NavigationContainer>
                    </div>
                </div>
            </div>
        );

        this.offMessageContent = (
            <div key="offMessageContent"
                className="fillParent offMessageContent carouselMessageContent centeredMessage">
                <div className="messageCenter">
                    <h1>{Localize("EVERYTHING_END")}</h1>
                    <p className="text1">{Localize("MOVIE_OFF")}</p>
                    <div className="buttonsContainer">
                        <NavigationContainer
                            className="genericBtn"
                            key="messageCloseCarousel"
                            parent={this}
                            isDefault={true}
                            columns={1}
                            onClick={() => {
                                //this.props.uiActions.open({ top: "TV", bottom: "GRID" });
                            }}
                        >{Localize("OKAY")}</NavigationContainer>
                    </div>
                </div>
            </div>
        );

        this.readyMessageContent = (
            <div key="offMessageContent"
                className="fillParent readyMessageContent carouselMessageContent centeredMessage">
                <div className="messageCenter">
                    <h1>{Localize("LIGHTS_CAMERA")}</h1>
                    <p className="text1">{Localize("WE_ARE_LOADING")}</p>
                </div>
            </div>
        );

    }
    public render(): any {
        return this.getChildren();
    }

    public componentWillUnmount() {
        if (this.props.setNodeByName) {
            setTimeout(() => {
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
                            isDefault={false}
                            columns={1}
                            onClick={() => {
                                this.props.closeInfoMsg();
                            }}
                        />
                    </div>
                    <div>{this.getMessageForCarousel()}</div>
                </div>
            </div>);
    }
    
    private getMessageForCarousel(): JSX.Element {
        let messageContent;
        const channelStatus = this.props.channelStatus;

        switch (channelStatus) {
            case "paused":
            return this.adMessageContent;
            case "end":
            return this.endMessageContent;
            case "off":
            return this.offMessageContent;
            case "ready":
            return this.readyMessageContent;
        }
    }

}

export const BottomOverlayMessage = navigable(BottomOverlayMessageClass)
