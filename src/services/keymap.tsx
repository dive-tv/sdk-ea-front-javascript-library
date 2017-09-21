declare const KeyEvent: any;
// tslint:disable-next-line:variable-name
const KeyMap_HBBTV = {};

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
};

export const KeyMap = KeyMap_HBBTV;
