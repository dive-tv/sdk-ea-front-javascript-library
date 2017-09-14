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
          version={card.version}
          key={`cardDetail_${idx}`}
          parent={this}
          columns={1}
          isDefault={true}
        />;
      });
    }

    // Friends(Serie): e90f124e-af69-3757-921b-d5bac18e5a31
    // Carry(Person): 28e7cb52-01a2-3e95-a71f-4fc2d3e46f86
    // c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3
    // Sexo en NY (Movie): bd4f26ba-0c2a-3a16-bb7b-79aa066abf44
    // Game of thrones(Serie) d6124318-9db2-341a-949f-25fa67a032d7
    // Ministerio del tiempo(Serie): 0ce73f6d-6616-38e3-ba22-21009c91ba81

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
