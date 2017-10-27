import * as React from 'react';

import { ICardModuleProps } from "CardModules";
import { navigable, statics } from "HOC";
import { Helper, Localize, Card } from "Services";
import { VerticalScroll } from "Components";

interface ITextProps {
    container: any;
    textData: any;
}
@statics({
    moduleName: "text",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
        // No se puede guardar el container aquí, porque es un método estático.
        const container: any | undefined = Helper.getContainer(card, 'text') as any;
        if (container !== undefined &&
            container.data !== undefined &&
            container.data.length > 0 && container.data[0].text) {
            const Instantiated = navigable(Text);
            return (<Instantiated
                container={container}
                textData={container.data[0]}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType}
                {...props} />
            );
        }
        return null;
    },
})
export class Text extends React.PureComponent<ICardModuleProps & ITextProps, {}> {
    public render(): any {
        const textTitle = this.getTitle();
        return (
            <div className="cardModuleText cardModule">
                <div className="container">
                    <VerticalScroll source={this.props.textData ? this.props.textData.source : undefined} parent={this}>
                        {textTitle ? <div className="cardTitle customTitle">{textTitle}</div> : null}
                        <div className="cardText customTxt">{this.props.textData.text}</div>
                    </VerticalScroll>
                </div>
            </div>
        );
    }

    private getTitle() {
        if (this.props.container === undefined) {
            return '';
        }
        switch (this.props.container!.content_type) {
            case 'biography':
                return Localize('BIOGRAPHY');
            case 'overview':
                return Localize('OVERVIEW');
            case 'curiosity':
            case 'reference':
                return Localize('CURIOSITY_TITLE');
            case 'quote':
            case 'reference':
            case 'description':
            default:
                return null;
        }
    }
}
