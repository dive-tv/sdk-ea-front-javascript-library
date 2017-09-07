import * as React from 'react';

import { ICardModuleProps } from "CardModules";
import { navigable } from "HOC";
import { Helper } from "Services";
import { VerticalScroll } from "Components";

interface ITextProps {
    container: any;
    textData: any;
}

export class Text extends React.PureComponent<ICardModuleProps & ITextProps, {}> {
    public static moduleName = "text";
    public static validate(card: any, moduleType: string, parent: any) {
        // No se puede guardar el container aquí, porque es un método estático.
        const container: any | undefined = Helper.getContainer(card, 'text') as any;
        if (container !== undefined &&
            container.data !== undefined &&
            container.data.length > 0) {
            const Instantiated = navigable(Text);
            return (<Instantiated
                container={container}
                textData={container.data[0]}
                parent={parent}
                isScrollable={true}
                card={card}
                moduleType={moduleType} />
            );
        }
    }

    public render(): any {
        const textTitle = this.getTitle();
        return (
            <div className="cardModuleText cardModule">
                <div className="container">
                    <VerticalScroll source={this.props.textData ? this.props.textData.source : undefined} parent={this}>
                        {textTitle ? <div className="cardTitle">{textTitle}</div> : null}
                        <div className="cardText">{this.props.textData.text}</div>
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
                return 'BIOGRAPHY';
            case 'overview':
                return 'SYNOPSIS';
            case 'quote':
            case 'reference':
            case 'curiosity':
            case 'description':
            default:
                return null;
        }
    }
}
