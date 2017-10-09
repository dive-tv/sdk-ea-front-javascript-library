import * as React from 'react';
import { connect } from 'react-redux';

import { CardDetail, Loading, HbbtvLiveStream, VODvideo, Menu } from 'Components';
import { Carousel, AllRelationsContainer } from 'Containers';
import { IState, IUIState, UILayerBottomTypes, UILayerTopTypes/*, IErrorState*/ } from 'Reducers';
import { UIActions, IUIActions } from 'Actions';
import { navigable } from 'HOC';
import { Card, KeyMap } from "Services";
import { bindActionCreators } from 'redux';

type LayoutProps = { ui: IUIState/*, error: IErrorState*/, testCards: Card[] } & { uiActions: IUIActions };
export class LayoutClass extends React.PureComponent<LayoutProps, {}> {
    private lastTimeMenuClicked: number;

    // constructor(props: any) {
    //     super(props);
    //     this.props.uiActions.openCard("28e7cb52-01a2-3e95-a71f-4fc2d3e46f86", "offmovie", true);
    // }

    public render(): any {
        console.log("[LayoutClass] Render ", this.props.ui);
        if (this.props && this.props.ui) {
            console.log("[LayoutClass] Render OK");
            // Top configuration
            const topType: UILayerTopTypes = this.props.ui.containers[0].component as UILayerTopTypes;
            const topStyle: React.CSSProperties = { height: `${this.props.ui.divider}%` };

            // Bottom configuration
            const bottomType: UILayerBottomTypes = this.props.ui.containers[1].component as UILayerBottomTypes;
            const bottomStyle: React.CSSProperties = { /*height: `${100 - this.props.ui.divider}%`*/ };
            return (
                <div className="containerLayout"
                    onKeyUp={(e) => { this.onKeyPressUp(e); }}
                >
                    <div className="layoutTop" style={topStyle}>
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
                        {this.getTop(topType)}
                    </div>

                    <div className="layoutBottom" style={bottomStyle}>
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

    public onKeyPressUp(e: any) {
        const km: any = KeyMap;
        if (this.props.ui && this.props.ui.containers && this.props.ui.containers[1].component) {
            switch (e.keyCode) {
                case km.BACK:
                    switch (this.props.ui.containers[1].component) {
                        case "CARD":
                            if (this.props.ui.prevCards && this.props.ui.prevCards.length > 0) {
                                this.props.uiActions.closeCard();
                            } else {
                                this.props.uiActions.goBack();
                            }
                            break;
                    }
                    break;
            }
        }
    }

    public componentWillMount() {
        console.log("[Layout] componentWillMount:", this.props);
        this.props.uiActions.setDivider(this.props.ui.divider);
    }

    public componentWillUpdate(nextProps: Readonly<LayoutProps>, nextState: Readonly<LayoutProps>) {
        this.lastTimeMenuClicked = Date.now();
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
    }

}

const mapStateToProps = (state: IState): { ui: IUIState/*, error: IErrorState*/ } => {
    return { ui: state.ui.present };
};

const mapDispatchToProps = (dispatch: any): any => {
    return {
        uiActions: bindActionCreators(UIActions, dispatch),
    };
};

export const Layout = navigable(connect(
    mapStateToProps,
    mapDispatchToProps,
)(LayoutClass));
