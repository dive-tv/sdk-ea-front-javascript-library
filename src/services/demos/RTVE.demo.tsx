import { IDemo } from "Services";

export const RTVE: IDemo = {
  URL: "www.rtve.es",
  getId: () => {
    const pos = window.location.href.search(/\/\d{7}/g) + 1;
    // return window.location.href.substr(pos, 7);
    return "63501863951";
  },
  getRefs: () => {
    return {
      videoRef: document.getElementsByClassName('vjs-tech')[0] as HTMLVideoElement,
      videoParent: document.getElementsByClassName('video-js')[0] as HTMLElement,
    };
  },
}
