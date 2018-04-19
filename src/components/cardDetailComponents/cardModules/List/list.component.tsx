import * as React from 'react';
import { connect } from 'react-redux';

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
  DupleData,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, HorizontalScroll, NavigationContainer, CardAndCategory } from "Components";
import { navigable, statics } from "HOC";
import { UIActions, IUIActions } from 'Actions';
import { bindActionCreators } from 'redux';

export interface IListProps {
  itemsShown: number;
  container: IListContainerType;
  card: Card;
  moduleType: ListModuleType;
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

export interface IListContainerType/*extends CardContainer*/ {
  content_type: string;
  data: any[];
}
export type ListModuleType = 'Gallery' | 'Shop' | 'TravelShop' | 'Filmography' | 'Vehicles' | 'Seasons' |
  'AppearsIn' | 'Fashion' | 'Home' | 'Recommended' | 'Cast' | 'AppearsInLocation' | 'CompleteTheDeco' |
  'SongBelongTo' | 'Soundtrack';

@statics({
  moduleName: "list",
  validate: (card: Card, moduleType: string, parent: any, props: any) => {
    const container: ImageVO | SeasonsVO | IListContainerType |
      Single | Duple | undefined = List.getContainer(card, moduleType);

    if (container !== undefined && container.data !== undefined && container.data.length > 0) {
      const Instantiated = navigable(connect(undefined, List.mapDispatchToProps)(List as any)) as any;
      return (<Instantiated
        itemsShown={2}
        container={container}
        parent={parent}
        isScrollable={true}
        card={card}
        moduleType={moduleType as ListModuleType} />);
    }
    return null;
  },
})
export class List extends React.PureComponent<ICardModuleProps & IListProps & IUIActions, {}> {
  public static mapDispatchToProps(dispatch: any) {
    return {
      // userActions: bindActionCreators(UserActions, dispatch),
      uiActions: bindActionCreators(UIActions, dispatch),
    };
  }

  public static getContainer(card: Card, moduleType: string):
    ImageVO | IListContainerType | Single | Duple | undefined {
    console.log("Filmography card: ", card);
    switch (moduleType as ListModuleType) {
      case 'Gallery':
        return Helper.getContainer(card, 'image') as ImageVO;
      case 'Shop':
        const objShop = {
          content_type: 'products',
          data: card.products.filter((product) => product.category !== "travel"),
          type: 'listing',
        };
        return objShop as IListContainerType;
      case 'TravelShop':
        const objTravelShop = {
          content_type: 'products',
          data: card.products.filter((product) => product.category === "travel"),
          type: 'listing',
        };
        return objTravelShop as IListContainerType;
      case 'Filmography':
        return Helper.getRelation(card.relations, 'filmography', 'content_type') as Duple;
      case 'Cast':
        return Helper.getRelation(card.relations, 'casting', 'content_type') as Duple;
      case 'Seasons':
        return Helper.getContainer(card, 'seasons') as SeasonsVO;
      case 'AppearsInLocation':
        return Helper.getRelation(card.relations, 'filmed_in', 'content_type') as Single;
      case 'CompleteTheDeco':
        return Helper.getRelation(card.relations, 'home_deco', 'content_type') as Single;
      case 'SongBelongTo':
        return Helper.getRelation(card.relations, 'is_part_of', 'content_type') as Single;
      case 'Soundtrack':
        return Helper.getRelation(card.relations, 'tracklist', 'content_type') as Single;
      default:
        return undefined;
    }
  }

  public render(): JSX.Element {
    const textTitle = this.getTitle();
    return (
      <div className={`cardModuleList cardModule ${this.props.moduleType}`}>
        <div className="container">
          <div className="cardTitle customTitle">{textTitle}</div>
          <div className="listContent">
            <HorizontalScroll
              parent={this}
              key={Date.now()}
              uniqueId={this.props.container!.content_type}
              itemsShown={this.props.itemsShown}>
              {this.getList()}
            </HorizontalScroll>
          </div>
        </div>
      </div>
    );
  }

