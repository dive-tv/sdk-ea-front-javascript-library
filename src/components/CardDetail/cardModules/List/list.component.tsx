import * as React from 'react';

import {
    Card,
    Product,
    CardContainerTypeEnum,
    Localize,
    Helper,
    Image as ImageVO,
    ImageData as ImageDataVO,
    CardContainer
} from "Services";
import {ICardModuleProps} from "CardModules";
import {DirectionButton, HorizontalScroll, NavigationContainer} from "Components";
import {navigable, statics} from "HOC";

interface IListProps {
    itemsShown : number,
    container : IListContainerType,
    card : Card,
    moduleType : ListModuleType
}

/*interface ITempProduct {
    category : string,
    currency : string,
    image : string,
    is_exact : boolean,
    is_up_to_date : boolean,
    price : number,
    product_id : string,
    source : {
        disclaimer?: string,
        image: string,
        name: string,
        url: string,
    }

}*/

interface IListContainerType/*extends CardContainer*/
{
    content_type : string,
    data : Array < any >
};
type ListModuleType = 'Gallery' | 'Shop';

@statics({
    moduleName: "list",
    validate: (card : Card, moduleType : string, parent : any, props : any) => {
        const container : ImageVO | IListContainerType | undefined = List.getContainer(card, moduleType);

        if (container !== undefined && container.data !== undefined && container.data.length > 0) {
            const Instantiated = navigable(List);

            return (<Instantiated
                itemsShown={2}
                container={container}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType as ListModuleType}/>);
        }
        return null;
    }
})
export class List extends React.PureComponent < ICardModuleProps & IListProps, {} > {
    public static moduleName = "";

    public static getContainer(card : Card, moduleType : string): ImageVO | IListContainerType | undefined {
        switch(moduleType as ListModuleType) {
            case 'Gallery':
                return Helper.getContainer(card, 'image')as ImageVO;
            case 'Shop':
                console.log("Shop card: ", card);
                const obj = {
                    content_type: 'products',
                    data: card.products,
                    type: 'listing'
                };
                return (obj)as IListContainerType;

            default:
                return undefined;
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
                            uniqueId={this.props.container !.content_type}
                            itemsShown={this.props.itemsShown}>
                            {this.getList()}
                        </HorizontalScroll>
                    </div>
                </div>
            </div>
        );
    }

    private getList = (): JSX.Element[] | null => {
        const type : ListModuleType = this.props.moduleType;

        switch (type) {
            case 'Gallery':
                return this.getGalleryList();
            case 'Shop':
                return this.getShopList();
        }
    }

    private getGalleryList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el : ImageDataVO, i : number) => (
                    <NavigationContainer
                        key={this.props.container !.content_type + '_show_' + i}
                        parent={this}
                        forceOrder={i % this.props.itemsShown}
                        columns={2}
                        className="horizontalElement listElement focusable">
                        <img src={el.thumb}/>
                    </NavigationContainer>
                ));
            return elements;
        }
        return null;
    }

    private getShopList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el : Product, i : number) => (
                    <NavigationContainer
                        key={this.props.container !.content_type + '_show_' + i}
                        parent={this}
                        forceOrder={i % this.props.itemsShown}
                        columns={2}
                        className="horizontalElement listElement">
                        <div className="image focusable"><img src={el.image}/></div>
                        <div className="title focusable">{el.price}</div>
                    </NavigationContainer>
                ));
            return elements;
        }
        return null;
    }

    private getTitle = () => {
        switch (this.props.container !.content_type) {
            case 'gallery':
                return Localize('GALLERY');
            default:
                return null;
        }
    }
}
