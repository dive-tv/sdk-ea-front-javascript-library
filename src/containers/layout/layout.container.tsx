import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RxJS from 'rxjs';

import { keyUpObservable$, VOD_MODE } from 'Constants';
import { CardDetail, Loading, HbbtvLiveStream, VODvideo, Menu } from 'Components';
import { Carousel, AllRelationsContainer } from 'Containers';
import {
    IState, IUIState, UILayerBottomTypes, UILayerTopTypes,/*, IErrorState*/
    ISyncState,
} from 'Reducers';
import { UIActions, IUIActions, SyncActions, ISyncActions } from 'Actions';
import { navigable } from 'HOC';
import { Card, KeyMap, EaAPI } from "Services";

declare const DiveAPI: EaAPI;

// tslint:disable-next-line:no-namespace
export namespace Layout {
    export interface IOwnProps {
        showMenu: boolean;
    }

    export interface IActionProps {
        uiActions: IUIActions;
        syncActions: ISyncActions;
    }

    export interface IState {
        ui: IUIState;
        /*carousel: ISyncState;*/
    }
}

// tslint:disable-next-line:max-line-length
type LayoutProps = Layout.IState & Layout.IActionProps & Layout.IOwnProps;
export class LayoutClass extends React.PureComponent<LayoutProps, {}> {
    private lastTimeMenuClicked: number;
    private keysUsed: number[] = [KeyMap.COLOR_YELLOW, KeyMap.BACK];

    // constructor(props: any) {
    //     super(props);
    //     this.props.uiActions.openCard("28e7cb52-01a2-3e95-a71f-4fc2d3e46f86", "offmovie", true);
    // }

