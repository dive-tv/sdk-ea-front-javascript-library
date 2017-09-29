import * as React from 'react';
import { navigable, INavigable } from 'HOC';
import { Text, Card, Helper, Localize, RelationModule, Duple, Single } from 'Services';
import { MiniCardButton, CardAndCategory } from 'Components';
import * as classNames from 'classnames';
import * as ReactDOM from "react-dom";
import { ICardRelation } from 'Reducers';

export interface IMiniCardState {
    element: ICardRelation;
    // relations: RelationModule[];
    groupName: string;
    selectedNav?: INavigable;
    selected?: number;
    idx?: number;
    forceFirst?: boolean;
    forceOrder?: number;
    navigation?: Map<number, INavigable>;
}

export interface IMiniCardMethods {
    clickActionMore: any;
    clickActionLike: any;
    setNodeById?: any;
    // setSelectedOnSceneChange?: any;
}

type MiniCardProps = IMiniCardState & IMiniCardMethods & { id: string };

export class MiniCardClass extends React.PureComponent<MiniCardProps, {}> {

    private element: HTMLLIElement;
    private openCard: Card;

    public render() {
        const isRelation: boolean = this.props.element.parentId != null;
        const classes = classNames({
            minicard: true,
            relation: isRelation,
        });

        return (
            <li id={this.props.id}>
                <div className={classes}>
                    {isRelation ? <div className="relationBar" /> : ''}
                    {this.miniCard()}
                    {this.expandedInfo()}
                </div >
            </li>
        );
    }

    public componentWillMount() {
        this.openCard = this.props.element;
    }

    private miniCard = (): JSX.Element => {
        return (
            <div className="cardLeft" onMouseOver={() => this.props.setNodeById(this.props.idx)}>
                <CardAndCategory card={this.props.element} />
            </div>);
    }

    private expandedInfo = (): JSX.Element => {
        const text: JSX.Element = this.expandedInfoText();

        return (
            <div className="expandedInfoContainer">
                <div className="expandedInfo">
                    <div className="expandedInfoInside">
                        <div className="text">{text}</div>
                        <div className="btn">{this.button('MORE')}</div>
                        <div className="btn">{this.button('SAVE')}</div>
                    </div>
                </div>
            </div>);
    }
    private expandedInfoText = (): JSX.Element => {
        let box: JSX.Element;
        let text: string = '';
        const textContainer: Text = Helper.getContainer(this.props.element, 'text') as Text;
        if (textContainer !== undefined && textContainer.data.length > 0) {
            text = textContainer.data[0].text;
        }

        switch (this.props.element.type) {
            case 'quote':
            case 'reference':
                box = <div className="text alone">{text}</div>;
                break;
            case 'character':
                const person: Card | null = Helper.getRelationCard(
                    this.props.element.relations,
                    'played_by',
                    'content_type',
                );
                if (person) {
                    let title = this.props.element.title;

                    // Cambios la ref de card que se debe abrir
                    this.openCard = person;
                    // Montamos el nombre con el nombre del personaje 'as' nombre del actor
                    if (person.title !== undefined) {
                        title = person.title + ' as ' + title;
                    }

                    // Cogemos la descripción del actor
                    const textPersonContainer: Text = Helper.getContainer(person, 'text') as Text;
                    if (textPersonContainer !== undefined && textPersonContainer.data.length > 0) {
                        text = textPersonContainer.data[0].text;
                    }
                    // TODO: coger relación actor/personaje para pintar el título.
                    box = <div className="text">
                        <div className="title">{title}</div>
                        <div className="desc">{text}</div>
                    </div>;
                    break;
                }
            case 'song':
                box = <div className="text"></div>;
                break;

            default:
                box = <div className="text">
                    <div className="title">{this.props.element.title}</div>
                    <div className="desc">{text}</div>
                </div>;

                break;
        }
        return box;
    }

    private button = (type: 'MORE' | 'SAVE'): JSX.Element => {
        const actionWhenMore = () => {
            this.props.clickActionMore(this.openCard);
        };
        const actionWhenLike = () => {
            this.props.clickActionLike(this.openCard);
        };
        return (<MiniCardButton
            clickAction={type === 'SAVE' ? actionWhenLike : actionWhenMore}
            parent={this}
            columns={1}
            groupName={this.props.groupName}
            type={type}
        />);
    }
}

export const MiniCard = navigable(MiniCardClass);
