import * as React from 'react';

import {
    Card, CardContainerTypeEnum, Helper,
    Listing as ListingVO, ListingData as ListingDataVO, Localize, ListingData,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, VerticalScroll } from "Components";
import { navigable, statics } from "HOC";

interface ITableProps {
    container: ListingVO;
}
@statics({
    moduleName: "table",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
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
        return null;
    },
})
export class Table extends React.PureComponent<ICardModuleProps & ITableProps, {}> {
    public render(): any {
        return (
            <div className="cardModuleTable cardModule">
                <div className="container">
                    <VerticalScroll parent={this}>
                        <div className="cardTitle customTitle">{this.getTitle()}</div>
                        <div className="table">
                            <table>
                                <tbody>
                                    {this.props.container!.data.map((listItem: ListingData, idx: number) => {
                                        return (
                                            <tr key={idx}>
                                                <td className="customTitle">{listItem.text}</td>
                                                <td className="customTxt" >{listItem.value}</td>
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
