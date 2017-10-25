import * as React from 'react';
import { ITheme } from 'src/scss/theme';

export interface IThemeProps {
    theme?: ITheme;
    // TODO: Fill the component props:  any;
}

export class Theme extends React.PureComponent<IThemeProps, {}> {
    public static defaultProps: IThemeProps = {
        theme: {
            title: '#fff',
            text: '#909090',
            text2: '#269b8b',
            background: "#1c1d1d",
            backgroundCarouselCard: '#1c1d1d',
            backgroundCardSection: '#252526',
            backgroundBtn: '#252526',
            textBtn: '#909090',
            textBtnSelected: 'black',
            selected: '#f7d73b',
            unselected: '#909090',
        },
    };

    public validatedTheme = (): ITheme => {
        let theme: any = {};
        for (var propiedad in this.props.theme) {
            theme[propiedad] = (this.props.theme as any)[propiedad].split(";")[0];
        }
        return theme as ITheme;
    }

    public render(): JSX.Element {
        // const { theme } = this.props;

        const theme = { ...Theme.defaultProps.theme, ...this.props.theme };

        return (
            <style>{
                `
                .navigable:focus > div{
                    border-color: ${theme.selected} !important;
                }
                .customTitle{
                    color: ${theme.title} !important;
                }
                .customTxt{
                    color: ${theme.text} !important;
                }
                .customTxt2{
                    color: ${theme.text2} !important;
                }
                .customTxtSelected{
                    color: ${theme.textBtnSelected} !important;
                }
                .customTxtSelected2{
                    color: ${theme.selected} !important;
                }

                .customBkg{
                    background-color:  ${theme.background} !important;
                }
                .expandedInfoContainer .expandedInfo{
                    background-color:  ${theme.backgroundCardSection} !important;
                }

                /*Fondo de los contenedores de las secciones de card detail */
                .cardModule .container{
                    background-color:  ${theme.backgroundCardSection} !important;
                }

                /*Fondo de la parte izquierda de las cards de carousel */
                .minicard .cardLeft{
                    background-color: ${theme.backgroundCarouselCard} !important;
                }


                .activeGroup .groupSelectedBkg{
                    background-color: ${theme.selected} !important;
                }

                /*Cuando un padre está seleccionado */
                .childFocused .parentSelected{
                    border-color: ${theme.selected} !important;
                }
                .childFocused .parentSelectedTxt{
                    color: ${theme.selected} !important;
                }
                .childFocused .parentSelectedBkg,:focus .customSelectedBkg{
                    background-color: ${theme.selected} !important;
                }

                /*Botón Custom que se selecciona según un hijo, ya que al padre se le agrega la clase 'childFocused' */
                .childFocused .customBtnByChild{
                    background-color:${theme.selected} !important;
                    color: ${theme.textBtnSelected} !important;
                    border-color: ${theme.selected} !important;
                }

                /*Elementos que se seleccionan y se deseleccionan con focus */
                .customToggleSelected, .customUnselected{
                    border-color: ${theme.unselected} !important;
                }

                :focus .customToggleSelected{
                    border-color: ${theme.selected} !important;
                }


                /*Botón Custom */
                .customBtn{
                    background-color:${theme.backgroundBtn} !important;
                    color: ${theme.textBtn} !important;
                    border-color: ${theme.textBtn} !important;
                }
                :focus .customBtn{
                    background-color:${theme.selected} !important;
                    color: ${theme.textBtnSelected} !important;
                    border-color: ${theme.selected} !important;
                }

                

                `
            }
            </style>
        );
    }
}
