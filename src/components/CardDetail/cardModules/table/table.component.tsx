import * as React from 'react';

import {
    CardDetailResponse, CardContainerTypeEnum, Helper,
    Listing as ListingVO, ListingData as ListingDataVO, Localize, ListingData,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, VerticalScroll } from "Components";
import { navigable } from "HOC";

interface ITableProps {
    container: ListingVO;
}

export class Table extends React.PureComponent<ICardModuleProps & ITableProps, {}> {
    public static moduleName = "table";
    public static validate(card: CardDetailResponse, moduleType: string, parent: any) {
        // No se puede guardar el container aquí, porque es un método estático.
        const container = Helper.getContainer(card, 'listing') as ListingVO;
        if (container && container.data && container.data.length > 0) {
            const Instantiated = navigable(Table);
            return (<Instantiated
                container={container}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType} />
            );
        }
    }

    public render(): any {
        return (
            <div className="cardModuleTable cardModule">
                <div className="container">
                    <VerticalScroll parent={this}>
                        <div className="cardTitle">{this.getTitle()}</div>
                        <div className="table">
                            <table>
                                <tbody>
                                    {this.props.container!.data.map((listItem: ListingData, idx: number) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{listItem.text}</td>
                                                <td>{listItem.value}</td>
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
        switch (this.props.container!.content_type) {
            case 'specs':
                return Localize('SPECS');
            case 'basic_data':
            default:
                return Localize('BASIC_DATA');
        }
    }

}
