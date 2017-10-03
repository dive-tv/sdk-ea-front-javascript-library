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
        return (
            <div className="horizontalScroll">
                <div className="scrollBox" ref={(el) => { if (el) { this.scrollBox = el; } }}>
                    <NavigationContainer
                        parent={this}
                        propagateParent={true}
                        className="scrollBoxContent"
                    >
                        {this.showElements()}
                    </NavigationContainer>
                </div>

                <div className="btns">
                    <DirectionButtonList
                        parent={this}
                        template="vertical"
                        btns={[
                            { direction: 'right', action: this.rightAction },
                            { direction: 'left', action: this.leftAction },
                        ]}
                    />
                </div>

            </div>
        );
    }

    public showElements = () => {
        let elements: any = [];
        if (this.props.children instanceof Array) {
            for (let i = this.offset; i < (this.props.itemsShown + this.offset) && (i < this.props.children.length); i++) {
                elements.push(this.props.children[i]);
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
            this.offset = this.props.children.length - this.props.itemsShown ;
        }
        this.forceUpdate();
    }
}

export const HorizontalScroll = navigable(HorizontalScrollClass);
