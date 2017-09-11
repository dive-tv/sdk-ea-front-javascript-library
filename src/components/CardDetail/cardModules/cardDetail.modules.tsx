import * as React from "react";

import { Header, Text, Table, Awards, List } from 'CardModules';
import { Card, CardContainerTypeEnum } from "Services";

export interface ICardModuleProps {
    card: Card;
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
        Shop: List,
        TravelShop: List,
        Filmography: List,
        Specifications: Table,
        BasicInfo: Table,
        AwardsModuleList: Awards,
    };
