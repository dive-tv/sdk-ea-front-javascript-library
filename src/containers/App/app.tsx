import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { MapStateToPropsParam } from "react-redux";

import { CardDetailContainer } from 'Containers';
import { Card } from 'Services';

export namespace App {
  export interface IOwnProps {
    cards: Card[];
  }

  export interface IActionProps {
  }

  export interface IState {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps, mergeProps)
export class App extends React.Component<App.IOwnProps & App.IActionProps, App.IState> {

  public render(): any {
    let view: any = "";
    if (true) {
      view = this.props.cards.map((card: Card, idx: number) => {
        return <CardDetailContainer
          cardId={card.card_id}
          key={`cardDetail_${idx}`}
          parent={this}
          columns={1}
          isDefault={true}
        />;
      });
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
  };
}

function mapDispatchToProps(dispatch: any): App.IActionProps {
  return {
  };
}

function mergeProps(stateProps: any, dispatchProps: any, ownProps: any): App.IOwnProps {
  return { ...stateProps, ...ownProps, ...dispatchProps };
}
