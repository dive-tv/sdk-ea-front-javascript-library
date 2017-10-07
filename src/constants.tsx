//import * as RxJS from 'rxjs';
// import { KeysMapped as OrsayKeysMapped, RollbarKey as OrsayRollbarKey } from "./types/extra.orsay";
// import { KeysMapped as TizenKeysMapped, RollbarKey as TizenRollbarKey } from "./types/extra.tizen";
declare const __ENABLE_ROLLBAR__: boolean;
declare const __ENABLE_ANALYTICS__: boolean;
declare const __ENABLE_AWS__: boolean;
declare const __ENABLE_SEGMENT__: boolean;
declare const __ENABLE_WHY__: boolean;
declare const __DIVE_ENV__: "DEV" | "PRE" | "PRO";
const environment: "DEV" | "PRE" | "PRO" = __DIVE_ENV__;
let testingChannel: string;
switch (environment) {
    case "PRE":
        testingChannel = "la2";
        break;
    case "PRO":
        testingChannel = "dive";
        break;
}
const enableRollbar: boolean = false;
export const TESTING_CHANNEL = testingChannel;
export const SESSION_STORAGE_KEY = 'DiveState';
/*export const keyDownObservable$ = RxJS.Observable.fromEvent(document, "keydown")
    .map((event: KeyboardEvent) => event.keyCode);
export const keyUpObservable$ = RxJS.Observable.fromEvent(document, "keyup")
    .map((event: KeyboardEvent) => event.keyCode);*/

export const DIVE_ENVIRONMENT: "DEV" | "PRE" | "PRO" = environment;
export const ENABLE_ROLLBAR = enableRollbar;
/* CAROUSEL */
export const SUPPORTED_CARD_TYPES = [
    "movie", // 1 - Catalog movie
    "serie", // 2 - Catalog full serie
    "person", // 3 - Actor or director
    "character", // 4 - Movie character
    "vehicle", // 5 - Vehicle description
    "fashion", // 6 - Fashion item
    "location", // 7 - Real or fictional location
    "historic", // 9 - Historical context
    "trivia", // 10 - Movie trivia or curiosity
    "quote", // 11 - Plot quote
    "ost", // 12 - Original Sountrack
    "home", // 13 - Home and deco item
    "technology", // 14 - Technology item
    "art", // 16 - Art item
    "song", // 17 - Single OST song
    // "look", // 18 - Fashion look
    // "trailer", // 19 - Movie trailer
    "weapon", // 20 - Weapon item
    "leisure_sport", // 21 - Leisure or sports item
    "health_beauty", // 22 - Health and beauty item
    "food_drink", // 23 - Food or drink recipe
    "fauna_flora", // 24 - Animal or plant description
    "business", // 25 - Business and jobs related item
    "reference", // 26 - Mention to other card in a movie
    // "videoclip", // 27 - Music videoclip
    "chapter", // 28 - Serie chapter
    // "action_emotion", // 29 - Action or emotion shown onscreen
];

export enum FilterTypeEnum {
    All = "FILTER_ALL",
    CastAndCharacter = "FILTER_CAST",
    FashionAndBeauty = "FILTER_FASHION",
    Music = "FILTER_MUSIC",
    PlacesAndTravel = "FILTER_PLACES",
    CarsAndMore = "FILTER_CARS",
    FunFacts = "FILTER_FUN",
    Other = "FILTER_OTHER"
};

export const LIMIT_FOR_RELATIONS: number = 3;
/*function getKeyAlias(): IKeysToMap {
    if (__PLATFORM__ === "orsay") {
        return OrsayKeysMapped;
    } else if (__PLATFORM__ === "tizen") {
        return TizenKeysMapped;
    } else {
        // TODO: Add client keys
        return OrsayKeysMapped;
    }
}

function getRollbarKey() {
    if (__PLATFORM__ === "orsay") {
        return OrsayRollbarKey;
    } else if (__PLATFORM__ === "tizen") {
        return TizenRollbarKey;
    } else {
        // TODO: Add client keys
        return OrsayRollbarKey;
    }
}
*/
