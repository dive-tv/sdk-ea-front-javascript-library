import * as React from 'react';

import {
    Card, CardContainerTypeEnum, Helper,
    Awards as AwardsContainer, AwardsData, ListingData,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, VerticalScroll } from "Components";
import { navigable } from "HOC";

declare const Localize: any;

interface IAwardsProps {
    container: AwardsContainer;
}

export class Awards extends React.PureComponent<ICardModuleProps & IAwardsProps, {}> {
    public static moduleName = "awards";
    public static validate(card: Card, moduleType: string, parent: any) {
        const container = Helper.getContainer(card, 'awards') as AwardsContainer;
        // MOCKUP
        // container!.data = [
        //     {
        //         title: "Mejor actor",
        //         winner: [{}, {}, {}],
        //         nominee: [{}],
        //     },
        //     {
        //         title: "Mejor actor",
        //         winner: [{}, {}, {}],
        //         nominee: [{}],
        //     },
        //     {
        //         title: "Mejor actor",
        //         winner: [{}, {}, {}],
        //         nominee: [{}],
        //     },
        // ] as any;
        if (container && container.data && container.data.length > 0) {
            const Instantiated = navigable(Awards);
            return (<Instantiated
                container={container}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType} />
            );
        }
    }

    private container: AwardsContainer | undefined;
    private scrollBox: HTMLElement;

    public render(): any {
        return (
            <div className="cardModuleAwards cardModule">
                <div className="container">
                    <VerticalScroll parent={this}>
                        <div className="cardTitle">{this.getTitle()}</div>
                        <div className="awards">
                            <table>
                                <tbody>
                                    {this.props.container!.data.map((listItem: AwardsData, idx: number) => {
                                        const winnerNum =
                                            listItem.winner instanceof Array && listItem.winner.length > 0 ?
                                                listItem.winner.length : 0;
                                        const nomineeNum =
                                            listItem.nominee instanceof Array && listItem.nominee.length > 0 ?
                                                listItem.nominee.length : 0;
                                        const nomineeTexts = nomineeNum > 0 ?
                                            // tslint:disable-next-line:max-line-length
                                            `${nomineeNum} ${nomineeNum > 1 ? Localize("NOMINEE_PLURAL") : Localize("NOMINEE_SINGULAR")}` : "";
                                        const totalAwardsTexts = winnerNum > 0 ?
                                            // tslint:disable-next-line:max-line-length
                                            `${winnerNum} ${winnerNum > 1 ? Localize("WINNER_PLURAL") : Localize("WINNER_SINGULAR")}${nomineeNum > 0 ? ` / ${nomineeTexts}` : ""}` : nomineeTexts;
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <table>
                                                        <tbody>
                                                            <tr key="name" className="awardName">
                                                                <td>{listItem.title}</td>
                                                            </tr>
                                                            <tr key="num" className="awardNums">
                                                                <td>{totalAwardsTexts}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>);
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </VerticalScroll>
                </div>
            </div>
        );
    }

    private getTitle = () => {
        return Localize('AWARDS');
    }
}
