import {
  Card,
  CardContainerTypeEnum,
  CardContainer,
  RelationModule,
  Duple,
  Single,
  DupleData,
  CardTypeEnum,
  SingleContentTypeEnum,
  DupleContentTypeEnum
} from 'Services';

export interface ApiRelationModule extends RelationModule {
  content_type: SingleContentTypeEnum | DupleContentTypeEnum;
}

// tslint:disable-next-line:no-internal-module
// tslint:disable-next-line:no-namespace
export class HelperClass {
  public getContainer = (card: Card, type: CardContainerTypeEnum): CardContainer | undefined => {
    return card.info
      ? card
        .info
        .filter((el: CardContainer) => el.type === type)[0]
      : undefined;
  }

  public getRelation = (relations: Array<RelationModule>, value: string | null, field: string = 'type'): RelationModule | null => {
    return relations
      ? relations.filter((el: RelationModule | any) => value === null || el[field] as any === value)[0]
      : undefined;
  }

  /**
   * Devuelve la card del tipo de relación seleccionada pasándole la relación concreta.
   */
  public getRelationCardFromRelation = (relation: Single | Duple): Card | null => {
    if (relation && relation.data && relation.data.length > 0) {
      const el = relation.data[0];
      if ((relation.data[0] as DupleData).from !== undefined) {
        return (relation.data[0] as DupleData).from;
      } else {
        return (relation.data[0] as Card);
      }
    }
    return null;
  }

  public getRelationCardsFromRelation = (relation: RelationModule, getTo?: boolean): Card[] => {
    switch (relation.type) {
      case 'single':
        return ((relation as Single).data as Card[]);
      case 'duple':
        return ((relation as Duple).data.map((el: DupleData) => {
          if (getTo === true) {
            return el.to;
          }
          return el.from;
        }));
    }
    return [];
  }


  public getRelationCardsFromRelationCarousel = (parentType: CardTypeEnum, relation: ApiRelationModule): Card[] | null => {
    switch (parentType) {
      case "character":
      case "person":
        switch (relation.content_type) {
          case 'wears':
            return this.getRelationCardsFromRelation(relation);
        }
        break;
      case "home":
        switch (relation.content_type) {
          case 'home_deco':
            return this.getRelationCardsFromRelation(relation);
        }
        break;
      case "location":
        switch (relation.content_type) {
          case 'featured_in':
            return this.getRelationCardsFromRelation(relation, true);
        }
        break;
    }
    return null;
  }

  /**
   * Devuelve la card del tipo de relación seleccionada pasándole el array de relaciones.
   */
  public getRelationCard = (relations: Array<RelationModule>, value: string, field: string = 'type'): Card | null => {
    const relation: Single | Duple | null = Helper.getRelation(relations, value, field) as Single | Duple | null;
    if (relation != null) {
      return Helper.getRelationCardFromRelation(relation);
    }
  }

  /**
* Devuelve la card del tipo de relación seleccionada pasándole el array de relaciones.
*/
  public getRelationCards = (relations: Array<RelationModule>, value: string | null = null, field: string = 'type'): Card[] | null => {
    const relation: Single | Duple | null = Helper.getRelation(relations, value, field) as Single | Duple | null;
    if (relation != null) {
      return Helper.getRelationCardsFromRelation(relation);
    }
  }

  public cutText = (text: string, count: number): string => {
    if (text.length > count) {
      if (count + 3 >= text.length) {
        count -= 2;
      }
      return text.substring(0, count) + '...';
    } else {
      return text;
    }
  }

  public triggerEvent = (name: string) => {
    const event = new Event(name);
    dispatchEvent(event);
  }
}

export const Helper = new HelperClass();
