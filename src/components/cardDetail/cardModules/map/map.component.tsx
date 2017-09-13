import * as React from 'react';

import {
    Card, CardContainerTypeEnum, Helper,
    Map as MapVO, MapData as MapDataVO, Localize,
} from "Services";
import { ICardModuleProps } from "CardModules";
import { DirectionButton, VerticalScroll } from "Components";
import { navigable, statics } from "HOC";

interface IMapProps {
    container: MapVO;
    mapData: MapDataVO;
}
@statics({
    moduleName: "map",
    validate: (card: Card, moduleType: string, parent: any, props: any) => {
        console.log("[Map] card: ", card);
        // No se puede guardar el container aquí, porque es un método estático.
        const container: MapVO | undefined = Helper.getContainer(card, 'map') as MapVO;
        if (container !== undefined &&
            container.data !== undefined &&
            container.data.length > 0) {
            const Instantiated = navigable(Map);
            return (<Instantiated
                {...props}
                container={container}
                mapData={container.data[0]}
                parent={parent}
                card={card}
                moduleType={moduleType} />
            );
        }
        return null;
    },
})
export class Map extends React.PureComponent<ICardModuleProps & IMapProps, {}> {
    public render(): any {
        const textTitle = this.getTitle();
        const {latitude, longitude, zoom } = this.props.mapData;
        return (
            <div className="cardModuleMap cardModule">
                <div className="container">
                    {textTitle ? <div className="cardTitle">{textTitle}</div> : null}
                    <div className="map">
                        <img
                            // tslint:disable-next-line:max-line-length
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=300x168`} className="mapThumbnail" />
                    </div>
                </div>
            </div>
        );
    }

    private getTitle() {
        if (this.props.container === undefined) {
            return '';
        }
        return Localize('LOCATION');
        /*
        switch (this.props.container!.content_type) {
            case 'location':
                return Localize('LOCATION');
            default:
                return null;
        }*/
    }
}
