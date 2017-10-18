declare const KeyEvent: any;
// tslint:disable-next-line:variable-name
const KeyMap_HBBTV = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    BACK: 27,
    COLOR_YELLOW: 32,
};

export const loadHbbtvKeys = () => {
    if (!KeyEvent) {
        return;
    }
    const km: any = KeyMap_HBBTV;
    km.UP = KeyEvent.VK_UP;
    km.DOWN = KeyEvent.VK_DOWN;
    km.LEFT = KeyEvent.VK_LEFT;
    km.RIGHT = KeyEvent.VK_RIGHT;
    km.ENTER = KeyEvent.VK_ENTER;
    km.BACK = KeyEvent.VK_BACK;
    km.COLOR_YELLOW = KeyEvent.VK_MENU; //VK_YELLOW;
};

export const KeyMap = KeyMap_HBBTV;
