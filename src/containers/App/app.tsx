import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { CardDetail } from '../../components';
import { MapStateToPropsParam } from "react-redux";

export namespace App {
  export interface IOwnProps  {
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
      view = "hola";//<CardDetail></CardDetail>;
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
