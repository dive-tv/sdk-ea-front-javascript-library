import * as React from 'react';
import * as TodoActions from '../../actions/todos';
import * as style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import { Header, MainSection } from '../../components';
import { View } from 'react-primitives';

export namespace App {
  export interface IProps extends RouteComponentProps<void> {
    todos: TodoItemData[];
    actions: typeof TodoActions;
  }

  export interface IState {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.IProps, App.IState> {

  public render() {
    const { todos, actions, children } = this.props;
    return (
      <View className={style.normal}>
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
        {children}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions as any, dispatch),
  };
}
