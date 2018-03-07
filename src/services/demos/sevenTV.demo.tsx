import { IDemo } from "Services";

export const SevenTV: IDemo = {
  URL: 'www.7tv.de',
  API_KEY: 'N3R2X2VhX3Rlc3Q6ZUpXSG1yUUNTVmVUaG9qd0VIMm01TlF6U2Y5U2hBenY=',
  getId: () => {
    const arr = window.location.href.split('/');
    const chapter = arr.pop();
    const serie = arr.pop();
    return `${serie}_${chapter}`;
  },
  getRefs: () => {
    return {
      videoRef: document.getElementsByTagName('video')[0] as HTMLVideoElement,
      videoParent: document.getElementsByClassName('k-screen')[0] as HTMLElement,
    };
  },
};
