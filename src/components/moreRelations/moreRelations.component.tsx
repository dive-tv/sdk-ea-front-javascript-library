import * as React from 'react';
import { navigable, INavigable } from 'HOC';
import { Text, Card, Helper, Localize, RelationModule, Duple, Single } from 'Services';
import { MiniCardButton, CardAndCategory } from 'Components';
import * as classNames from 'classnames';
import * as ReactDOM from "react-dom";

export interface IMoreRelationsState {
    selectedNav?: INavigable;
    selected?: number;
    idx?: number;
    forceFirst?: boolean;
    forceOrder?: number;
    navigation?: Map<number, INavigable>;
}


type MoreRelationsProps = IMoreRelationsState;

export class MoreRelationsClass extends React.PureComponent<MoreRelationsProps, {}> {

    private element: HTMLLIElement;

    public render() {
        return (this.moreRelation());
    }

    private moreRelation = (): JSX.Element => {
        return (
            <div className="minicard relation">
                <div className="relationBar"/>
                <div className="cardLeft">
                    <div className="cardAndCategory">
                        <div className={`image`}>
                            <div className={`icon`} />
                        </div>
                        <div className="category">Explore More</div>
                    </div>
                </div>
            </div>
        );
    }
}

export const MoreRelations = navigable(MoreRelationsClass);
