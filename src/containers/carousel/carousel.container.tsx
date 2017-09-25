import * as React from 'react';
import { connect, MapDispatchToPropsObject } from 'react-redux';
import { bindActionCreators } from "redux";

import { navigable, INavigableProps } from 'HOC';
import { Loading, NavigationContainer, MiniCardList } from 'Components';
import { IState, ISyncState, INavState, CardRender } from 'Reducers';
import { SyncActions, ISyncActions, UIActions, IUIActions } from 'Actions';
import { Localize, Card, RelationModule } from 'Services';
import { SUPPORTED_CARD_TYPES } from 'Constants';
import { BottomOverlayMessage } from "Containers";

export class CarouselClass
    extends React.PureComponent<{ state: ISyncState } & ISyncActions & INavigableProps & INavState &
    { uiActions: MapDispatchToPropsObject }, { rewinded: boolean }> {
    private interval: any;
    private chunkRequested: boolean = false;
    private buttonsContainer: any;
    private activeFilters: any[];
    private currentSceneText = Localize("CURRENT_SCENE");
    private adMessageContent: JSX.Element;
    private endMessageContent: JSX.Element;
    private offMessageContent: JSX.Element;
    private readyMessageContent: JSX.Element;
    constructor(props: any) {
        super(props);
        this.state = { rewinded: false };
        this.closeCarousel = this.closeCarousel.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
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
                                this.props.uiActions.open({ top: "TV", bottom: "GRID" });
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
                                this.props.uiActions.open({ top: "TV", bottom: "GRID" });
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

    public componentWillUpdate(nextProps: Readonly<{ state: ISyncState; }
        & ISyncActions & INavigableProps & INavState>) {
        /*if (nextProps.state.type === "SOCKET" && nextProps.state.socketStatus !== this.props.state.socketStatus
            && nextProps.state.socketStatus === 'CONNECTED') {
            this.props.dataSync(nextProps.state.movieId);
        }*/
    }

    public componentWillMount() {
        this.props.syncChannel();
        this.activeFilters = [this.allCategoriesFilter];
    }

    public componentWillUnmount() {
        // this.props.setSelectedOnSceneChange(false);
    }

    public getState = (): ISyncState => {
        return this.props.state;
    }

    public render(): any {
        let cards: CardRender[] =
            this.props.state.cards !== undefined ? this.props.state.cards : [];
        // const scene: IChunkScene = this.props.state.scene;

        // Filter by offset and getting relation cards to the first level.
        cards = cards.filter((card: CardRender) => {
            return card && card.type &&
                card.type !== 'person';
        });

        return (
            <div className="containerCarousel fillParent">
                <NavigationContainer key="buttonContainer"
                    ref={(el: any) => { if (el) { this.buttonsContainer = el.getWrappedInstance().refComponent; } }}
                    propagateParent={false}
                    parent={this}
                    forceFirst={true}
                    columns={1}>
                    {this.buttonsContainer ? this.getButtons() : ""}
                </NavigationContainer>
                <div className="cards">
                    {
                        cards.length === 0 ?
                            <Loading /> :
                            <MiniCardList
                                elements={cards}
                                movieId={this.getState().movieId}
                                getMovieTime={this.getCurrentTime}
                                parent={this}
                                columns={1}
                                // key={`${this.props.state.movieId}#${Date.now}`}
                                groupName="MiniCardList"
                                setSelectedOnSceneChange={this.props.setSelectedOnSceneChange}
                                wasSelectedOnChangeScene={this.props.state.selectedOnSceneChange}
                            />
                    }
                </div>
                {this.getMessageForCarousel()}
            </div >
        );
    }

    private getCurrentTime() {
        return this.props.state.currentTime;
    }

    private getButtons(): JSX.Element {
        let currentTimeInSecs = this.props.state.currentTime;
        const hours = Math.floor(currentTimeInSecs / 3600);
        currentTimeInSecs %= 3600;
        const minutes = Math.floor(currentTimeInSecs / 60);
        const seconds = parseInt((currentTimeInSecs % 60).toFixed(0), 10);

        let buttonCount = 7;
        if (0) { // TODO: Check if prev button needed
            buttonCount--;
        }
        if (0) { // TODO: Check if next button needed
            buttonCount--;
        }
        if (this.state.rewinded === false) {
            buttonCount--;
        }
        const timeFormatted = `${hours < 10 ? "0" + hours : hours}:`
            + `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        const buttonsToRender = [];
        buttonsToRender.push(<NavigationContainer key="carouselClose" className="carouselButton bctButton close"
            forceOrder={0}
            parent={this.buttonsContainer}
            onClick={this.closeCarousel}
        >
        </NavigationContainer>);
        return (
            <div id="carouselButtons" className="bottomContainerTopButtons">
                {buttonsToRender}
            </div>);
    }

    private closeCarousel() {
        this.props.uiActions.open({ top: "TV", bottom: "GRID" });
    }

    private getMessageForCarousel() {
        let messageContent;
        const channelStatus = this.getState().channelStatus;
        if (channelStatus === "paused") {
            messageContent = this.adMessageContent;
        } else if (channelStatus === "end") {
            messageContent = this.endMessageContent;
        } else if (channelStatus === "off") {
            messageContent = this.offMessageContent;
        } else if (channelStatus === "ready") {
            messageContent = this.readyMessageContent;
        }
        // TODO: Message Logic
        // Show message only if not has been closed before,
        // and if the carousel its synced on the correct time (not rewind)
        if (messageContent /*&& onTime && !messageDiscarded*/) {
            return (
                <BottomOverlayMessage
                    key={`bottomMessage#${this.props.state.timeMovieSynced}#${channelStatus}`}
                    navigationParent={this}>
                    {messageContent}
                </BottomOverlayMessage>
            );
        }
    }

    // CAROUSEL FILTERS
    private allCategoriesFilter() {
        return true;
    }
}

const mapStateToProps = (state: IState): { state: ISyncState } => ({ state: { ...state.carousel } });
const mapDispatchToProps = (dispatch: any): any => {
    return {
        ...bindActionCreators(SyncActions, dispatch),
        uiActions: bindActionCreators(UIActions, dispatch),
    };
};

export const Carousel = navigable(connect(
    mapStateToProps,
    mapDispatchToProps,
)(CarouselClass));
