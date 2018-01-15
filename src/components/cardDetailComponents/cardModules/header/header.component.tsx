import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Card, Helper, Localize, Catalog } from "Services";
import { MiniCard, CardAndCategory, NavigationContainer } from "Components";
import { ICardModuleProps } from "CardModules";
import { navigable, statics } from "HOC";
import { UIActions } from "Actions";

interface IHeaderProps {
    title: string | null;
    subtitle: string | JSX.Element | Element | null;
    navigableSubtitle: boolean;
    time: string | null; // "2 h 13 m";
    titleParenthesis: string | null; // = "2017";
    categories: string | null; // "Bio, Adventure, Comedy";
}

@statics({
    moduleName: "header",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
        const title: string | null = card.title;
        let subtitle: string | JSX.Element | Element | null = card.subtitle && card.subtitle !== "" ?
            card.subtitle : null;
        let time: string | null = null; // "2 h 13 m";
        let titleParenthesis: string | null = null; // = "2017";
        let categories: string | null = null; // "Bio, Adventure, Comedy";
        let navigableSubtitle = false;

        switch (card.type) {
            case "movie":
            case "serie":
            case "chapter":
                const catalogInfo = Helper.getContainer(card, "catalog") as Catalog;
                if (catalogInfo && catalogInfo.data &&
                    catalogInfo.data[0]) {
                    const mediaData = catalogInfo.data[0];
                    if (mediaData.runtime) {
                        let currentTimeInMin = mediaData.runtime!;
                        const hours = Math.floor(currentTimeInMin / 60);
                        currentTimeInMin %= 60;
                        const minutes = Math.floor(currentTimeInMin);
                        time = `${minutes} m`;
                        if (hours > 0) {
                            time = `${hours} h ${time}`;
                        }
                    }
                    if (mediaData.year) {
                        titleParenthesis = `${catalogInfo.data[0].year}`;
                    }
                    if (mediaData.genres && mediaData.genres.length > 0) {
                        categories = mediaData.genres.join(", ");
                    }
                    if (mediaData.director && mediaData.director !== "") {
                        subtitle = mediaData.director;
                        // TODO: The id card for the director does not come with the card // navigableSubtitle = true;
                    }
                }
                break;
        }

        const Instantiated = navigable(connect(undefined, Header.mapDispatchToProps)(Header as any)) as any;

        return (<Instantiated
            parent={parent}
            isScrollable={true}
            card={card} moduleType={moduleType}
            title={title} subtitle={subtitle}
            navigableSubtitle={navigableSubtitle}
            time={time} titleParenthesis={titleParenthesis}
            categories={categories}
            {...props}
        />);
    },
})
export class Header extends React.PureComponent<ICardModuleProps & IHeaderProps, {}> {
    public static mapDispatchToProps(dispatch: any) {
        return {
            // userActions: bindActionCreators(UserActions, dispatch),
            uiActions: bindActionCreators(UIActions, dispatch),
        };
    }
    public getSubtitle() {
        if (this.props.navigableSubtitle && this.props.subtitle) {
            // TODO: open card
            return (
                <div className="subtitle">
                    <NavigationContainer
                        parent={this} columns={1}
                        // clickAction={el.from ? () => { return (this.props.uiActions as any).openCard(el.from.card_id, "offmovie"); } : null}
                    >
                        {this.props.subtitle}
                    </NavigationContainer>
                </div>
            );
        } else if (this.props.subtitle) {
            return (<div className="subtitle">{this.props.subtitle}</div>);
        } else {
            return null;
        }
    }
    public render(): JSX.Element {
        const subtitle = this.getSubtitle();
        return (
            <div className={`header cardModule ${this.props.card.type}`}>
                <CardAndCategory card={this.props.card} />
                <div className="rightPart">
                    <div className="info">
                        <div className="titleContainer">
                            <p className="title customTitle">{this.props.title}</p>
                            {
                                this.props.titleParenthesis ?
                                    <div className="titleParenthesis"> ({this.props.titleParenthesis})</div> :
                                    null
                            }
                        </div>
                        {subtitle}
                        {this.props.categories ? <div className="categories">{this.props.categories}</div> : null}
                        {this.props.time ? (<div className="time">
                            <i className="clock"></i><span>{this.props.time}</span>
                        </div>) : null}
                        <div className="headerButtons">
                            <NavigationContainer
                                parent={this}
                                columns={1}
                                isDefault={true}
                                className={`likeButton genericBtn customBtn`}
                            // clickAction={this.clickLike.bind(this)}
                            >
                                <div className="centeredContent">
                                    <i className="icon like"></i>
                                    <span>{Localize("CAROUSEL_CARD_SAVE")}</span>
                                </div>
                            </NavigationContainer>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
