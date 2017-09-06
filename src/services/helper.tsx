// tslint:disable-next-line:no-internal-module
// tslint:disable-next-line:no-namespace
class HelperClass {
    public getContainer = (card: any, type: any): any | undefined => {
        return card.info ?
            card.info.filter((el: any) => el.type === type)[0] : undefined;
    }

    public getRelation = (relations: any[], relType: string): any | undefined => {
        return relations ?
            relations.filter((el: any) => el.rel_type === relType)[0] : undefined;
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
