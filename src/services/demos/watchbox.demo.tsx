import { IDemo } from "Services";

export const Watchbox: IDemo = {
  URL: 'www.watchbox.de',
  getId: () => {
    let id = '';
    const arr = window.location.href.split('/');
    let title = arr.pop();
    title = title.substr(0, title.length - 5);
    const arrTitle = title.split('-');
    id = arrTitle.pop();
    console.log("[Watchbox] id: ", id);
    return "63501863951";
  },
  getRefs: () => {
    return {
      videoRef: document.getElementById('bitmovinplayer-video-player') as HTMLVideoElement,
      videoParent: document.getElementsByClassName('bitmovinplayer-container')[0] as HTMLDivElement
    };
  },
};
