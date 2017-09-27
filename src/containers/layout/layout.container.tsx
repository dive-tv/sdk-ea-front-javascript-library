import * as React from 'react';
import { connect } from 'react-redux';

import { CardDetail } from 'Components';
import { Carousel, CardDetailContainer, AllRelationsContainer } from 'Containers';
import { IState, IUIState, UILayerBottomTypes, UILayerTopTypes/*, IErrorState*/ } from 'Reducers';
import { UIActions, IUIActions } from 'Actions';
import { navigable } from 'HOC';
import { Card } from "Services";

type LayoutProps = { ui: IUIState/*, error: IErrorState*/, testCards: Card[] } & IUIActions;
export class LayoutClass extends React.PureComponent<LayoutProps, {}> {
    private lastTimeMenuClicked: number;

    public render(): any {
        console.log("[LayoutClass] Render ", this.props.ui);
        if (this.props && this.props.ui) {
            console.log("[LayoutClass] Render OK");
            // Top configuration
            const topType: UILayerTopTypes = this.props.ui.containers[0].component as UILayerTopTypes;
            const topStyle: React.CSSProperties = { height: `${this.props.ui.divider}%` };

            // Bottom configuration
            const bottomType: UILayerBottomTypes = this.props.ui.containers[1].component as UILayerBottomTypes;
            const bottomStyle: React.CSSProperties = { height: `${100 - this.props.ui.divider}%` };
            return (
                <div className="containerLayout">
                    <div className="layoutTop" style={topStyle}>
                        {this.getTop(topType)}
                    </div>

                    <div className="layoutBottom" style={bottomStyle}>
                        {this.getBottom(bottomType)}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    public componentDidMount() {
        window.setTimeout(this.getVideoStatus, 500);
    }

    public componentDidUpdate() {
        window.setTimeout(this.getVideoStatus, 500);
    }

    public getVideoStatus() {
        //const murl = "http://itv.mit-xperts.com/hbbtvtest/media/livestream.php";
        const murl = "http://demo.dive.tv:8095/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000";
        try {
            const videlem1: any = document.getElementById('video1');
            if (videlem1.play) {
                if (true) {
                    videlem1.onPlayStateChange = function () {
                        if (1 == videlem1.playState) {
                            videlem1.onPlayStateChange = null;
                            //document.getElementById("1").innerHTML = "1 ERROR STATUS";
                            //(document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "red";
                        } else if (6 == videlem1.playState) {
                            videlem1.onPlayStateChange = null;
                            //document.getElementById("1").innerHTML = "6 ERROR STATUS";
                            //(document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "green";
                        }
                    };
                }
                videlem1.data = murl;
                videlem1.play(1);
            } else {
                throw new Error("not video found");
            }
        } catch (e) {
            //document.getElementById("1").innerHTML = "CATCH ERROR STATUS";
            (document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "pink";
            (document.getElementsByClassName("layoutTop")[0] as any).style.color = "black";
            (document.getElementsByClassName("layoutTop")[0] as any).style.fontSize = "40px";
            (document.getElementsByClassName("layoutTop")[0] as any).innerHTML += "ERROR: " + e;
        }
        /*const videlem2: any = document.getElementById('video2');
        const videlem3: any = document.getElementById('video3');
        videlem2.play(1);
        videlem3.play(1);*/
    }

    public getTop(componentType: UILayerTopTypes): JSX.Element | null {
        const styled: any = "position: relative; left: 700px; top: 300px; width: 320px; height: 180px; background-color:red;";
        /*
        http://demo.dive.tv:8079
http://demo.dive.tv:8095/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000
http://demo.dive.tv:8096/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000
*/
        return (
            <div id="videoContainer" dangerouslySetInnerHTML={
                {
                    __html: `<object xmlns="http://www.w3.org/1999/xhtml" id="video1" type="video/mpeg" style="position: relative; top: 0; width: 100%; height: 100%;"></object>`
                }
            }>
            </div>
        );
    }

    public getBottom(componentType: UILayerBottomTypes) {
        switch (componentType) {
            case 'CAROUSEL':
                return <Carousel key={`carousel#${this.lastTimeMenuClicked}`}
                    parent={this}
                    columns={1}
                    name="CAROUSEL" groupName="CAROUSEL" isDefault={true} />;
            case 'CARD':
                /*return <CardDetail key={"cardDetail"}
                    card={this.props.ui.card}
                    parent={this}
                    columns={1}
                    isDefault={true}
                />;*/

                // const cards: Card[] | {card_id: string, version?:string}[]  = [...this.props.ui.testCards, ...this.props.sceneCards];
                // console.log('cards', cards);
                return (<CardDetailContainer
                        cardId={this.props.ui.card.card_id}
                        version={this.props.ui.card.version}
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
                openSync={this.props.openSync}
                parent= {this}
                columns={1}
                isDefault={true}
                />);
            default:
                return null;
        }
    }

    public componentWillMount() {
        console.log("[Layout] componentWillMount:", this.props);
        this.props.setDivider(this.props.ui.divider);
    }

    public componentWillUpdate(nextProps: Readonly<LayoutProps>, nextState: Readonly<LayoutProps>) {
        this.lastTimeMenuClicked = Date.now();
    }
}

const mapStateToProps = (state: IState): { ui: IUIState/*, error: IErrorState*/ } => {
    return { ui: state.ui.present };
};


export const Layout = navigable(connect(
    mapStateToProps,
    UIActions,
)(LayoutClass));
