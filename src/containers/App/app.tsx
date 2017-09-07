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
        cardId={"c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3"}
        key={"cardDetail"}
        parent={this}
        columns={1}
        isDefault={true}
      />;
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
