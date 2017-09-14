import * as React from "react";

import { Header, Text, Table, Awards, List, Map } from 'CardModules';
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
        Description: Text,
        Biography: Text,
        Reference: Text,
        FullCuriosity: Text,
        Overview: Text,
        Gallery: List,
        Specifications: Table,
        BasicInfo: Table,
        AwardsModuleList: Awards,
        MapModule: Map,
    };
