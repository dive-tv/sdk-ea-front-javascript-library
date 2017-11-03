import * as React from "react";
import { connect } from "react-redux";

import { Card } from "Services";
import { navigable, statics } from "HOC";
import { IBanner } from "Reducers";
import { ICardModuleProps } from "CardModules";
import { NavigableBanner } from "Components";
import { ICardWithBanner } from 'Actions';

@statics({
    moduleName: "banner",
    validate: (card: Card, moduleType: string, parent: any, props: ICardModuleProps) => {
        const bannerCard: ICardWithBanner = card as ICardWithBanner;

        if (
            // tslint:disable-next-line:max-line-length
            (moduleType === "BannerLarge" && bannerCard && bannerCard.banner && bannerCard.banner.banner_size === "large") ||
            // tslint:disable-next-line:max-line-length
            (moduleType === "BannerSmall" && bannerCard && bannerCard.banner && bannerCard.banner.banner_size === "small")
        ) {
            const Instantiated = navigable(BannerCM as any) as any;

            return (<Instantiated
                parent={parent}
                isScrollable={true}
                card={bannerCard}
                moduleType={moduleType}
                {...props}
            />);
        }
    },
})
export class BannerCM extends React.PureComponent<ICardModuleProps, {}> {
    public render(): JSX.Element {
        return <NavigableBanner
            data={(this.props.card as ICardWithBanner).banner}
            parent={this}
            clickAction={() => {
                window.open((this.props.card as ICardWithBanner).banner.link_url, '_blank');
            }}
        />;
    }
}
