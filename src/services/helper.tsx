import {
    Card,
    CardContainerTypeEnum,
    CardContainer,
    RelationModule,
    Duple,
    Single,
    DupleData
} from 'Services';

// tslint:disable-next-line:no-internal-module
// tslint:disable-next-line:no-namespace
class HelperClass {
    public getContainer = (card: Card, type: CardContainerTypeEnum): CardContainer | undefined => {
        return card.info
            ? card
                .info
                .filter((el: CardContainer) => el.type === type)[0]
            : undefined;
    }

    public getRelation = (relations: Array<RelationModule>, value: string, field: string = 'type'): RelationModule | null => {
        return relations
            ? relations.filter((el: RelationModule | any) => el[field] as any === value)[0]
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

    public getRelationCardsFromRelation = (relation: RelationModule): Card[] => {
        switch (relation.type) {
            case 'single':
                return ((relation as Single).data as Card[]);
            case 'duple':
                return ((relation as Duple).data.map((el: DupleData) => {
                    return el.from;
                }));
        }
        return [];
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
    public getRelationCards = (relations: Array<RelationModule>, value: string, field: string = 'type'): Card[] | null => {
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
}

export const Helper = new HelperClass();
