import { Action } from 'redux';
import { SocketActionTypes } from 'Actions';
import { Card } from 'Services';
export type ChannelStatus = "off" | "playing" | "paused" | "end" | "ready";

export type CardRender = ICardRelation | ICardAndRelations;

export interface ISyncState {
    type?: "SOCKET" | "YOUTUBE";
    socketStatus: string;
    //chunkStatus: ServiceStatus;
    movieId?: string;
    cards: CardRender[];
    demo: string;
    currentTime: number; // Time in seconds
    timeMovie: number; // Time of socket (milis)
    timeMovieSynced: number; // date.now when socket(milis)
    timeRatio: number;
    lastUpdatedTime: number;
    channelStatus?: ChannelStatus;
    selectedOnSceneChange: boolean;
    showInfoMsg: boolean;
}
export interface ISyncAction extends Action {
    type: SyncActionTypes;
    payload?: any;
}

export interface ICardRelation extends Card {
    parentId: string | null,
    childIndex: number | null,
}

export interface ICardAndRelations {
    type: string;
    card: Card;
    cards: Card[];
}

export type SyncActionTypes = "SYNC/OPEN_CARD" | "SYNC/START" | "SYNC/SET_TIME" | "SYNC/UPDATE_TIME" |
    "SYNC/START_SCENE" | "SYNC/UPDATE_SCENE" | "SYNC/END_SCENE" | "SYNC/PAUSE_START" | "SYNC/PAUSE_END" |
    "SYNC/SET_MOVIE" | "SYNC/CHUNK_FAILED" | "SYNC/INIT_TIME" | "SYNC/SET_SELECTED_ON_SCENE_CHANGE" |
    "SOCKET/CONNECTED" | "SYNC/SET_TRAILER" | "SYNC/SET_SYNC_TYPE" | "SYNC/SET_CHUNK_STATUS" |
    "SYNC/CLOSE_INFO_MSG" | SocketActionTypes;

export const SyncReducer = (state: ISyncState = initialSyncState, action: ISyncAction): ISyncState => {
    switch (action.type) {
        case 'SYNC/SET_MOVIE':
            return {
                ...state, movieId: action.payload,
                cards: [],
            };
        case 'SYNC/UPDATE_TIME': // UPDATEA EL TIEMPO CON EL NOW
            return {
                ...state,
                currentTime: calcTime(state, Date.now()),
                lastUpdatedTime: Date.now(),
            };
        case 'SYNC/START_SCENE':
            let cards = state.cards;
            if (state.cards instanceof Array && action.payload instanceof Array &&
                state.cards.length !== action.payload.length) {
                cards = action.payload;
            } else {
                cards = [];
            }
            return { ...state, cards, selectedOnSceneChange: true, channelStatus: "playing" };
        case 'SYNC/UPDATE_SCENE':
            if (action.payload instanceof Array && action.payload.length) {
                return { ...state, cards: [...action.payload, ...state.cards], channelStatus: "playing" };
            } else {
                return state;
            }
        case 'SYNC/END_SCENE':
            return { ...state, cards: [], channelStatus: "playing" };
        case 'SYNC/PAUSE_START':

            return { ...state, channelStatus: "paused", showInfoMsg: true };
        case 'SYNC/PAUSE_END':
            return { ...state, channelStatus: "playing", showInfoMsg: false };

        case 'SYNC/CLOSE_INFO_MSG':
            return { ...state, showInfoMsg: false };

        case 'SYNC/SET_TRAILER':
            return { ...state, demo: action.payload };
        case 'SYNC/SET_SYNC_TYPE':
            return {
                ...state, type: action.payload, socketStatus: 'INIT',
                timeMovieSynced: initialSyncState.timeMovieSynced,
                currentTime: initialSyncState.currentTime,
                lastUpdatedTime: initialSyncState.lastUpdatedTime,
            };

        case 'SYNC/SET_SELECTED_ON_SCENE_CHANGE':
            return { ...state, selectedOnSceneChange: action.payload };

        default:
            return state;
    }
};

const calcTime = (state: ISyncState, time: number) => {
    // console.log("[calcTime] state: ", state);
    // console.log("[calcTime] time: ", time);
    return (state.timeMovie + (time - state.timeMovieSynced) * state.timeRatio) / 1000;
};

