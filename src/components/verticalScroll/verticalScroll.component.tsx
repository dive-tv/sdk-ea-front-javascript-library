import * as React from 'react';
import * as classNames from 'classnames';

import { CardDetailResponse, CardContainerTypeEnum, Helper, SourceData as SourceDataVO, Localize } from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, DirectionButtonList } from "Components";
import { navigable } from "HOC";

export interface IVerticalScrollProps {
    source?: SourceDataVO | undefined;
}
export class VerticalScrollClass extends React.PureComponent<IVerticalScrollProps, {}> {

    private scrollBox: HTMLElement;

    public render(): any {
        const full: boolean = this.props.source !== undefined &&
            this.props.source.name !== undefined &&
            this.props.source.name !== '';
        const classes = classNames({
            full,
            scrollBox: true,
        });
        const source = this.props.source && this.props.source.name ?
            this.props.source.name : this.props.source && this.props.source.url ?
                this.props.source.url : null;
        return (
            <div className="verticalScroll">
                <div className="scrollBox" ref={(el) => { if (el) { this.scrollBox = el; } }}>
                    {this.props.children}
                </div>
                {source ?
                    <div className="source">
                        <label className="label">{Localize('SOURCE')}: </label>
                        <label className="text">{source}</label>
                    </div>
                    : null}

                <div className="btns">
                    <DirectionButtonList
                        parent={this}
                        template="horizontal"
                        btns={[
                            { direction: 'up', action: this.upAction },
                            { direction: 'down', action: this.downAction },
                        ]}
                    />
                </div>
            </div>
        );
    }

    public downAction = () => {
        this.scrollBox.scrollTop += this.scrollBox.offsetHeight;
    }

    public upAction = () => {
        this.scrollBox.scrollTop -= this.scrollBox.offsetHeight;
    }
}

export const VerticalScroll = navigable(VerticalScrollClass);
