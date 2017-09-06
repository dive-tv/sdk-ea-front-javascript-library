import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { connect, ComponentDecorator } from 'react-redux';

import { INavState, IState } from 'Reducers';
import { NavActions, INavActions } from 'Actions';

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
                this.wrapper.focus();
                if (this.wrapper) {
                    // this.wrapper.scrollIntoView({ block: "start", behavior: "smooth" });
                    //this.doSelftScroll();
                    this.selfScroll();
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
                scrollable: this.props.isScrollable,
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

            const ChildComponent: any = InnerComponent;

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
                        if (this.wrapper) {
                            //this.wrapper.scrollIntoView({ block: "start", behavior: "smooth" });
                        }
                        return false;
                    }}
                    id={thisId.toString()}
                /*autoFocus={focus}*/>
                    <ChildComponent
                        // navComponent = {this.wrapper}
                        ref={
                            (refComponent: typeof InnerComponent) => {
                                if (refComponent) {
                                    this.refComponent = refComponent;
                                }
                            }
                        }
                        {...childProps as any }
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
            e.stopPropagation();
            e.preventDefault();
            if (e.buttons !== 1 && !e.keyCode) {
                return;
            }
            const nav: INavigable | undefined = this.props.navigation.get(this.getId());
            let eventConsumed = false;
            if (nav !== undefined && nav.children[0].length === 0) {
                this.props.setActivated(nav.id);
                eventConsumed = true;
            }
            if (this.props.clickAction) {
                this.props.clickAction();
                eventConsumed = true;
            }
            return eventConsumed;
        }

        public onFocus = (e: any): any => {
            const id = this.getId();
            const nav: INavigable | undefined = this.props.navigation.get(id);
            // scroll if needed
            if (this.props.selectedNav !== undefined) {
                if (this.props.selectedNav.id === id) {
                    this.doSelftScroll();
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
            e.preventDefault();
            return false;
        }

        public onKeyPressDown = (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === 13) {
                (ReactDOM.findDOMNode(this.refComponent) as any).click();
                this.onClick(e);
            }

            switch (e.key) {
                case 'ArrowUp':
                    this.props.moveVertical(-1);
                    break;
                case 'ArrowRight':
                    this.props.moveHorizontal(1);
                    break;
                case 'ArrowLeft':
                    this.props.moveHorizontal(-1);
                    break;
                case 'ArrowDown':
                    this.props.moveVertical(1);
                    break;
                default:
                    break;
            }

            return false;
        }


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

        private getScrollableElement = (): Element | null => {
            const element: HTMLElement | null = this.wrapper;
            if (element != null && element.closest instanceof Function) {
                return element.closest('.scrollable');
            }

            return null;
        }

        private selfScroll = () => {
            if (this.isScrollable() !== true) {
                return;
            }

            const HTMLScrollable: HTMLElement | null = this.getScrollableElement() as HTMLElement;

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

                    const params = { parentLeft, parentRight, parentWidth, left, right, width };


                    if (right + margin > parentRight + HTMLList.scrollLeft) {
                        HTMLList.scrollLeft = right - parentWidth + margin;
                    } else if (left - margin < HTMLList.scrollLeft + parentLeft) {
                        HTMLList.scrollLeft = left - margin;
                    }
                }
            }
        }
        private doSelftScroll = () => {
            setTimeout(() => {
                this.selfScroll();
            }, 5);
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
