import * as React from 'react';

import {
    Card,
    Product,
    CardContainerTypeEnum,
    Localize,
    Helper,
    Image as ImageVO,
    ImageData as ImageDataVO,
    Seasons as SeasonsVO,
    SeasonsData as SeasonsDataVO,
    CardContainer,
    RelationModule,
    Single,
    Duple,
    DupleData
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, HorizontalScroll, NavigationContainer } from "Components";
import { navigable, statics } from "HOC";

interface IListProps {
    itemsShown: number,
    container: IListContainerType,
    card: Card,
    moduleType: ListModuleType
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

interface IListContainerType/*extends CardContainer*/ {
    content_type: string,
    data: Array<any>
};
type ListModuleType = 'Gallery' | 'Shop' | 'Filmography' | 'Vehicles' | 'Seasons' | 'AppearsIn' | 'Fashion' | 'Home' | 'Recommended' | 'Cast' | 'AppearsInLocation';

@statics({
    moduleName: "list",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
        const container: ImageVO | SeasonsVO | IListContainerType | Single | Duple | undefined = List.getContainer(card, moduleType);

        if (container !== undefined && container.data !== undefined && container.data.length > 0) {
            const Instantiated = navigable(List);
            return (<Instantiated
                itemsShown={2}
                container={container}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType as ListModuleType} />);
        }
        return null;
    }
})
export class List extends React.PureComponent<ICardModuleProps & IListProps, {}> {
    public static moduleName = "";

    public static getContainer(card: Card, moduleType: string): ImageVO | IListContainerType | Single | Duple | undefined {
        console.log("Filmography card: ", card);
        switch (moduleType as ListModuleType) {
            case 'Gallery':
                return Helper.getContainer(card, 'image') as ImageVO;
            case 'Shop':
                // console.log("Shop card: ", card);
                const obj = {
                    content_type: 'products',
                    data: card.products,
                    type: 'listing'
                };
                return obj as IListContainerType;

            case 'Filmography':
                return Helper.getRelation(card.relations, 'filmography', 'content_type') as Duple;
            case 'Cast':
                return Helper.getRelation(card.relations, 'casting', 'content_type') as Duple;
            case 'Seasons':
                return Helper.getContainer(card, 'seasons') as SeasonsVO;
            case 'AppearsInLocation':
                return Helper.getRelation(card.relations, 'filmed_in', 'content_type') as Single;
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
        const type: ListModuleType = this.props.moduleType;

        switch (type) {
            case 'Gallery':
                return this.getGalleryList();
            case 'Shop':
                return this.getShopList();
            case 'Filmography':
                return this.getFilmographyList();
            case 'Cast':
                return this.getCastList();
            /*case 'Directors':*/
            case 'AppearsInLocation':
                return this.getRelSingleList();
            case 'Seasons':
                return this.getSeasonList();
        }
    }

    private getGalleryList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el: ImageDataVO, i: number) => (
                    <NavigationContainer
                        key={this.props.container!.content_type + '_show_' + i}
                        parent={this}
                        forceOrder={i % this.props.itemsShown}
                        columns={2}
                        className="horizontalElement listElement focusable">
                        <img src={el.thumb} />
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
                .map((el: Product, i: number) => this.getGenericElement(el.price.toString() + el.currency, el.image, i));
            return elements;
        }
        return null;
    }

    private getFilmographyList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el: DupleData, i: number) => this.getGenericElement(el.from.title, el.from.image ? el.from.image.thumb : null, i));
            return elements;
        }
        return null;
    }

    private getCastList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .filter((el: DupleData) => el.rel_type == 'plays' && el.from.image !== null)
                .map((el: DupleData, i: number) => this.getGenericElement(el.from.title, el.from.image.thumb, i));
            return elements;
        }
        return null;
    }

    private getRelSingleList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el: Card, i: number) => this.getGenericElement(el.title, el.image.thumb, i));
            return elements;
        }
        return null;
    }
    private getSeasonList = (): JSX.Element[] | null => {
        if (this.props.container) {
            const elements = this
                .props
                .container
                .data
                .map((el: SeasonsDataVO, i: number) => this.getGenericElement('Season ' + el.season_index, el.image.thumb, i));
            return elements;
        }
        return null;
    }


    private getGenericElement = (title: string, image: string, order: number): JSX.Element =>
        <NavigationContainer
            key={this.props.container!.content_type + '_show_' + order}
            parent={this}
            forceOrder={order % this.props.itemsShown}
            columns={2}
            className="horizontalElement listElement">
            <div className="image focusable"><img src={image} /></div>
            <div className="title focusable">{title}</div>
        </NavigationContainer>


    private getTitle = () => {
        switch (this.props.container!.content_type) {
            case 'gallery':
                return Localize('GALLERY');
            default:
                return null;
        }
    }
}
