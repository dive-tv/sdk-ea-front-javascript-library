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
        MovieHeader: Header,
        Overview: Text,
        Description: Text,
        Biography: Text,
        Reference: Text,
        Gallery: List,
        Shop: List,
        TravelShop: List,
        Directors: List,
        Seasons: List,
        Filmography: List,
        Cast: List,
        AppearsInLocation: List,
        CompleteTheDeco: List,
        Specifications: Table,
        BasicInfo: Table,
        AwardsModuleList: Awards,
    };
