import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { connect, ComponentDecorator } from 'react-redux';

import { INavState, IState } from 'Reducers';
import { NavActions, INavActions } from 'Actions';
import { KeyMap } from 'Services';

(window as any).currentNavId = 0;

export interface INavigableProps {
    parent: React.Component<any & INavigableProps, any>,
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
    navClass?: string;
    scrollPadding?: number;
}

export interface INavigable {
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

type InjectedProps = INavigableProps & INavActions & INavState;

const NavigableClass = <TOriginalProps extends {}>(
    InnerComponent: (React.ComponentClass<TOriginalProps> |
        React.StatelessComponent<TOriginalProps> |
        ComponentDecorator<TOriginalProps, any>
    ),
) => {
    type ResultProps = TOriginalProps & InjectedProps;
    class Navigable extends React.PureComponent<ResultProps, {}> {
        // const state:IUIState = this.store
        public lastNavLevel: INavigable;
        public wrapper: any;
        public navId: number = 0;
        public refComponent: any;
        private focusTracked: boolean = false;

        constructor(props: any) {
            super(props);
            this.navId = this.getNewId();
        }

        public getNewId = (): number => ++(window as any).currentNavId;

        public componentDidUpdate() {
            if (this.getId() === this.props.selected) {
                if (this.wrapper) {
                    this.doSelfScroll(true, () => {
                        setTimeout(() => {
                            this.wrapper.focus();
                        }, 10);

                    });
                }
            }
        }

        // public shouldComponentUpdate(nextProps: any) {
        //     const thisId = this.getId();
        //     const nav = this.props.navigation.get(thisId);
        //     if (!this.wrapper) {
        //         return true;
        //     }
        //     if (nav.children[0].length === 0 && this.props.selected !== thisId && nextProps.selected !== thisId) {
        //         console.log("Updated! leaf and not prev selected", thisId);
        //         return false;
        //     }
        //     return true;
        // const thisId = this.getId();
        // if (!this.wrapper) {
        //     return true;
        // } else if (nextProps.selected === thisId) {
        //     console.log("Updated! currSelection", thisId);
        //     return true;
        // }

        // if (nextProps.activated === thisId || this.props.activated === thisId) {
        //     console.log("Updated! is activated", thisId);
        //     return true;
        // }
        // const nav = this.props.navigation.get(thisId);
        // if (nav.children[0].length === 0 && this.props.selected !== thisId) {
        //     console.log("Updated! leaf and not prev selected", thisId);
        //     return true;
        // }

        // if (this.inFocusChain(this.props.selectedNav) || this.inFocusChain(nextProps.selectedNav)) {
        //     console.log("Updated! is in focus chain", thisId);
        //     return true;
        // } else {
        //     return false;
        // }
        // MAYBE, ON FUTURE SHOULD BE ALWAYS TRUE
        // return true;
        // }

        // INIT DATA ON MOUNT COMPONENT
        public componentDidMount() {
            const thisId = this.getId();
            const parentComponent: Navigable = this.props.parent as Navigable;
            let parentId: number = -1;
            if (parentComponent && parentComponent.props && parentComponent.props.idx !== undefined) {
                parentId = parentComponent.props.idx as number;
            }

            const obj: INavigable = {
                parentId,
                children: [[]],
                id: thisId,
                columns: this.props.columns,
                // defaultName: this.props.defaultName,
                name: this.props.name,
                groupName: this.props.groupName,
                forceFirst: this.props.forceFirst,
                forceOrder: this.props.forceOrder,
                modal: this.props.modal,
                isScrollable: this.props.isScrollable,
            };

            // Add node to state
            this.props.addNode(obj);

            // Set focus
            if (thisId === this.props.selected) {
                this.wrapper.focus();
            }

            // Select default element by defaultName prop, added in component
            if (this.props.isDefault === true) {
                this.props.setNodeById(thisId);

            } else if (this.props.selectedNav !== undefined) {
                // CASO DE QUE EL PADRE ESTÉ SELECCIONADO AL MONTAR ESTE:
                const navSelected: INavigable = this.props.selectedNav as INavigable;
                const nav: INavigable = this.props.navigation.get(thisId) as INavigable;
                if (navSelected.id === nav.parentId && navSelected.children[0][0] === thisId) {
                    this.props.setNodeById(thisId);
                }
            }
            this.forceUpdate();
        }

        public componentWillUnmount() {
            const thisId = this.getId();
            // ANTES DE Borrar el nodo, si tiene el foco, hay que pasárselo a  otro con esta preferencia:
            // al siguiente, sino, al anterior, sino al padre
            if (this.props.onBeforeUnmount !== undefined) {
                this.props.onBeforeUnmount(this.props.selectedNav as INavigable);
            }
            if (this.props.selectedNav !== undefined) {
                // CASO DE QUE EL PADRE ESTÉ SELECCIONADO AL MONTAR ESTE:
                const navSelected: INavigable = this.props.selectedNav as INavigable;
                const nav: INavigable = this.props.navigation.get(thisId) as INavigable;
                if (navSelected.id === thisId) {
                    this.props.setNodeById(nav.parentId);
                }
            }
            this.props.deleteNode(thisId);
        }

        public render() {
            const thisId = this.getId();
            const off: boolean = this.props.selectedNav === undefined ||
                this.props.groupName !== this.props.selectedNav.groupName;
            const active: boolean = thisId === this.props.activated;
            const classes: any = {
                navigable: true,
                navActive: active,
                // scrollable: this.props.isScrollable,
            };

            if (this.props.navClass) {
                classes[this.props.navClass] = true;
            }

            if ((this.props.focusChainClass && this.props.focusChainClass.length) && this.props.selectedNav) {
                classes[this.props.focusChainClass] = this.inFocusChain(this.props.selectedNav);
            }

            if ((this.props.activeGroupClass && this.props.activeGroupClass.length && !off)) {
                classes[this.props.activeGroupClass] = true;
            }

            const classesApplied = classNames(classes);

            // const { key, onFocusCallback, onFocusCallbackRepeat, parent, ...childProps } = this.props as any;
            // NAV PROPS
            const {
                idx, columns, tabIndex, clickAction, isDefault, /*groupName,*/ onFocusCallback,
                onFocusCallbackRepeat, forceFirst, forceOrder, modal, onBeforeUnmount,
                focusChainClass, navClass, ...noNavOwnProps,
            } = this.props as any;
            const {
                navigation, lastKey, selected, selectedNav, lastSelected,
                activated, lastActivated, navNames, ...childProps,
            } = noNavOwnProps;
            // childProps = childProps || {};
            // const castedProps = Object.assign({}, childProps) as any;
            // const passedProps = castedProps && Object.keys(castedProps).length > 0 ? castedProps : {a: 0};

            const ChildComponent: any = InnerComponent;
            // try {
            //     console.log("PASSED PROPS", cp);
            // } catch(e) {
            //     console.error("ERror feo", e);
            // }

            return (
                <div ref={(el) => { if (el) { this.wrapper = el; } }} className={classesApplied} tabIndex={-1}
                    key={this.props.key ? this.props.key + '_Nav' : ""}
                    onKeyUp={this.onKeyPress}
                    onKeyDown={this.onKeyPressDown}
                    onMouseEnter={this.onMouseEnter}
                    // onClick={this.onClick}
                    onMouseDown={this.onClick}
                    onFocus={(e: any) => {
                        this.onFocus(e);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    id={thisId.toString()}
                /*autoFocus={focus}*/>
                    <ChildComponent
                        navComponent={this.wrapper}
                        ref={
                            (refComponent: typeof InnerComponent) => {
                                if (refComponent) {
                                    this.refComponent = refComponent;
                                }
                            }
                        }
                        { ...childProps as any }
                        idx={thisId}
                    />
                </div>);
        }

        public onMouseEnter = (): any => {
            const thisId = this.getId();
            const nav: INavigable | undefined = this.props.navigation.get(thisId);
            if (nav !== undefined && nav.children[0].length === 0) {
                this.props.setSelected(thisId);

                // Comprobamos si se ha completado la selección
                if (thisId === this.props.selected) {
                    this.wrapper.focus();
                }
            }
        }

        public onClick = (e: any): any => {
            if (e.buttons !== 1 && !e.keyCode) {
                return;
            }
            const nav: INavigable | undefined = this.props.navigation.get(this.getId());
            let eventConsumed = false;
            if (nav !== undefined && nav.children[0].length === 0) {
                this.props.setActivated(nav.id);
                eventConsumed = true;
            }
            if (this.props.clickAction as any instanceof Function) {
                this.props.clickAction();
                eventConsumed = true;
            } else {
                console.log("ClickAction is not a function");
            }
            if (eventConsumed) {
                e.stopPropagation();
                e.preventDefault();
            }
            return eventConsumed;
        }

        public onFocus = (e: any): any => {
            const id = this.getId();
            const nav: INavigable | undefined = this.props.navigation.get(id);
            // scroll if needed
            if (this.props.selectedNav !== undefined) {
                if (this.props.selectedNav.id === id) {
                    this.doSelfScroll(true);
                }
            }
            // Call callback if set
            if (this.props.onFocusCallback !== undefined && (!this.focusTracked || this.props.onFocusCallbackRepeat)) {
                this.focusTracked = true;
                (this.props.onFocusCallback as () => void)();
            }
            // Check if 'leaf' node
            if (nav !== undefined && nav.children[0].length === 0) {
                return true;
            }
            // window.scrollTo(0, 0);
            // document.body.scrollTop = 0;

            e.stopPropagation();
            e.preventDefault();
            // return false;
        }

        public getId = (): number => this.navId;

        public onKeyPress = (e: any) => {
            console.log("kp", e.keyCode);
            let consumed: boolean = false;
            if (consumed) {
                e.stopPropagation();
                e.preventDefault();
            }
            return !consumed;
        }

        public onKeyPressDown = (e: any) => {
            const km: any = KeyMap;
            let consumed = false;
            console.log("Key", e.key, e.code, e.keyCode);

            switch (e.keyCode) {
                case km.UP:
                    this.props.moveVertical(-1);
                    consumed = true;
                    break;
                case km.RIGHT:
                    this.props.moveHorizontal(1);
                    consumed = true;
                    break;
                case km.LEFT:
                    this.props.moveHorizontal(-1);
                    consumed = true;
                    break;
                case km.DOWN:
                    this.props.moveVertical(1);
                    consumed = true;
                    break;
                case km.ENTER:
                    (ReactDOM.findDOMNode(this.refComponent) as any).click();
                    this.onClick(e);
                    consumed = true;
                    break;
                default:
                    break;
            }
            if (consumed) {
                e.preventDefault();
                e.stopPropagation();
            }

            return !consumed;
        }

        // Comprobamos si el elemento es scrollable o si alguno de sus padres lo es.
        private isScrollable = (): boolean => {
            if (this.isSelected()) {
                let nav: INavigable | undefined = this.props.selectedNav;
                do {
                    if (nav !== undefined && nav.parentId !== -1) {
                        if (nav && nav.isScrollable === true) {
                            return true;
                        }
                        nav = this.props.navigation.get(nav.parentId);
                    } else {
                        nav = undefined;
                    }
                } while (nav !== undefined);
            }

            return true;
        }

        private isSelected = (): boolean => this.props.selected === this.getId();

        //Cogemos el elemento padre scrollable más cercano.
        private getScrollableElement = (): Element | null => {
            const element: HTMLElement | null = this.wrapper;
            if (element != null && element.closest instanceof Function) {
                return element.closest('.scrollable');
            }

            return null;
        }

        //Calculamos el nuevo scroll para cuando el elemento scrollable se sale de la pantalla.
        private calculateScroll = (HTMLList: HTMLElement | null, HTMLScrollable: HTMLElement | null): number => {
            if (this.isScrollable() !== true) {
                return -1;
            }

            // const HTMLScrollable: HTMLElement | null = this.getScrollableElement() as HTMLElement;

            if (document !== null && HTMLScrollable !== null) {
                const HTMLList: HTMLElement | null = ReactDOM.findDOMNode(HTMLScrollable).parentElement;
                if (HTMLList !== null) {
                    let margin: number = 100;
                    if (this.props.scrollPadding !== undefined) {
                        margin = this.props.scrollPadding as number;
                    }

                    const left: number = HTMLScrollable.offsetLeft;
                    const right: number = HTMLScrollable.offsetWidth + HTMLScrollable.offsetLeft;
                    const width: number = HTMLScrollable.offsetWidth;

                    const parentLeft: number = HTMLList.offsetLeft;
                    const parentRight: number = HTMLList.offsetWidth + HTMLList.offsetLeft;
                    const parentWidth: number = HTMLList.offsetWidth;

                    let val: number = 0;
                    if (right + margin > parentRight + HTMLList.scrollLeft) {
                        // Si el elemento se sale por la derecha.
                        val = right - parentWidth + margin;
                    } else if (left - margin < HTMLList.scrollLeft + parentLeft) {
                        // Si el elemento se sale por la izquierda.
                        val = left - margin;
                        if (val < 0) {
                            val = 0;
                        }
                    } else {
                        val = HTMLList.scrollLeft;
                    }
                    return val;
                }
            }
            return -1;
        }

        // Ejecutamos el scroll teniendo en cuenta si se quiere asíncronamente o no y al final
        // Llamamos a la función callback que se haya pasado como parámetro.
        private doSelfScroll = (async: boolean, callback?: () => void) => {
            const callbackOk: () => void = callback === undefined ? () => 0 : callback;
            const HTMLItem: HTMLElement | null = this.getScrollableElement() as HTMLElement;
            const HTMLList: HTMLElement | null = HTMLItem ? ReactDOM.findDOMNode(HTMLItem).parentElement : null;

            const scroll: number = this.calculateScroll(HTMLList, HTMLItem);

            if (scroll >= 0 && HTMLList != null) {
                // Cuando es asíncrona la llamada.
                if (async === true) {
                    setTimeout(() => {
                        HTMLList.scrollLeft = scroll;
                        HTMLList.scrollTop = 0;
                        return callbackOk();
                    }, 10);

                } else {
                    // Cuando es síncrona.
                    HTMLList.scrollLeft = scroll;
                    HTMLList.scrollTop = 0;
                    return callbackOk();
                }
            }

            return callbackOk();
        }

        private inFocusChain(navigation?: INavigable): boolean {
            const nav = navigation;
            const myId = this.getId();
            if (nav) {
                if (nav.id === myId || nav.parentId === myId) {
                    return true;
                } else if (nav.parentId !== -1) {
                    return this.inFocusChain(this.props.navigation.get(nav.parentId));
                }
            }
            return false;
        }
    }

    const mapIUIStateToProps = (state: IState): INavState => (state.nav);
    const connected: React.ComponentClass<TOriginalProps & INavigableProps & { className?: any }/* & INavActions & INavState*/> = connect(
        mapIUIStateToProps, NavActions, undefined, { withRef: true },
    )(Navigable as any) as any;

    return connected;
};

export const navigable = NavigableClass;

export default navigable;
