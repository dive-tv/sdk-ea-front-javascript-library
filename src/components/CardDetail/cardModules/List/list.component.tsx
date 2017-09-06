import * as React from 'react';

import {
    Card, CardContainerTypeEnum, Helper, Image as ImageVO,
    ImageData as ImageDataVO, CardContainer,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, HorizontalScroll, NavigationContainer } from "Components";
import { navigable } from "HOC";

interface IListProps {
    itemsShown: number;
    container: CardContainer & { content_type: string, data: any[] };
}

export class List extends React.PureComponent<ICardModuleProps & IListProps, {}> {
    public static moduleName = "list";
    public static validate(card: Card, moduleType: string, parent: any) {
        let container: ImageVO | undefined;
        switch (moduleType) {
            case 'Gallery':
                container = Helper.getContainer(card, 'image') as ImageVO;
                break;
        }

        if (container !== undefined &&
            container.data !== undefined &&
            container.data.length > 0) {
            const Instantiated = navigable(List);

            return (<Instantiated
                itemsShown={2}
                container={container}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType}
            />);
        }
    }

    public render(): any {
        const textTitle = this.getTitle();
        return (
            <div className="cardModuleList cardModule">
                <div className="container">
                    <div className="cardTitle">{textTitle}</div>
                    <div className="listContent">
                        <HorizontalScroll
                            parent={this}
                            uniqueId={this.props.container!.content_type}
                            itemsShown={this.props.itemsShown}>
                            {this.getList()}
                        </HorizontalScroll>
                    </div>
                </div>
            </div>
        );
    }

    private getList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this.props.container.data.map((el: ImageDataVO, i: number) => (
                <NavigationContainer
                    key={this.props.container!.content_type + '_show_' + i}
                    parent={this}
                    forceOrder={i % this.props.itemsShown}
                    columns={2}
                    className="horizontalElement listElement"
                >
                    <img src={el.thumb} />
                </NavigationContainer>
            ));
            return elements;
        }
        return null;
    }

    private getTitle = () => {
        switch (this.props.container!.content_type) {
            case 'gallery':
                return Localize('GALLERY');
            default:
                return null;
        }
    }
}
