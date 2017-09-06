/** Global definitions for developement **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

// for redux devtools extension
declare interface Window {
  devToolsExtension?(): (args?: any) => any;
}

interface IKeysToMap {
  CH_DOWN: number;
  CH_UP: number;
  SOURCE: number;
  RETURN: number;
  EXIT: number;
}

interface INavigableProps {
  parent: any,
  idx?: number, // Identificador único del navigable
  columns?: number, // Numero de columnas que hay en el entorno del elemento actual
  tabIndex?: number, // Orden de tabulación
  clickAction?: any,
  name?: string, // Nombre identificativo
  isDefault?: boolean, //Para que se seleccione ese elemento por defeto si no hay ningún otro  en ese listado.
  groupName?: string, // Nombre de grupo perteneciente
  onFocusCallback?: () => void;
  onFocusCallbackRepeat?: boolean;
  forceFirst?: boolean;
  forceOrder?: number;
  modal?: boolean; // Para bloquear la selección dentro de este navigable
  onBeforeUnmount?: (nav: INavigable) => void;
  focusChainClass?: string;
  activeGroupClass?: string;
  isScrollable?: boolean; // Elemento sobre el que se hace un scroll.
}

interface INavigable {
  parentId: number;
  id: number;
  children: number[][];
  columns?: number;
  name?: string;
  groupName?: string;
  forceFirst?: boolean;
  forceOrder?: number;
  modal?: boolean;
  isScrollable?: boolean;
}


type HOCComponent<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

declare module "*.json" {
  const value: any;
  export default value;
}


type ServiceStatus = "INIT" | "LOADING" | "DONE" | "FAIL";
