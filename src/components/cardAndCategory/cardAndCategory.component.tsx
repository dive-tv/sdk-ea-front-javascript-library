import * as React from 'react';
import { CardDetailResponse, Localize } from "Services";

export interface ICardAndCategoryProps {
    card: CardDetailResponse | null;
}
export class CardAndCategory extends React.PureComponent<ICardAndCategoryProps, {}> {
    public static defaultProps: ICardAndCategoryProps = {
        card: null,
    };

    public render() {
        const card = this.props.card;
        if (card) {
            let showImage: boolean = false;
            if (card.image && card.image.thumb) {
                showImage = true;
            }
            let showIcon: boolean = !showImage;
            let showTitle = false;
            let showSubtitle = false;
            switch (card.type) {
                case 'ost':
                case 'song':
                    showImage = false;
                    showIcon = true;
                    showTitle = true;
                    showSubtitle = true;
                    break;
                case 'quote':
                case 'reference':
                case 'trivia':
                    showImage = false;
                    showIcon = false;
                    showTitle = true;
                    break;
            }
            const category = Localize(`CAROUSEL_ALIAS_${card.type.toUpperCase()}`) || card.type;
            return (
                <div className="cardAndCategory">
                    <div className={`image ${card.type}`}
                        style={showImage ? {
                            backgroundImage: `url(${card!.image!.thumb})`,
                            backgroundPosition:
                            `${card!.image!.anchor_x}% ${card!.image!.anchor_y}%`,
                        } : undefined}
                    >
                        {showIcon ? <div className="icon"></div> : null}
                        {showTitle ? <div className="title">{card.title}</div> : null}
                        {showSubtitle && !showIcon ? <div className="subtitle">{card.subtitle}</div> : null}
                    </div>
                    <div className="category">{category}</div>
                </div>
            );
        }
        return null;
    }
}
