import * as React from "react";

import { Header, Text, Table, Awards, List } from 'CardModules';
import { CardDetailResponse, CardContainerTypeEnum } from "Services";

export interface ICardModuleProps {
    card: CardDetailResponse;
    moduleType: string;
}

export const cardModuleClasses: {
    [key: string]: React.ComponentClass<ICardModuleProps>,
} = {
        Header,
        ButtonHeader: Header,
        Description: Text,
        Biography: Text,
        Reference: Text,
        Gallery: List,
        Specifications: Table,
        BasicInfo: Table,
        AwardsModuleList: Awards,
    };
