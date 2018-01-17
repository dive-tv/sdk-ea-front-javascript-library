import * as React from 'react';
import * as css from '../../../src/scss/main.scss';
import { ITheme } from 'Theme';
import ShadowDOM from 'react-shadow';
import { Theme } from 'Components';
import { Provider } from 'react-redux';
import { App } from 'Containers';
import { store } from '../../../src/store/store';
import * as elementResizeEvent from 'element-resize-event';

export interface IMainProps {
  theme: ITheme;
  showMenu: boolean;
  platform: platformTypes;
}

export interface IMainState {

}
export type platformTypes = 'HBBTV' | 'WEB';
export interface IDiveConfig {
  platform: platformTypes,

}
export let DIVE_CONFIG: IDiveConfig = {
  platform: 'WEB',
}

export class Main extends React.PureComponent<IMainProps, IMainState> {
  public static defaultProps: IMainProps = {
    theme: null,
    showMenu: false,
    platform: 'WEB',
  };

  private divElement: HTMLDivElement;
  private fontSize: number = 11;

  public componentDidMount() {
    if(this.props.platform != null){
      DIVE_CONFIG.platform = this.props.platform;
    }
    
    this.fontResize();

    elementResizeEvent(this.divElement, () => this.fontResize());

  }

  public fontResize() {
    this.fontSize = 11 * this.divElement.offsetWidth / 1920;
    this.forceUpdate();
  }

  public render(): JSX.Element {
    const { theme, showMenu } = this.props;
    return (
      //<ShadowDOM /*include={'styles.css'}*/>

      <div className="diveContainer"
        ref={input => { this.divElement = input }}
        style={{ fontSize: this.fontSize + 'px' }}>

        <style /*scoped={true}*/>{css[0][1]}</style>
        <Theme theme={theme} />
        <Provider store={store}>
          <App showMenu={showMenu} />
        </Provider>

      </div>
      //</ShadowDOM >
    );
  }
}