export const initialSyncState: ISyncState = {
    selectedOnSceneChange: true,
    socketStatus: 'INIT',
    movieId: "m00001",
    cards: [{
        // tslint:disable
        "card_id": "eee005c9-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Unos pantalones muy especiales",
        "subtitle": null,
        "type": "trivia",
        "image": null,
        "has_content": true,
        "products": [],
        "relations": []
    }, {
        "card_id": "6e4559b7-740b-11e5-b7c2-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Abu Dabi, Emiratos Árabes Unidos",
        "subtitle": null,
        "type": "location",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/6e4559b7-740b-11e5-b7c2-0684985cbbe3/6e4559b7-740b-11e5-b7c2-0684985cbbe3_36_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/6e4559b7-740b-11e5-b7c2-0684985cbbe3/6e4559b7-740b-11e5-b7c2-0684985cbbe3_36_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "europcar-abudhabi.com",
                "url": "http://www.europcar-abudhabi.com/pages/about-abu-dhabi",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "products": [],
        "relations": []
    }, {
        "card_id": "f518deff-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "I am Woman",
        "subtitle": "Sarah Jessica Parker",
        "type": "song",
        "image": null,
        "has_content": true,
        "products": [],
        "relations": [{
            "type": "single",
            "content_type": "is_part_of",
            "data": [{
                "card_id": "f4ced13f-1e76-11e6-97ac-0684985cbbe3",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "BSO",
                "subtitle": "Sexo en Nueva York 2",
                "type": "ost",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f4ced13f-1e76-11e6-97ac-0684985cbbe3/f4ced13f-1e76-11e6-97ac-0684985cbbe3_9_es_ES_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f4ced13f-1e76-11e6-97ac-0684985cbbe3/f4ced13f-1e76-11e6-97ac-0684985cbbe3_9_es_ES_full_m.jpg",
                    "anchor_x": 50,
                    "anchor_y": 50,
                    "source": {
                        "name": "TMDb",
                        "url": "https://www.themoviedb.org/movie/37786",
                        "disclaimer": "This product uses the TMDb API but is not endorsed or certified by TMDb.",
                        "image": "https://cdn.touchvie.com/img/sources/ico_the_movie_db.png"
                    }
                },
                "has_content": true
            }],
            "size": 1
        }]
    },
    {
        "card_id": "f0913395-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Charlotte York",
        "subtitle": null,
        "type": "character",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 68,
            "anchor_y": 53,
            "source": {
                "name": "perfectlypolishedmk.blogspot.com.es",
                "url": "http://perfectlypolishedmk.blogspot.com.es/2014/07/charlotte-york-true-romantic.html",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "products": [],
        "relations": [{
            "type": "single",
            "content_type": "wears",
            "data": [{
                "card_id": "f0d1b270-1e76-11e6-97ac-0684985cbbe3",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Look Yves Sain Laurent Vintage Evening Gown",
                "subtitle": null,
                "type": "look",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0d1b270-1e76-11e6-97ac-0684985cbbe3/f0d1b270-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0d1b270-1e76-11e6-97ac-0684985cbbe3/f0d1b270-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                    "anchor_x": 51,
                    "anchor_y": 77,
                    "source": {
                        "name": "img.thetake.com",
                        "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true,
                "relations": [{
                    "type": "single",
                    "content_type": "look_fashion",
                    "data": [{
                        "card_id": "e4f0b2c3-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Anillo Plateado Con Brillantes",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 55,
                            "anchor_y": 44,
                            "source": {
                                "name": "El Corte Inglés Fashion",
                                "url": "http://click.pump.to/fm-d0360/rZIxa8MwEIX~ynGzFcsxcmMXCiHtkEK7dPUi25dGQbaMZGNM6X-vrDQUOnRIAxrEPd1730n6wNFqLPA4DH1RxmU8TdOKdG3sQKp71-RW5Mq4NY0s422Scp7fiQ1zRqtBWmVYO57IskbJVnYDhY3pGseqmZFmwYedjcoYIzxgkWY8QoVFslnnEfZYiExEWPvCOsIOi6Vod6Yhj8V54leW8SQRQuS4SK-yXaS3CwIEBLggwOM3AlQzPGnYLQiw9wjlyDnlLpio2nukieAhTA7e8MXPCDPIuiZnvK-DB3g2M9nQFzRL2pzoD-GMcjRtZQkIVHfwSEr~bgjH7q8PvEm~L247pbVx~3C6bvSf6OVL9P7-941~-M8v",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8ad74ab-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Yves Saint Laurent Vintage Evening Gown",
                        "subtitle": "Vestido Largo De Paillettes Negro",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 51,
                            "anchor_y": 77,
                            "source": {
                                "name": "img.thetake.com",
                                "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e5267fcf-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Harry Winston Emerald Cut Diamond Ring",
                        "subtitle": "Anillo De Compromiso Con Diamante Cuadrado",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 47,
                            "anchor_y": 45,
                            "source": {
                                "name": "thejewelleryeditor.com",
                                "url": "http://www.thejewelleryeditor.com/",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8a9648d-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Blu By Betty Lou Moscot Diamond Tranquility Earrings",
                        "subtitle": "Pendientes Plateados Con Brillantes",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "wcjewelry.com",
                                "url": "http://www.wcjewelry.com/blu.html",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8b15982-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pulsera Ancha Plateada",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "YOOX",
                                "url": "http://www.yoox.com/ES/50175567/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2234649499706811392&fromMobile=1#cod10=50175567BR&sizeId=1",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 5
                }, {
                    "type": "single",
                    "content_type": "worn_by",
                    "data": [{
                        "card_id": "f0913395-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Charlotte York",
                        "subtitle": null,
                        "type": "character",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 68,
                            "anchor_y": 53,
                            "source": {
                                "name": "perfectlypolishedmk.blogspot.com.es",
                                "url": "http://perfectlypolishedmk.blogspot.com.es/2014/07/charlotte-york-true-romantic.html",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 1
                }]
            }],
            "size": 1
        }, {
            "type": "single",
            "content_type": "played_by",
            "data": [{
                "card_id": "7e101411-399b-36d1-8475-266109fdaa3e",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Kristin Davis",
                "subtitle": null,
                "type": "person",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/7e101411-399b-36d1-8475-266109fdaa3e/7e101411-399b-36d1-8475-266109fdaa3e_4_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/7e101411-399b-36d1-8475-266109fdaa3e/7e101411-399b-36d1-8475-266109fdaa3e_4_full_m.jpg",
                    "anchor_x": 45,
                    "anchor_y": 39,
                    "source": {
                        "name": "twitter.com",
                        "url": "https://twitter.com/kristindavis",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true
            }],
            "size": 1
        }]
    }, {
        "card_id": "e4f0b2c3-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Anillo Plateado Con Brillantes",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 55,
            "anchor_y": 44,
            "source": {
                "name": "El Corte Inglés Fashion",
                "url": "http://click.pump.to/fm-d0360/rZIxa8MwEIX~ynGzFcsxcmMXCiHtkEK7dPUi25dGQbaMZGNM6X-vrDQUOnRIAxrEPd1730n6wNFqLPA4DH1RxmU8TdOKdG3sQKp71-RW5Mq4NY0s422Scp7fiQ1zRqtBWmVYO57IskbJVnYDhY3pGseqmZFmwYedjcoYIzxgkWY8QoVFslnnEfZYiExEWPvCOsIOi6Vod6Yhj8V54leW8SQRQuS4SK-yXaS3CwIEBLggwOM3AlQzPGnYLQiw9wjlyDnlLpio2nukieAhTA7e8MXPCDPIuiZnvK-DB3g2M9nQFzRL2pzoD-GMcjRtZQkIVHfwSEr~bgjH7q8PvEm~L247pbVx~3C6bvSf6OVL9P7-941~-M8v",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 0
    }, {
        "card_id": "e8ad74ab-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Yves Saint Laurent Vintage Evening Gown",
        "subtitle": "Vestido Largo De Paillettes Negro",
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 51,
            "anchor_y": 77,
            "source": {
                "name": "img.thetake.com",
                "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 1
    }, {
        "card_id": "e5267fcf-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Harry Winston Emerald Cut Diamond Ring",
        "subtitle": "Anillo De Compromiso Con Diamante Cuadrado",
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 47,
            "anchor_y": 45,
            "source": {
                "name": "thejewelleryeditor.com",
                "url": "http://www.thejewelleryeditor.com/",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 2
    }, {
        "type": "moreRelations",
        "card": {
            "card_id": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Charlotte York",
            "subtitle": null,
            "type": "character",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 68,
                "anchor_y": 53,
                "source": {
                    "name": "perfectlypolishedmk.blogspot.com.es",
                    "url": "http://perfectlypolishedmk.blogspot.com.es/2014/07/charlotte-york-true-romantic.html",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "products": [],
            "relations": [{
                "type": "single",
                "content_type": "wears",
                "data": [{
                    "card_id": "f0d1b270-1e76-11e6-97ac-0684985cbbe3",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Look Yves Sain Laurent Vintage Evening Gown",
                    "subtitle": null,
                    "type": "look",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0d1b270-1e76-11e6-97ac-0684985cbbe3/f0d1b270-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0d1b270-1e76-11e6-97ac-0684985cbbe3/f0d1b270-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                        "anchor_x": 51,
                        "anchor_y": 77,
                        "source": {
                            "name": "img.thetake.com",
                            "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true,
                    "relations": [{
                        "type": "single",
                        "content_type": "look_fashion",
                        "data": [{
                            "card_id": "e4f0b2c3-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Anillo Plateado Con Brillantes",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 55,
                                "anchor_y": 44,
                                "source": {
                                    "name": "El Corte Inglés Fashion",
                                    "url": "http://click.pump.to/fm-d0360/rZIxa8MwEIX~ynGzFcsxcmMXCiHtkEK7dPUi25dGQbaMZGNM6X-vrDQUOnRIAxrEPd1730n6wNFqLPA4DH1RxmU8TdOKdG3sQKp71-RW5Mq4NY0s422Scp7fiQ1zRqtBWmVYO57IskbJVnYDhY3pGseqmZFmwYedjcoYIzxgkWY8QoVFslnnEfZYiExEWPvCOsIOi6Vod6Yhj8V54leW8SQRQuS4SK-yXaS3CwIEBLggwOM3AlQzPGnYLQiw9wjlyDnlLpio2nukieAhTA7e8MXPCDPIuiZnvK-DB3g2M9nQFzRL2pzoD-GMcjRtZQkIVHfwSEr~bgjH7q8PvEm~L247pbVx~3C6bvSf6OVL9P7-941~-M8v",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8ad74ab-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Yves Saint Laurent Vintage Evening Gown",
                            "subtitle": "Vestido Largo De Paillettes Negro",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 51,
                                "anchor_y": 77,
                                "source": {
                                    "name": "img.thetake.com",
                                    "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e5267fcf-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Harry Winston Emerald Cut Diamond Ring",
                            "subtitle": "Anillo De Compromiso Con Diamante Cuadrado",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 47,
                                "anchor_y": 45,
                                "source": {
                                    "name": "thejewelleryeditor.com",
                                    "url": "http://www.thejewelleryeditor.com/",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8a9648d-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Blu By Betty Lou Moscot Diamond Tranquility Earrings",
                            "subtitle": "Pendientes Plateados Con Brillantes",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "wcjewelry.com",
                                    "url": "http://www.wcjewelry.com/blu.html",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8b15982-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Pulsera Ancha Plateada",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "YOOX",
                                    "url": "http://www.yoox.com/ES/50175567/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2234649499706811392&fromMobile=1#cod10=50175567BR&sizeId=1",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 5
                    }, {
                        "type": "single",
                        "content_type": "worn_by",
                        "data": [{
                            "card_id": "f0913395-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Charlotte York",
                            "subtitle": null,
                            "type": "character",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f0913395-1e76-11e6-97ac-0684985cbbe3/f0913395-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 68,
                                "anchor_y": 53,
                                "source": {
                                    "name": "perfectlypolishedmk.blogspot.com.es",
                                    "url": "http://perfectlypolishedmk.blogspot.com.es/2014/07/charlotte-york-true-romantic.html",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 1
                    }]
                }],
                "size": 1
            }, {
                "type": "single",
                "content_type": "played_by",
                "data": [{
                    "card_id": "7e101411-399b-36d1-8475-266109fdaa3e",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Kristin Davis",
                    "subtitle": null,
                    "type": "person",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/7e101411-399b-36d1-8475-266109fdaa3e/7e101411-399b-36d1-8475-266109fdaa3e_4_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/7e101411-399b-36d1-8475-266109fdaa3e/7e101411-399b-36d1-8475-266109fdaa3e_4_full_m.jpg",
                        "anchor_x": 45,
                        "anchor_y": 39,
                        "source": {
                            "name": "twitter.com",
                            "url": "https://twitter.com/kristindavis",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true
                }],
                "size": 1
            }]
        },
        "cards": [{
            "card_id": "e4f0b2c3-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Anillo Plateado Con Brillantes",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3/e4f0b2c3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 55,
                "anchor_y": 44,
                "source": {
                    "name": "El Corte Inglés Fashion",
                    "url": "http://click.pump.to/fm-d0360/rZIxa8MwEIX~ynGzFcsxcmMXCiHtkEK7dPUi25dGQbaMZGNM6X-vrDQUOnRIAxrEPd1730n6wNFqLPA4DH1RxmU8TdOKdG3sQKp71-RW5Mq4NY0s422Scp7fiQ1zRqtBWmVYO57IskbJVnYDhY3pGseqmZFmwYedjcoYIzxgkWY8QoVFslnnEfZYiExEWPvCOsIOi6Vod6Yhj8V54leW8SQRQuS4SK-yXaS3CwIEBLggwOM3AlQzPGnYLQiw9wjlyDnlLpio2nukieAhTA7e8MXPCDPIuiZnvK-DB3g2M9nQFzRL2pzoD-GMcjRtZQkIVHfwSEr~bgjH7q8PvEm~L247pbVx~3C6bvSf6OVL9P7-941~-M8v",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 0
        }, {
            "card_id": "e8ad74ab-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Yves Saint Laurent Vintage Evening Gown",
            "subtitle": "Vestido Largo De Paillettes Negro",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8ad74ab-1e76-11e6-97ac-0684985cbbe3/e8ad74ab-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 51,
                "anchor_y": 77,
                "source": {
                    "name": "img.thetake.com",
                    "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/b73a4a6fa7fe0ce8d7f9efd9f3f94801c27fc1b99229e7c86bc1c5658124e848.jpg",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 1
        }, {
            "card_id": "e5267fcf-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Harry Winston Emerald Cut Diamond Ring",
            "subtitle": "Anillo De Compromiso Con Diamante Cuadrado",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e5267fcf-1e76-11e6-97ac-0684985cbbe3/e5267fcf-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 47,
                "anchor_y": 45,
                "source": {
                    "name": "thejewelleryeditor.com",
                    "url": "http://www.thejewelleryeditor.com/",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 2
        }, {
            "card_id": "e8a9648d-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Blu By Betty Lou Moscot Diamond Tranquility Earrings",
            "subtitle": "Pendientes Plateados Con Brillantes",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a9648d-1e76-11e6-97ac-0684985cbbe3/e8a9648d-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "wcjewelry.com",
                    "url": "http://www.wcjewelry.com/blu.html",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 3
        }, {
            "card_id": "e8b15982-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Pulsera Ancha Plateada",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8b15982-1e76-11e6-97ac-0684985cbbe3/e8b15982-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "YOOX",
                    "url": "http://www.yoox.com/ES/50175567/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2234649499706811392&fromMobile=1#cod10=50175567BR&sizeId=1",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f0913395-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 4
        }]
    }, {
        "card_id": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Carrie Bradshaw",
        "subtitle": null,
        "type": "character",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 63,
            "anchor_y": 31,
            "source": {
                "name": "showbizgeek.com",
                "url": "http://showbizgeek.com/quick-quiz-631/",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "products": [],
        "relations": [{
            "type": "single",
            "content_type": "wears",
            "data": [{
                "card_id": "f056c692-1e76-11e6-97ac-0684985cbbe3",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Look Stella McCartney Nude Semi Sheer Silk Shirt",
                "subtitle": null,
                "type": "look",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f056c692-1e76-11e6-97ac-0684985cbbe3/f056c692-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f056c692-1e76-11e6-97ac-0684985cbbe3/f056c692-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                    "anchor_x": 50,
                    "anchor_y": 50,
                    "source": {
                        "name": "img.thetake.com",
                        "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/39b56390a49ffed5a56d742226350b3adcc4d2757adc2be82237dc25e8e356cd.jpeg",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true,
                "relations": [{
                    "type": "single",
                    "content_type": "look_fashion",
                    "data": [{
                        "card_id": "e2201b6f-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Christian Louboutin Pigalle Gold Stiletto Shoes",
                        "subtitle": "Zapatos De Tacón Alto Dorados",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "us.christianlouboutin.com",
                                "url": "http://us.christianlouboutin.com/us_en/shop-online-3/women-1/women/pumps.html",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Alianza Dorada",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "El Corte Inglés",
                                "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e46d3937-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Diadema De Piedras Preciosas Blanca",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 55,
                            "anchor_y": 4,
                            "source": {
                                "name": "images.asos-media.com",
                                "url": "http://images.asos-media.com/inv/media/3/9/9/6/6286993/silver/image1xxl.jpg",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8a19fe3-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pantalones Vaqueros Largos",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "cdn.yoox.biz",
                                "url": "http://cdn.yoox.biz/42/42473429HJ_12_F.JPG",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e89db51f-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Chanel Long Skirt",
                        "subtitle": "Falda Larga Dorada",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 44,
                            "anchor_y": 89,
                            "source": {
                                "name": "The Take",
                                "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8a5bed3-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Raven Kauffman Gold Metallic Lambskin Emu Feather Clutch",
                        "subtitle": "Clutch Negro Con Plumas",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "cdnc.lystit.com",
                                "url": "https://cdnc.lystit.com/photos/2010/10/27/raven-kauffman-couture-purple-lambskin-emu-feather-swarov-shoulder-bag-leather-product-2.jpeg",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e899945e-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pulsera Fina Dorada",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "cdn.yoox.biz",
                                "url": "http://cdn.yoox.biz/50/50170621KB_12_F.JPG",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e895a4b8-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Stella McCartney Nude Semi Sheer Silk Shirt",
                        "subtitle": "Blusa De Seda Beige",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "stellamccartney.com",
                                "url": "https://stellamccartney.com",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 8
                }, {
                    "type": "single",
                    "content_type": "worn_by",
                    "data": [{
                        "card_id": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Carrie Bradshaw",
                        "subtitle": null,
                        "type": "character",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 63,
                            "anchor_y": 31,
                            "source": {
                                "name": "showbizgeek.com",
                                "url": "http://showbizgeek.com/quick-quiz-631/",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 1
                }]
            }],
            "size": 1
        }, {
            "type": "single",
            "content_type": "played_by",
            "data": [{
                "card_id": "28e7cb52-01a2-3e95-a71f-4fc2d3e46f86",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Sarah Jessica Parker",
                "subtitle": null,
                "type": "person",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86_10_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86_10_full_m.jpg",
                    "anchor_x": 44,
                    "anchor_y": 36,
                    "source": {
                        "name": "erikatipoweb.com",
                        "url": "http://erikatipoweb.com/como-ser-tu-jefa-interior-segun-sarah-jessica-parker/",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true
            }],
            "size": 1
        }]
    }, {
        "card_id": "e2201b6f-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Christian Louboutin Pigalle Gold Stiletto Shoes",
        "subtitle": "Zapatos De Tacón Alto Dorados",
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "us.christianlouboutin.com",
                "url": "http://us.christianlouboutin.com/us_en/shop-online-3/women-1/women/pumps.html",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 0
    }, {
        "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Alianza Dorada",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "El Corte Inglés",
                "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 1
    }, {
        "card_id": "e46d3937-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Diadema De Piedras Preciosas Blanca",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 55,
            "anchor_y": 4,
            "source": {
                "name": "images.asos-media.com",
                "url": "http://images.asos-media.com/inv/media/3/9/9/6/6286993/silver/image1xxl.jpg",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 2
    }, {
        "type": "moreRelations",
        "card": {
            "card_id": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Carrie Bradshaw",
            "subtitle": null,
            "type": "character",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 63,
                "anchor_y": 31,
                "source": {
                    "name": "showbizgeek.com",
                    "url": "http://showbizgeek.com/quick-quiz-631/",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "products": [],
            "relations": [{
                "type": "single",
                "content_type": "wears",
                "data": [{
                    "card_id": "f056c692-1e76-11e6-97ac-0684985cbbe3",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Look Stella McCartney Nude Semi Sheer Silk Shirt",
                    "subtitle": null,
                    "type": "look",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f056c692-1e76-11e6-97ac-0684985cbbe3/f056c692-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f056c692-1e76-11e6-97ac-0684985cbbe3/f056c692-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                        "anchor_x": 50,
                        "anchor_y": 50,
                        "source": {
                            "name": "img.thetake.com",
                            "url": "http://192.168.17.47:3000/proxy?url=https://img.thetake.com/product_images/39b56390a49ffed5a56d742226350b3adcc4d2757adc2be82237dc25e8e356cd.jpeg",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true,
                    "relations": [{
                        "type": "single",
                        "content_type": "look_fashion",
                        "data": [{
                            "card_id": "e2201b6f-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Christian Louboutin Pigalle Gold Stiletto Shoes",
                            "subtitle": "Zapatos De Tacón Alto Dorados",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "us.christianlouboutin.com",
                                    "url": "http://us.christianlouboutin.com/us_en/shop-online-3/women-1/women/pumps.html",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Alianza Dorada",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "El Corte Inglés",
                                    "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e46d3937-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Diadema De Piedras Preciosas Blanca",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 55,
                                "anchor_y": 4,
                                "source": {
                                    "name": "images.asos-media.com",
                                    "url": "http://images.asos-media.com/inv/media/3/9/9/6/6286993/silver/image1xxl.jpg",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8a19fe3-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Pantalones Vaqueros Largos",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "cdn.yoox.biz",
                                    "url": "http://cdn.yoox.biz/42/42473429HJ_12_F.JPG",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e89db51f-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Chanel Long Skirt",
                            "subtitle": "Falda Larga Dorada",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 44,
                                "anchor_y": 89,
                                "source": {
                                    "name": "The Take",
                                    "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8a5bed3-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Raven Kauffman Gold Metallic Lambskin Emu Feather Clutch",
                            "subtitle": "Clutch Negro Con Plumas",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "cdnc.lystit.com",
                                    "url": "https://cdnc.lystit.com/photos/2010/10/27/raven-kauffman-couture-purple-lambskin-emu-feather-swarov-shoulder-bag-leather-product-2.jpeg",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e899945e-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Pulsera Fina Dorada",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "cdn.yoox.biz",
                                    "url": "http://cdn.yoox.biz/50/50170621KB_12_F.JPG",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e895a4b8-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Stella McCartney Nude Semi Sheer Silk Shirt",
                            "subtitle": "Blusa De Seda Beige",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "stellamccartney.com",
                                    "url": "https://stellamccartney.com",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 8
                    }, {
                        "type": "single",
                        "content_type": "worn_by",
                        "data": [{
                            "card_id": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Carrie Bradshaw",
                            "subtitle": null,
                            "type": "character",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/efedb82c-1e76-11e6-97ac-0684985cbbe3/efedb82c-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 63,
                                "anchor_y": 31,
                                "source": {
                                    "name": "showbizgeek.com",
                                    "url": "http://showbizgeek.com/quick-quiz-631/",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 1
                    }]
                }],
                "size": 1
            }, {
                "type": "single",
                "content_type": "played_by",
                "data": [{
                    "card_id": "28e7cb52-01a2-3e95-a71f-4fc2d3e46f86",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Sarah Jessica Parker",
                    "subtitle": null,
                    "type": "person",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86_10_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86/28e7cb52-01a2-3e95-a71f-4fc2d3e46f86_10_full_m.jpg",
                        "anchor_x": 44,
                        "anchor_y": 36,
                        "source": {
                            "name": "erikatipoweb.com",
                            "url": "http://erikatipoweb.com/como-ser-tu-jefa-interior-segun-sarah-jessica-parker/",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true
                }],
                "size": 1
            }]
        },
        "cards": [{
            "card_id": "e2201b6f-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Christian Louboutin Pigalle Gold Stiletto Shoes",
            "subtitle": "Zapatos De Tacón Alto Dorados",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e2201b6f-1e76-11e6-97ac-0684985cbbe3/e2201b6f-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "us.christianlouboutin.com",
                    "url": "http://us.christianlouboutin.com/us_en/shop-online-3/women-1/women/pumps.html",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 0
        }, {
            "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Alianza Dorada",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "El Corte Inglés",
                    "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 1
        }, {
            "card_id": "e46d3937-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Diadema De Piedras Preciosas Blanca",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e46d3937-1e76-11e6-97ac-0684985cbbe3/e46d3937-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 55,
                "anchor_y": 4,
                "source": {
                    "name": "images.asos-media.com",
                    "url": "http://images.asos-media.com/inv/media/3/9/9/6/6286993/silver/image1xxl.jpg",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 2
        }, {
            "card_id": "e8a19fe3-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Pantalones Vaqueros Largos",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a19fe3-1e76-11e6-97ac-0684985cbbe3/e8a19fe3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "cdn.yoox.biz",
                    "url": "http://cdn.yoox.biz/42/42473429HJ_12_F.JPG",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 3
        }, {
            "card_id": "e89db51f-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Chanel Long Skirt",
            "subtitle": "Falda Larga Dorada",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e89db51f-1e76-11e6-97ac-0684985cbbe3/e89db51f-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 44,
                "anchor_y": 89,
                "source": {
                    "name": "The Take",
                    "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 4
        }, {
            "card_id": "e8a5bed3-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Raven Kauffman Gold Metallic Lambskin Emu Feather Clutch",
            "subtitle": "Clutch Negro Con Plumas",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8a5bed3-1e76-11e6-97ac-0684985cbbe3/e8a5bed3-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "cdnc.lystit.com",
                    "url": "https://cdnc.lystit.com/photos/2010/10/27/raven-kauffman-couture-purple-lambskin-emu-feather-swarov-shoulder-bag-leather-product-2.jpeg",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 5
        }, {
            "card_id": "e899945e-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Pulsera Fina Dorada",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e899945e-1e76-11e6-97ac-0684985cbbe3/e899945e-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "cdn.yoox.biz",
                    "url": "http://cdn.yoox.biz/50/50170621KB_12_F.JPG",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 6
        }, {
            "card_id": "e895a4b8-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Stella McCartney Nude Semi Sheer Silk Shirt",
            "subtitle": "Blusa De Seda Beige",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e895a4b8-1e76-11e6-97ac-0684985cbbe3/e895a4b8-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "stellamccartney.com",
                    "url": "https://stellamccartney.com",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "efedb82c-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 7
        }]
    }, {
        "card_id": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Miranda Hobbes",
        "subtitle": null,
        "type": "character",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 31,
            "source": {
                "name": "www.hbo.com",
                "url": "http://www.hbo.com/sex-and-the-city/inside/the-look/slideshow/miranda-hobbes.html?autoplay=true&amp;index=3",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "products": [],
        "relations": [{
            "type": "single",
            "content_type": "wears",
            "data": [{
                "card_id": "f20729e1-1e76-11e6-97ac-0684985cbbe3",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Look Halston Emerald Green Sequin Gown",
                "subtitle": null,
                "type": "look",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f20729e1-1e76-11e6-97ac-0684985cbbe3/f20729e1-1e76-11e6-97ac-0684985cbbe3_2_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f20729e1-1e76-11e6-97ac-0684985cbbe3/f20729e1-1e76-11e6-97ac-0684985cbbe3_2_full_m.jpg",
                    "anchor_x": 50,
                    "anchor_y": 50,
                    "source": {
                        "name": "The Take",
                        "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true,
                "relations": [{
                    "type": "single",
                    "content_type": "look_fashion",
                    "data": [{
                        "card_id": "e87d1d72-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Halston Emerald Green Sequin Gown",
                        "subtitle": "Vestido Largo De Manga Corta De Lentejuelas Verde",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                            "anchor_x": 52,
                            "anchor_y": 35,
                            "source": {
                                "name": "The Take",
                                "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Alianza Dorada",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "El Corte Inglés",
                                "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e880feb3-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Cinturón Dorado",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "YOOX",
                                "url": "http://www.yoox.com/ES/46448017/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235765618933046272&fromMobile=1#cod10=46448017FG&sizeId=5",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e88968d5-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pulsera Dorada",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "El Corte Inglés",
                                "url": "http://www.elcorteingles.es/moda/A17227011-pulsera-tommy-hilfiger-de-acero-dorado/",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e8859968-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pendientes De Aro Dorado",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 65,
                            "anchor_y": 44,
                            "source": {
                                "name": "YOOX",
                                "url": "http://www.yoox.com/ES/50174541/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235764876276798464&fromMobile=1#cod10=50174541FU&sizeId=1",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 5
                }, {
                    "type": "single",
                    "content_type": "worn_by",
                    "data": [{
                        "card_id": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Miranda Hobbes",
                        "subtitle": null,
                        "type": "character",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 31,
                            "source": {
                                "name": "www.hbo.com",
                                "url": "http://www.hbo.com/sex-and-the-city/inside/the-look/slideshow/miranda-hobbes.html?autoplay=true&amp;index=3",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 1
                }]
            }],
            "size": 1
        }, {
            "type": "single",
            "content_type": "played_by",
            "data": [{
                "card_id": "e0fdaf41-f137-3069-b716-66763e6da9aa",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Cynthia Nixon",
                "subtitle": null,
                "type": "person",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e0fdaf41-f137-3069-b716-66763e6da9aa/e0fdaf41-f137-3069-b716-66763e6da9aa_2_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e0fdaf41-f137-3069-b716-66763e6da9aa/e0fdaf41-f137-3069-b716-66763e6da9aa_2_full_m.jpg",
                    "anchor_x": 57,
                    "anchor_y": 33,
                    "source": {
                        "name": "eva.hn",
                        "url": "http://eva.hn/fotogalerias/famosos-que-cumplen-50-este-ano/attachment/cynthia-nixon/",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true
            }],
            "size": 1
        }]
    }, {
        "card_id": "e87d1d72-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Halston Emerald Green Sequin Gown",
        "subtitle": "Vestido Largo De Manga Corta De Lentejuelas Verde",
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
            "anchor_x": 52,
            "anchor_y": 35,
            "source": {
                "name": "The Take",
                "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 0
    }, {
        "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Alianza Dorada",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "El Corte Inglés",
                "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 1
    }, {
        "card_id": "e880feb3-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Cinturón Dorado",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "YOOX",
                "url": "http://www.yoox.com/ES/46448017/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235765618933046272&fromMobile=1#cod10=46448017FG&sizeId=5",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 2
    }, {
        "type": "moreRelations",
        "card": {
            "card_id": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Miranda Hobbes",
            "subtitle": null,
            "type": "character",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 31,
                "source": {
                    "name": "www.hbo.com",
                    "url": "http://www.hbo.com/sex-and-the-city/inside/the-look/slideshow/miranda-hobbes.html?autoplay=true&amp;index=3",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "products": [],
            "relations": [{
                "type": "single",
                "content_type": "wears",
                "data": [{
                    "card_id": "f20729e1-1e76-11e6-97ac-0684985cbbe3",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Look Halston Emerald Green Sequin Gown",
                    "subtitle": null,
                    "type": "look",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f20729e1-1e76-11e6-97ac-0684985cbbe3/f20729e1-1e76-11e6-97ac-0684985cbbe3_2_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f20729e1-1e76-11e6-97ac-0684985cbbe3/f20729e1-1e76-11e6-97ac-0684985cbbe3_2_full_m.jpg",
                        "anchor_x": 50,
                        "anchor_y": 50,
                        "source": {
                            "name": "The Take",
                            "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true,
                    "relations": [{
                        "type": "single",
                        "content_type": "look_fashion",
                        "data": [{
                            "card_id": "e87d1d72-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Halston Emerald Green Sequin Gown",
                            "subtitle": "Vestido Largo De Manga Corta De Lentejuelas Verde",
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                                "anchor_x": 52,
                                "anchor_y": 35,
                                "source": {
                                    "name": "The Take",
                                    "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Alianza Dorada",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "El Corte Inglés",
                                    "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e880feb3-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Cinturón Dorado",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "YOOX",
                                    "url": "http://www.yoox.com/ES/46448017/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235765618933046272&fromMobile=1#cod10=46448017FG&sizeId=5",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e88968d5-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Pulsera Dorada",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 50,
                                "source": {
                                    "name": "El Corte Inglés",
                                    "url": "http://www.elcorteingles.es/moda/A17227011-pulsera-tommy-hilfiger-de-acero-dorado/",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }, {
                            "card_id": "e8859968-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Pendientes De Aro Dorado",
                            "subtitle": null,
                            "type": "fashion",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                                "anchor_x": 65,
                                "anchor_y": 44,
                                "source": {
                                    "name": "YOOX",
                                    "url": "http://www.yoox.com/ES/50174541/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235764876276798464&fromMobile=1#cod10=50174541FU&sizeId=1",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 5
                    }, {
                        "type": "single",
                        "content_type": "worn_by",
                        "data": [{
                            "card_id": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
                            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                            "locale": "es_ES",
                            "title": "Miranda Hobbes",
                            "subtitle": null,
                            "type": "character",
                            "image": {
                                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3/f1c7c9d4-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                                "anchor_x": 50,
                                "anchor_y": 31,
                                "source": {
                                    "name": "www.hbo.com",
                                    "url": "http://www.hbo.com/sex-and-the-city/inside/the-look/slideshow/miranda-hobbes.html?autoplay=true&amp;index=3",
                                    "disclaimer": null,
                                    "image": null
                                }
                            },
                            "has_content": true
                        }],
                        "size": 1
                    }]
                }],
                "size": 1
            }, {
                "type": "single",
                "content_type": "played_by",
                "data": [{
                    "card_id": "e0fdaf41-f137-3069-b716-66763e6da9aa",
                    "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                    "locale": "es_ES",
                    "title": "Cynthia Nixon",
                    "subtitle": null,
                    "type": "person",
                    "image": {
                        "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e0fdaf41-f137-3069-b716-66763e6da9aa/e0fdaf41-f137-3069-b716-66763e6da9aa_2_thumb_m.jpg",
                        "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e0fdaf41-f137-3069-b716-66763e6da9aa/e0fdaf41-f137-3069-b716-66763e6da9aa_2_full_m.jpg",
                        "anchor_x": 57,
                        "anchor_y": 33,
                        "source": {
                            "name": "eva.hn",
                            "url": "http://eva.hn/fotogalerias/famosos-que-cumplen-50-este-ano/attachment/cynthia-nixon/",
                            "disclaimer": null,
                            "image": null
                        }
                    },
                    "has_content": true
                }],
                "size": 1
            }]
        },
        "cards": [{
            "card_id": "e87d1d72-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Halston Emerald Green Sequin Gown",
            "subtitle": "Vestido Largo De Manga Corta De Lentejuelas Verde",
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e87d1d72-1e76-11e6-97ac-0684985cbbe3/e87d1d72-1e76-11e6-97ac-0684985cbbe3_3_full_m.jpg",
                "anchor_x": 52,
                "anchor_y": 35,
                "source": {
                    "name": "The Take",
                    "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 0
        }, {
            "card_id": "e4e97588-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Alianza Dorada",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e4e97588-1e76-11e6-97ac-0684985cbbe3/e4e97588-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "El Corte Inglés",
                    "url": "http://www.elcorteingles.es/moda/A18485313-alianza-en-oro-el-corte-ingles/",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 1
        }, {
            "card_id": "e880feb3-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Cinturón Dorado",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e880feb3-1e76-11e6-97ac-0684985cbbe3/e880feb3-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "YOOX",
                    "url": "http://www.yoox.com/ES/46448017/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235765618933046272&fromMobile=1#cod10=46448017FG&sizeId=5",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 2
        }, {
            "card_id": "e88968d5-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Pulsera Dorada",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e88968d5-1e76-11e6-97ac-0684985cbbe3/e88968d5-1e76-11e6-97ac-0684985cbbe3_2_full_m.jpg",
                "anchor_x": 50,
                "anchor_y": 50,
                "source": {
                    "name": "El Corte Inglés",
                    "url": "http://www.elcorteingles.es/moda/A17227011-pulsera-tommy-hilfiger-de-acero-dorado/",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 3
        }, {
            "card_id": "e8859968-1e76-11e6-97ac-0684985cbbe3",
            "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
            "locale": "es_ES",
            "title": "Pendientes De Aro Dorado",
            "subtitle": null,
            "type": "fashion",
            "image": {
                "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e8859968-1e76-11e6-97ac-0684985cbbe3/e8859968-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                "anchor_x": 65,
                "anchor_y": 44,
                "source": {
                    "name": "YOOX",
                    "url": "http://www.yoox.com/ES/50174541/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2235764876276798464&fromMobile=1#cod10=50174541FU&sizeId=1",
                    "disclaimer": null,
                    "image": null
                }
            },
            "has_content": true,
            "parentId": "f1c7c9d4-1e76-11e6-97ac-0684985cbbe3",
            "childIndex": 4
        }]
    }, {
        "card_id": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Samantha Jones",
        "subtitle": null,
        "type": "character",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
            "anchor_x": 43,
            "anchor_y": 42,
            "source": {
                "name": "www.harpersbazaar.es",
                "url": "http://www.harpersbazaar.es/cultura/ocio/samantha-jones-en-25-frases",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "products": [],
        "relations": [{
            "type": "single",
            "content_type": "wears",
            "data": [{
                "card_id": "f3325faa-1e76-11e6-97ac-0684985cbbe3",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Look The Blonds Spiked Shoulders Jersey Dress",
                "subtitle": null,
                "type": "look",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f3325faa-1e76-11e6-97ac-0684985cbbe3/f3325faa-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f3325faa-1e76-11e6-97ac-0684985cbbe3/f3325faa-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                    "anchor_x": 50,
                    "anchor_y": 50,
                    "source": {
                        "name": "coolspotters.com",
                        "url": "http://coolspotters.com/files/photos/262972/the-blonds-silk-jersey-dress-with-spiked-shoulders-profile.jpg",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true,
                "relations": [{
                    "type": "single",
                    "content_type": "look_fashion",
                    "data": [{
                        "card_id": "e86427fc-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "The Blonds Spiked Shoulders Jersey Dress",
                        "subtitle": "Vestido Corto De Manga Larga Rojo Con Hombreras",
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e86427fc-1e76-11e6-97ac-0684985cbbe3/e86427fc-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e86427fc-1e76-11e6-97ac-0684985cbbe3/e86427fc-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 50,
                            "anchor_y": 50,
                            "source": {
                                "name": "The Take",
                                "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e870b697-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Pendientes Largos Plateados",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e870b697-1e76-11e6-97ac-0684985cbbe3/e870b697-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e870b697-1e76-11e6-97ac-0684985cbbe3/e870b697-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 62,
                            "anchor_y": 53,
                            "source": {
                                "name": "YOOX",
                                "url": "http://www.yoox.com/ES/50161512/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2234754867992796160&fromMobile=1#cod10=50161512SQ&sizeId=1",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }, {
                        "card_id": "e878f54d-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Sandalias Plateadas",
                        "subtitle": null,
                        "type": "fashion",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e878f54d-1e76-11e6-97ac-0684985cbbe3/e878f54d-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e878f54d-1e76-11e6-97ac-0684985cbbe3/e878f54d-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
                            "anchor_x": 46,
                            "anchor_y": 70,
                            "source": {
                                "name": "Sarenza",
                                "url": "http://www.sarenza.es/steve-madden-stecy-sandal-s820740-p0000118484?fromMobile=1#ectrans=1",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 3
                }, {
                    "type": "single",
                    "content_type": "worn_by",
                    "data": [{
                        "card_id": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3",
                        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                        "locale": "es_ES",
                        "title": "Samantha Jones",
                        "subtitle": null,
                        "type": "character",
                        "image": {
                            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3_0_thumb_m.jpg",
                            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3/f2f4f7ff-1e76-11e6-97ac-0684985cbbe3_0_full_m.jpg",
                            "anchor_x": 43,
                            "anchor_y": 42,
                            "source": {
                                "name": "www.harpersbazaar.es",
                                "url": "http://www.harpersbazaar.es/cultura/ocio/samantha-jones-en-25-frases",
                                "disclaimer": null,
                                "image": null
                            }
                        },
                        "has_content": true
                    }],
                    "size": 1
                }]
            }],
            "size": 1
        }, {
            "type": "single",
            "content_type": "played_by",
            "data": [{
                "card_id": "4e89c948-4587-3aae-869d-c7acb99f28a7",
                "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
                "locale": "es_ES",
                "title": "Kim Cattrall",
                "subtitle": null,
                "type": "person",
                "image": {
                    "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/4e89c948-4587-3aae-869d-c7acb99f28a7/4e89c948-4587-3aae-869d-c7acb99f28a7_5_thumb_m.jpg",
                    "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/4e89c948-4587-3aae-869d-c7acb99f28a7/4e89c948-4587-3aae-869d-c7acb99f28a7_5_full_m.jpg",
                    "anchor_x": 41,
                    "anchor_y": 33,
                    "source": {
                        "name": "medicaldaily.com",
                        "url": "http://www.medicaldaily.com/kim-cattrall-and-pfizer-launch-tune-menopause-campaign-sex-and-city-stars-platform-promote-304600",
                        "disclaimer": null,
                        "image": null
                    }
                },
                "has_content": true
            }],
            "size": 1
        }]
    }, {
        "card_id": "e86427fc-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "The Blonds Spiked Shoulders Jersey Dress",
        "subtitle": "Vestido Corto De Manga Larga Rojo Con Hombreras",
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e86427fc-1e76-11e6-97ac-0684985cbbe3/e86427fc-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e86427fc-1e76-11e6-97ac-0684985cbbe3/e86427fc-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 50,
            "anchor_y": 50,
            "source": {
                "name": "The Take",
                "url": "https://thetake.com/movie/31/sex-and-the-city-2",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 0
    }, {
        "card_id": "e870b697-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Pendientes Largos Plateados",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e870b697-1e76-11e6-97ac-0684985cbbe3/e870b697-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e870b697-1e76-11e6-97ac-0684985cbbe3/e870b697-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 62,
            "anchor_y": 53,
            "source": {
                "name": "YOOX",
                "url": "http://www.yoox.com/ES/50161512/item?tp=7748&utm_source=zanox_es&utm_medium=affiliazione&utm_campaign=affiliazione_es&dept=women&zanpid=2234754867992796160&fromMobile=1#cod10=50161512SQ&sizeId=1",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 1
    }, {
        "card_id": "e878f54d-1e76-11e6-97ac-0684985cbbe3",
        "version": "0jOeUIeLCaOcSI4FSebNj4+WKcK",
        "locale": "es_ES",
        "title": "Sandalias Plateadas",
        "subtitle": null,
        "type": "fashion",
        "image": {
            "thumb": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e878f54d-1e76-11e6-97ac-0684985cbbe3/e878f54d-1e76-11e6-97ac-0684985cbbe3_1_thumb_m.jpg",
            "full": "http://192.168.17.47:3000/proxy?url=https://img.dive.tv/e878f54d-1e76-11e6-97ac-0684985cbbe3/e878f54d-1e76-11e6-97ac-0684985cbbe3_1_full_m.jpg",
            "anchor_x": 46,
            "anchor_y": 70,
            "source": {
                "name": "Sarenza",
                "url": "http://www.sarenza.es/steve-madden-stecy-sandal-s820740-p0000118484?fromMobile=1#ectrans=1",
                "disclaimer": null,
                "image": null
            }
        },
        "has_content": true,
        "parentId": "f2f4f7ff-1e76-11e6-97ac-0684985cbbe3",
        "childIndex": 2
    }
    ] as any,
    demo: "",
    currentTime: 0,
    timeMovie: 0,
    timeMovieSynced: 0,
    timeRatio: 1,
    lastUpdatedTime: 0,
    showInfoMsg: false
};
