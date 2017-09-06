import * as React from 'react';
import * as TodoActions from '../../actions/todos';
import * as style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import { Header, MainSection, CardDetail } from '../../components';
import { View } from 'react-primitives';
import { MapStateToPropsParam } from "react-redux";

export namespace App {
  export interface IOwnProps  {
    todos?: TodoItemData[];
  }

  export interface IActionProps {
    actions?: typeof TodoActions;
  }

  export interface IState {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps, undefined)
export class App extends React.Component<App.IOwnProps & App.IActionProps, App.IState> {

  public render() {
    let view;
    if (true) {
      view = "hola";//<CardDetail></CardDetail>;
    }

    return (
      <View className={style.normal}>
        {view}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos,
  };
}

function mapDispatchToProps(dispatch): App.IActionProps {
  return {
    actions: bindActionCreators(TodoActions as any, dispatch),
  };
}
