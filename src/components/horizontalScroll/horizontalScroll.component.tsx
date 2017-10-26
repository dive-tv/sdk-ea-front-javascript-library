import * as React from 'react';
import * as classNames from 'classnames';

import { Card, CardContainerTypeEnum, Helper, SourceData as SourceDataVO, Localize } from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, NavigationContainer, DirectionButtonList } from "Components";
import { navigable } from "HOC";

export interface IHorizontalScrollProps {
    uniqueId: string;
    itemsShown: number;
}
export class HorizontalScrollClass extends React.PureComponent<IHorizontalScrollProps, {}> {

    private scrollBox: HTMLElement;
    private offset: number = 0;
    private btns: HTMLElement;

    public render(): JSX.Element {

        const elements: JSX.Element[] = this.renderElements();
        let showButtons: boolean = false;
        if (this.props.children instanceof Array) {
            showButtons = this.props.children.length > 2;
        }
        return (
            <div className="horizontalScroll">
                <div className="scrollBox" ref={(el) => { if (el) { this.scrollBox = el; } }}>
                    <NavigationContainer
                        parent={this}
                        propagateParent={true}
                        forceOrder={0}
                        key={Date.now()}
                        className="scrollBoxContent"
                    >
                        {elements}
                    </NavigationContainer>
                </div>
                {
                    showButtons ?
                        <div className="btns">
                            <DirectionButtonList
                                parent={this}
                                template="vertical"
                                forceOrder={1}
                                btns={[
                                    { direction: 'right', action: this.rightAction },
                                    { direction: 'left', action: this.leftAction },
                                ]}
                            />
                        </div>
                        : null
                }

            </div>
        );
    }

    public renderElements = (): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        if (this.props.children instanceof Array) {
            for (let i = this.offset; i < (this.props.itemsShown + this.offset) && (i < this.props.children.length); i++) {
                // elements.push(this.props.children[i] as JSX.Element);
                elements.push(
                    <NavigationContainer
                        key={Date.now() + i}
                        parent={this}
                        columns={2}
                        propagateParent={true}
                        className="horizontalElement listElement">
                        {this.props.children[i] as JSX.Element}
                    </NavigationContainer>);

            }
        }
        return elements;
    }

    public leftAction = () => {
        this.offset -= this.props.itemsShown;
        if (this.offset < 0) {
            this.offset = 0;
        }
        this.forceUpdate();
    }

    public rightAction = () => {
        this.offset += this.props.itemsShown;
        if (this.props.children instanceof Array && (this.offset + this.props.itemsShown >= this.props.children.length)) {
            this.offset = this.props.children.length - this.props.itemsShown;
        }
        this.forceUpdate();
    }
}

export const HorizontalScroll = navigable(HorizontalScrollClass);