  private getList(): JSX.Element[] | null {
    const type: ListModuleType = this.props.moduleType;

    switch (type) {
      case 'Gallery':
        return this.getGalleryList();
      case 'Shop':
      case 'TravelShop':
        return this.getShopList();
      case 'Filmography':
        return this.getFilmographyList();
      case 'Cast':
        return this.getCastList();
      /*case 'Directors':*/
      case 'AppearsInLocation':
      case 'CompleteTheDeco':
      case 'SongBelongTo':
      case 'Soundtrack':
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
            key={this.props.moduleType + '_show_' + i}
            parent={this}
            // forceOrder={i % this.props.itemsShown}
            // columns={2}
            className="horizontalElement listElement focusable customToggleSelected">
            <img src={el.thumb} />
          </NavigationContainer>
          // <div className="fillParent horizontalElement listElement focusable"><img src={el.thumb} /></div>
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
        .map((el: Product, i: number) => {
          return (
            this.getGenericElement({
              title: el.price ? el.price.toString() + ' ' + el.currency : '',
              image: el.image,
              order: i,
              onClick: () => {
                window.open(el.url, '_blank');
              }
            })
          );
        });
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
        .map((el: DupleData, i: number) => {
          return this.getGenericElement(
            {
              title: el.from.title,
              image: el.from.image ? el.from.image.thumb : null,
              order: i,
              onClick: el.from ? () => {
                return (this.props.uiActions as any).openCard(el.from, "offmovie");
              } : null,
            },
          );
        });
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
        // tslint:disable-next-line:max-line-length
        .filter((el: DupleData) => el.rel_type === 'plays' || el.rel_type === 'starred_by')// && el.from.image !== null)
        .map((el: DupleData, i: number) => {
          return this.getGenericElement(
            {
              title: el.from.title,
              image: el.from.image ? el.from.image.thumb : null,
              order: i,
              onClick: el.from ? () => {
                return (this.props.uiActions as any).openCard(el.from, "offmovie");
              } : null
            },
          );
        });
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
        .map((el: Card, i: number) => {
          return this.getCardElement(
            el,
            {
              title: el.title,
              order: i,
              onClick: el.card_id ? () => {
                return (this.props.uiActions as any).openCard(el, "offmovie");
              } : null,
            },
          );
        });
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
        .map((el: SeasonsDataVO, i: number) => {
          return this.getGenericElement(
            { title: 'Season ' + el.season_index, image: el.image ? el.image.thumb : null, order: i },
          );
        });
      return elements;
    }
    return null;
  }

  private getGenericElement(params:
    { title: string, image: string, order: number, onClick?: () => void },
  ): JSX.Element {
    const { title, image, order, onClick } = params;

    const element: JSX.Element = <NavigationContainer
      key={this.props.moduleType + '_show_' + order}
      clickAction={onClick}
      parent={this}
      //  forceOrder={order % this.props.itemsShown}
      // columns={2}
      className="horizontalElement listElement noBorder">
      <div className="image focusable parentSelected customToggleSelected">{image ? <img src={image} /> : null}</div>
      <div className="title focusable parentSelected customTitle customToggleSelected">{title}</div>
    </NavigationContainer>;
    return element;
    /* if (params.link) {
         return (<a href={params.link} target={"_blank"} className="fillParent product">
             {element}
         </a>);
     } else {
         return element;
     }*/
  }

  private getCardElement(card: Card, params: { title: string, order: number, onClick?: () => void }): JSX.Element {
    const { title, order, onClick } = params;
    return (
      <NavigationContainer
        key={this.props.container!.content_type + '_show_' + order}
        clickAction={onClick}
        parent={this}
        // forceOrder={order % this.props.itemsShown}
        // columns={2}
        className="horizontalElement listElement">
        <CardAndCategory card={card} title={title} />
      </NavigationContainer>
      // <div className="fillParent horizontalElement listElement"> <CardAndCategory card={card} title={title} /></div>
    );
  }

  private getTitle() {
    const type: ListModuleType = this.props.moduleType;
    switch (type) {
      case 'Gallery':
        return Localize('GALLERY');
      case 'SongBelongTo':
        return Localize("CAROUSEL_ALIAS_OST"); //`TITLE_${type}`);
      case 'Soundtrack':
        return Localize(`TITLE_${type.toLocaleUpperCase()}`);
      case 'Filmography':
        return Localize("FILMOGRAPHY");
      default:
        return null;
    }
  }
}
