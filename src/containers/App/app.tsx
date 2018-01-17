import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { MapStateToPropsParam } from "react-redux";

import { CardDetailContainer, Layout } from 'Containers';
import { Card } from 'Services';
import { navigable } from 'HOC';
import { UIActions, IUIActions } from 'Actions';
import { Theme, DIVE_CONFIG } from 'Components';
import * as classNames from 'classnames';

// tslint:disable-next-line:no-namespace
export namespace App {
  export interface IOwnProps {
    showMenu: boolean;
  }

  export interface IActionProps extends IUIActions {
  }

  export interface IState {
    /* empty */
  }
}
// Friends(Serie): e90f124e-af69-3757-921b-d5bac18e5a31
// Carry(Person): 28e7cb52-01a2-3e95-a71f-4fc2d3e46f86
// c58bbf1f-6ff5-11e5-b7c2-0684985cbbe3
// Sexo en NY (Movie): bd4f26ba-0c2a-3a16-bb7b-79aa066abf44
// Game of thrones(Serie) d6124318-9db2-341a-949f-25fa67a032d7
// Ministerio del tiempo(Serie): 0ce73f6d-6616-38e3-ba22-21009c91ba81


/*@navigable
@connect(mapStateToProps, maDispatchToProps, mergeProps)*/
// tslint:disable-next-line:max-line-length
export class AppClass extends React.Component<App.IOwnProps & App.IState & App.IActionProps, {}> {

  public render(): any {
    const { showMenu } = this.props;
    const classes = classNames({
      app: true,
      web: DIVE_CONFIG.platform === 'WEB',
    });
    return (
      <div id="diveApp" className={classes}>
        <Layout columns={1} parent={null} showMenu={showMenu} />
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
    ...UIActions,
  };
}

function mergeProps(stateProps: any, dispatchProps: any, ownProps: any): App.IOwnProps {
  return { ...stateProps, ...ownProps, ...dispatchProps };
}

export const App = connect<any, App.IActionProps, App.IOwnProps>
  (mapStateToProps, mapDispatchToProps)(AppClass);
