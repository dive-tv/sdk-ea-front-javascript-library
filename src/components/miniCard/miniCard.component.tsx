import * as React from 'react';
import { navigable, INavigable, INavigableProps } from 'HOC';
import { Text, Card, Helper, Localize, RelationModule, Duple, Single } from 'Services';
import { MiniCardButton, CardAndCategory, DIVE_CONFIG } from 'Components';
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

export type MiniCardProps = IMiniCardState & IMiniCardMethods & { id: string };

export class MiniCardClass extends React.PureComponent<MiniCardProps, {}> {

  private element: HTMLLIElement;
  private openCard: Card;

  private isHBBTV: boolean = false;


  public render() {
    const isRelation: boolean = this.props.element.parentId != null;
    const classes = classNames({
      minicard: true,
      relation: isRelation,
    });

    return (
      <li id={this.props.id}>
        <div className={classes}>
          {isRelation ? <div className="relationBar groupSelectedBkg" /> : ''}
          {this.miniCard()}
          {this.expandedInfo()}
        </div >
      </li>
    );
  }

  public componentWillMount() {
    this.isHBBTV = DIVE_CONFIG.platform === 'HBBTV';
    this.openCard = this.props.element;
  }

  private miniCard = (): JSX.Element => {
    const card = this.props.element;
    return (
      <div className="cardLeft" onMouseOver={() => this.onMouseOver()} onClick={() => this.onClick()}>
        <CardAndCategory card={card} />
      </div>);
  }

  private onMouseOver() {
    if (this.isHBBTV) {
      this.props.setNodeById(this.props.idx);
    }
  }

  private onClick() {
    if (!this.isHBBTV) {
      this.props.setNodeById(this.props.idx);
    }
  }

  private expandedInfo = (): JSX.Element => {
    const text: JSX.Element = this.expandedInfoText();

    return (
      <div className="expandedInfoContainer">
        <div className="expandedInfo parentSelected">
          <div className="expandedInfoInside">
            <div className="text">{text}</div>
            <div className="btn">{this.button('MORE')}</div>
            {/*<div className="btn">{this.button('SAVE')}</div>*/}
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
    let title = this.props.element.title;
    switch (this.props.element.type) {
      case 'quote':
      case 'reference':
        box = <div className="text alone customTxt">{title}</div >;
        break;
      case 'character':
        const person: Card | null = Helper.getRelationCard(
          this.props.element.relations,
          'played_by',
          'content_type',
        );
        if (person) {

          // Cambios la ref de card que se debe abrir
          this.openCard = person;
          // Montamos el nombre con el nombre del personaje 'as' nombre del actor
          if (person.title !== undefined) {
            title = person.title + ' as ' + title;
          }

          // Fallback image
          // TODO: Check if it has to be on the SDK
          if (!this.props.element.image || !this.props.element.image.thumb) {
            if (person.image && person.image.thumb) {
              this.props.element.image = person.image;
            }
          }

          // Cogemos la descripción del actor
          const textPersonContainer: Text = Helper.getContainer(person, 'text') as Text;
          if (textPersonContainer !== undefined && textPersonContainer.data.length > 0) {
            text = textPersonContainer.data[0].text;
          }
          // TODO: coger relación actor/personaje para pintar el título.
          box = <div className="text">
            <div className="title customTitle" >{title}</div>
            <div className="desc customTxt">{text}</div>
          </div>;
        } else {
          title = this.props.element.title;
          box = <div className="text">
            <div className="title customTitle" >{title}</div>
          </div>;
        }
        break;
      case 'song':
        box = <div className="text customTxt">{title}</div>;
        break;

      default:
        box = <div className="text" >
          <div className="title  customTitle">{title}</div>
          <div className="desc  customTxt">{text}</div>
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
