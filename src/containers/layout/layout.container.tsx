import * as React from 'react';
import { connect } from 'react-redux';

import { CardDetail } from 'Components';
import { Carousel, CardDetailContainer } from 'Containers';
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

    public getTop(componentType: UILayerTopTypes): JSX.Element | null {
        return null;
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
                return this.props.ui.testCards.map((card: Card| {card_id: string, version?:string}, idx: number) => {
                    return <CardDetailContainer
                        cardId={card.card_id}
                        version={card.version}
                        key={`cardDetail_${idx}`}
                        navClass="cardDetailNav"
                        parent={this}
                        columns={1}
                        isDefault={true}
                    />;
                });

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
    return { ui: state.ui, };
};

export const Layout = navigable(connect(
    mapStateToProps,
    UIActions,
)(LayoutClass));
