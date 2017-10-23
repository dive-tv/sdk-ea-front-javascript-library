import * as React from 'react';
import { ITheme } from 'src/scss/theme';

export interface IThemeProps {
    theme?: ITheme;
    // TODO: Fill the component props:  any;
}

export class Theme extends React.PureComponent<IThemeProps, {}> {
    public static defaultProps: IThemeProps = {
        theme: {
            title: 'cyan',
            text: 'green',
            text2: 'verdosin',
            textSelected: 'como el background',
            background: "",
            backgroundCarouselCard: '',
            backgroundCardSection: '',
            selected: 'orange',
            unselected: '',
        },
    };

    public render(): JSX.Element {
        const { theme } = this.props;

        return (
            <style>{
                `
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
                    color ${theme.textSelected} !important;
                }
                .customBkg{
                    background-color:  ${theme.background} !important;
                }
                .customBkgCarouselCard{
                    background-color:  ${theme.backgroundCarouselCard} !important;
                }
                .customBkgCardSection{
                    background-color:  ${theme.backgroundCardSection} !important;
                }

                `
            }
            </style>
        );
    }
}
