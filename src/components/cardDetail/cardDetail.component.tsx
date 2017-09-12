import * as React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Loading, NavigationContainer } from 'Components';
import { IUIActions, UIActions } from 'Actions';
import { navigable, INavigableProps } from "HOC";
import { cardModuleConfig, cardModuleClasses, IValidatable, isValidatable } from 'CardModules';
import { NavigableCardModuleList } from "Containers";
import { Card } from "Services";

import * as theme from "../../scss/theme/theme.scss";
// import { MainTheme } from "Theme";

// console.error("MAIN THEME", MainTheme);

declare type DiveAPI = any;
export type CardDetailStatus = "LOADING" | "DONE";
export type RelationTypes = "all" | "offmovie" | "none";
export interface ICardDetailOwnProps {
    card: Card;
    relations?: RelationTypes;
}
export type CardDetailProps = ICardDetailOwnProps & { uiActions: IUIActions };
export interface ICardDetailState { status: CardDetailStatus; }
export const cardDetailInitialState: ICardDetailState = {
    status: "LOADING",
};

export class CardDetailClass
    extends React.PureComponent<CardDetailProps, ICardDetailState> {
    private cardModules: JSX.Element[] = [];
    constructor(props: CardDetailProps) {
        super(props);
        this.state = cardDetailInitialState;
    }
    public render(): any {
        return (
            <div className={`cardDetail fillParent ${theme.mainBackgroundAndBaseColor} ${theme.cardDetail}`}>
                <div className="bottomContainerTopButtons">
                    <div className="cardDetailBtn">
                        <NavigationContainer key="carouselClose" className="bctButton close"
                            parent={this}
                            clickAction={() => {
                                return "";
                            } /*this.closeAllCards.bind(this)*/}
                            columns={1}
                        >
                        </NavigationContainer>
                    </div>
                </div>
                {this.props.card ?
                    <NavigableCardModuleList
                        isDefault={true}
                        parent={this} columns={1}
                        card={this.props.card} />
                    : <Loading />}
            </div>
        );
    }

    public closeAllCards() {
        console.log("CLOSE ALL CARDS");
        // TODO: logic to close all cards
        this.props.uiActions.openSync();
    }

    public componentDidUpdate() {
        if (this.props.card && this.state.status !== "DONE") {
            this.setState({ ...this.state, status: "DONE" });
        }
    }

    private addToArrayIfExists(targetArray: Array<React.Component<any, any>>, candidate: any) {
        if (candidate) {
            targetArray.push(candidate);
        }
    }
}

const mapDispatchToProps = (dispatch: any): any => {
    return {
        uiActions: bindActionCreators(UIActions, dispatch),
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    return { ...stateProps, ...ownProps, ...dispatchProps };
};

export const CardDetail = navigable(connect(
    undefined,
    mapDispatchToProps,
    mergeProps,
)(CardDetailClass)) as React.ComponentClass<INavigableProps & ICardDetailOwnProps>;
