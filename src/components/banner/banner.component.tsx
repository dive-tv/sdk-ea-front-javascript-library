import * as React from 'react';

import { navigable, INavigableProps } from 'HOC';
import { IBanner } from 'Reducers';

export interface IBannerProps {
    data: IBanner;
}
export class Banner extends React.PureComponent<IBannerProps & INavigableProps, {}> {
    public render(): JSX.Element {
        return (
            <div className={`banner banner-${this.props.data.banner_size}`}>
                <img className="fillParent" src={this.props.data.image_url} />
            </div>
        );
    }
}

export const NavigableBanner = navigable(Banner);
