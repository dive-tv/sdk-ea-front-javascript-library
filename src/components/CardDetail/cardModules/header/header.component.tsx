import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Card, Helper, Localize, Catalog } from "Services";
import { MiniCard, CardAndCategory, NavigationContainer } from "Components";
import { ICardModuleProps } from "CardModules";
import { navigable, statics } from "HOC";

import { Theme } from "Theme";

interface IHeaderProps {
    title: string | null;
    subtitle: string | null;
    time: string | null; // "2 h 13 m";
    titleParenthesis: string | null; // = "2017";
    categories: string | null; // "Bio, Adventure, Comedy";
}

@statics({
    moduleName: "header",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
        const title: string | null = card.title;
        const subtitle = card.subtitle && card.subtitle !== "" ? card.subtitle : null;
        let time: string | null = null; // "2 h 13 m";
        let titleParenthesis: string | null = null; // = "2017";
        let categories: string | null = null; // "Bio, Adventure, Comedy";

        switch (card.type) {
            case "movie":
            case "serie":
            case "chapter":
                const catalogInfo = Helper.getContainer(card, "catalog") as Catalog;
                if (catalogInfo && catalogInfo.data &&
                    catalogInfo.data[0]) {
                    const mediaData = catalogInfo.data[0];
                    if (mediaData.runtime) {
                        let currentTimeInSecs = mediaData.runtime!;
                        const hours = Math.floor(currentTimeInSecs / 3600);
                        currentTimeInSecs %= 3600;
                        const minutes = Math.floor(currentTimeInSecs / 60);
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
                }
                break;
        }

        const Instantiated = navigable(Header);

        return (<Instantiated
            parent={parent}
            isScrollable={true}
            card={card} moduleType={moduleType}
            title={title} subtitle={subtitle}
            time={time} titleParenthesis={titleParenthesis}
            categories={categories}
            {...props}
        />);
    },
})
export class Header extends React.PureComponent<ICardModuleProps & IHeaderProps, {}> {
    public render(): JSX.Element {
        return (
            <div className="header cardModule">
                <CardAndCategory card={this.props.card} />
                <div className="rightPart">
                    <div className="info">
                        <div className="titleContainer">
                            <p className={`title ${Theme.cardDetailTitle}`}>{this.props.title}</p>
                            {
                                this.props.titleParenthesis ?
                                    <div className="titleParenthesis"> ({this.props.titleParenthesis})</div> :
                                    null
                            }
                        </div>
                        {this.props.subtitle ? <div className="subtitle">{this.props.subtitle}</div> : null}
                        {this.props.categories ? <div className="categories">{this.props.categories}</div> : null}
                        {this.props.time ? (<div className="time">
                            <i className="clock"></i><span>{this.props.time}</span>
                        </div>) : null}
                        <div className="headerButtons">
                            <NavigationContainer
                                parent={this} columns={1}
                                className={`likeButton genericBtn`}
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
