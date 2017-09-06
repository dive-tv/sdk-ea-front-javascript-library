import { CardTypeEnum } from 'Services';

import * as artConfig from '../config/art.json';
import * as businessConfig from '../config/business.json';
import * as chapterConfig from '../config/chapter.json';
import * as fashionConfig from '../config/fashion.json';
import * as fauna_floraConfig from '../config/fauna_flora.json';
import * as food_drinkConfig from '../config/food_drink.json';
import * as health_beautyConfig from '../config/health_beauty.json';
import * as historicConfig from '../config/historic.json';
import * as homeConfig from '../config/home.json';
import * as leisure_sportConfig from '../config/leisure_sport.json';
import * as locationConfig from '../config/location.json';
import * as lookConfig from '../config/look.json';
import * as movieConfig from '../config/movie.json';
import * as ostConfig from '../config/ost.json';
import * as personConfig from '../config/person.json';
import * as referenceConfig from '../config/reference.json';
import * as serieConfig from '../config/serie.json';
import * as songConfig from '../config/song.json';
import * as technologyConfig from '../config/technology.json';
import * as triviaConfig from '../config/trivia.json';
import * as vehicleConfig from '../config/vehicle.json';
import * as weaponConfig from '../config/weapon.json';

const cardDetailConfig = {
    artConfig,
    businessConfig,
    chapterConfig,
    fashionConfig,
    fauna_floraConfig,
    food_drinkConfig,
    health_beautyConfig,
    historicConfig,
    homeConfig,
    leisure_sportConfig,
    locationConfig,
    lookConfig,
    movieConfig,
    ostConfig,
    personConfig,
    referenceConfig,
    serieConfig,
    songConfig,
    technologyConfig,
    triviaConfig,
    vehicleConfig,
    weaponConfig,
};

export const cardModuleConfig: {[key in CardTypeEnum]?: any } = {
    art: cardDetailConfig.artConfig,
    business: cardDetailConfig.businessConfig,
    chapter: cardDetailConfig.chapterConfig,
    fashion: cardDetailConfig.fashionConfig,
    fauna_flora: cardDetailConfig.fauna_floraConfig,
    food_drink: cardDetailConfig.food_drinkConfig,
    health_beauty: cardDetailConfig.health_beautyConfig,
    historic: cardDetailConfig.historicConfig,
    home: cardDetailConfig.homeConfig,
    leisure_sport: cardDetailConfig.leisure_sportConfig,
    location: cardDetailConfig.locationConfig,
    look: cardDetailConfig.lookConfig,
    movie: cardDetailConfig.movieConfig,
    ost: cardDetailConfig.ostConfig,
    person: cardDetailConfig.personConfig,
    reference: cardDetailConfig.referenceConfig,
    serie: cardDetailConfig.serieConfig,
    song: cardDetailConfig.songConfig,
    technology: cardDetailConfig.technologyConfig,
    trivia: cardDetailConfig.triviaConfig,
    vehicle: cardDetailConfig.vehicleConfig,
    weapon: cardDetailConfig.weaponConfig,
};
