import {
    Card,
    CardContainerTypeEnum,
    CardContainer,
    RelationModule,
    Duple,
    Single
} from 'Services';

// tslint:disable-next-line:no-internal-module
// tslint:disable-next-line:no-namespace
class HelperClass {
    public getContainer = (card : Card, type : CardContainerTypeEnum) : CardContainer | undefined => {
        return card.info
            ? card
                .info
                .filter((el : CardContainer) => el.type === type)[0]
            : undefined;
    }

    public getRelation = (relations : Array < RelationModule >, value : string, field : string = 'type') : RelationModule | undefined => {
        return relations
            ? relations.filter((el : RelationModule | any) => el[field] as any === value)[0]
            : undefined;
    }

    public cutText = (text : string, count : number) : string => {
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
