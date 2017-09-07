import { Card, CardContainerTypeEnum, CardContainer, RelationModule } from 'Services';

// tslint:disable-next-line:no-internal-module
// tslint:disable-next-line:no-namespace
class HelperClass {
    public getContainer = (card: Card, type: CardContainerTypeEnum): CardContainer | undefined => {
        return card.info ?
            card.info.filter((el: CardContainer) => el.type === type)[0] : undefined;
    }

    public getRelation = (relations: RelationModule[], relType: string): RelationModule | undefined => {
        return relations ?
            relations.filter((el: RelationModule) => el.type === relType)[0] : undefined;
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