    public render(): any {
        if (this.props && this.props.ui) {
            // Top configuration
            const topType: UILayerTopTypes = this.props.ui.containers[0].component as UILayerTopTypes;
            const topStyle: React.CSSProperties = { height: `${this.props.ui.divider}%` };

            // Bottom configuration
            const bottomType: UILayerBottomTypes = this.props.ui.containers[1].component as UILayerBottomTypes;
            const bottomStyle: React.CSSProperties = {
                // paddingBottom: this.props.ui.divider === 100 ? "0" : "22.5%",
                height: this.props.ui.divider === 100 ? "0" : `${100 - this.props.ui.divider}%`
            };
            return (
                <div className="containerLayout">
                    <div className="layoutTop" style={topStyle}>
                        {this.props.showMenu &&
                            <div className="layoutMenu">
                                <Menu title="Menu"
                                    focusChainClass="navActivating"
                                    open={this.props.uiActions.open}
                                    addMenuId={this.props.uiActions.addMenuId}
                                    removeMenuId={this.props.uiActions.removeMenuId}
                                    setMenuActivated={this.props.uiActions.setMenuActivated}
                                    menuActivated={this.props.ui.menuActivated}
                                    menuIds={this.props.ui.menuIds}
                                    elements={this.props.ui.menu}
                                    menuVisualState={this.props.ui.menuVisualState}
                                    parent={this}
                                    columns={1}
                                />
                            </div>
                        }
                        {this.getTop(topType)}
                    </div>

                    <div className="layoutBottom customBkg" style={bottomStyle}>
                        <div className="layoutBottomSub">
                            {this.getBottom(bottomType)}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    public componentWillMount() {
        console.log("[Layout] componentWillMount:", this.props);
        this.props.uiActions.setDivider(this.props.ui.divider);
    }

    public componentDidMount() {
        const keyUpObservableFiltered: RxJS.Subscription = keyUpObservable$
            .filter((event: KeyboardEvent) => {
                console.warn("LAYOUT KEYCODE", event.keyCode);
                return this.keysUsed.indexOf(event.keyCode) > -1;
            })
            .subscribe((event: KeyboardEvent) => {
                // console.warn("HANDLED KEYCODE", keyCode);
                this.onKeyPressUp(event);
            });
    }

    public componentWillUpdate(nextProps: Readonly<LayoutProps>, nextState: Readonly<LayoutProps>) {
        this.lastTimeMenuClicked = Date.now();
    }

    // HANDLERS
    public onKeyPressUp = (event: KeyboardEvent) => {
        const km: any = KeyMap;
        const keyCode = event.keyCode;
        console.log("LAYOUT kp", keyCode);

        switch (keyCode) {
            case km.BACK:
                if (this.props.ui && this.props.ui.containers && this.props.ui.containers[1].component) {
                    switch (this.props.ui.containers[1].component) {
                        case "CARD":
                            if (this.props.ui.prevCards && this.props.ui.prevCards.length > 0) {
                                this.props.uiActions.closeCard();
                            } else {
                                this.props.uiActions.goBack();
                            }
                            break;
                    }
                }
                break;

            case km.COLOR_YELLOW:
                if (this.props.ui && this.props.ui.containers[0].component === "VODVIDEO") {
                    const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
                        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
                        ((document as any).mozFullScreenElement && (document as any).mozFullScreenElement !== null) ||
                        ((document as any).msFullscreenElement && (document as any).msFullscreenElement !== null);
                    console.log("Is in full screen? ", isInFullScreen);
                    if (isInFullScreen) {
                        /*
                        // Cancel fullscreen
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if ((document as any).mozCancelFullScreen) {
                            (document as any).mozCancelFullScreen();
                        } else if ((document as any).msExitFullscreen) {
                            (document as any).msExitFullscreen();
                        }*/
                        // Request FS for DIVE
                        /* DISABLE FOR CLARO
                        const el = document.getElementById("globalDiveContainer");
                        if (el && (el.requestFullscreen || el.webkitRequestFullscreen)) {
                            if (el.webkitRequestFullscreen) {
                                el.webkitRequestFullScreen();
                            } else {
                                el.requestFullscreen();
                            }
                        }
                        */
                    } else {
                        console.log("NOT FS");
                    }
                    // Toogle show/hide
                    if (this.props.ui.divider === 100) {
                        this.props.uiActions.setDivider(60);
                    } else {
                        this.props.uiActions.setDivider(100);
                    }
                    window.scrollTo(0, 0);
                    event.stopPropagation();
                    event.preventDefault();
                }
                break;
        }
    }

    private getTop(componentType: UILayerTopTypes): JSX.Element | null {
        switch (componentType) {
            case 'VODVIDEO':
                return <VODvideo key="vodVideo" containerHeight={this.props.ui.divider} />;
            default:
                return null; // <HbbtvLiveStream key="liveStream" />;
        }
    }

    private getBottom(componentType: UILayerBottomTypes) {
        if (this.props.ui.divider !== 100) {
            switch (componentType) {
                case 'CAROUSEL':
                    return <Carousel
                        key={`carousel#${this.lastTimeMenuClicked}`}
                        // key="CAROUSEL"
                        parent={this}
                        columns={1}
                        name="CAROUSEL"
                        groupName="CAROUSEL" isDefault={true} />;
                case 'CARD':
                    this.lastTimeMenuClicked = Date.now();
                    if (this.props.ui.card === undefined) {
                        return <Loading />;
                    }
                    return (<CardDetail
                        card={this.props.ui.card}
                        key={`cardDetail_${this.props.ui.card.card_id}`}
                        navClass="cardDetailNav"
                        parent={this}
                        columns={1}
                        isDefault={true}
                    />
                    );
                case 'ALL_RELATIONS':
                    return (<AllRelationsContainer
                        cards={this.props.ui.allRelations}
                        openSync={this.props.uiActions.openSync}
                        parent={this}
                        columns={1}
                        isDefault={true}
                    />);
                default:
                    return null;

            }
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state: IState): { ui: IUIState/*, carousel: ISyncState*//*, error: IErrorState*/ } => {
    return { ui: state.ui.present/*, carousel: state.carousel*/ };
};

const mapDispatchToProps = (dispatch: any): any => {
    return {
        uiActions: bindActionCreators(UIActions, dispatch),
        syncActions: bindActionCreators(SyncActions, dispatch),
    };
};

export const Layout = navigable(connect<Layout.IState, Layout.IActionProps, Layout.IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(LayoutClass));
