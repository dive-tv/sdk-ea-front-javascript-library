import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { CardDetailContainer } from 'Containers';
import { MapStateToPropsParam } from "react-redux";

export namespace App {
  export interface IOwnProps {
  }

  export interface IActionProps {
  }

  export interface IState {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps, undefined)
export class App extends React.Component<App.IOwnProps & App.IActionProps, App.IState> {

  public render(): any {
    let view: any = "";
    if (true) {
      view = <CardDetailContainer
        cardId={"bd4f26ba-0c2a-3a16-bb7b-79aa066abf44"}
        key={"cardDetail"}
        parent={this}
        columns={1}
        isDefault={true}
      />;
    }

    // Friends(Serie): e90f124e-af69-3757-921b-d5bac18e5a31
    // Carry(Person): 28e7cb52-01a2-3e95-a71f-4fc2d3e46f86
    // c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3
    // Sexo en NY (Movie): bd4f26ba-0c2a-3a16-bb7b-79aa066abf44

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
