import { IDemo } from "Services";

export const SevenTV: IDemo = {
  URL: 'www.7tv.de',
  getId: () => {
    const arr = window.location.href.split('/');
    const chapter = arr.pop();
    const serie = arr.pop();
    console.log('[SevenTV] id: ', `${serie}-${chapter}`);
    return "63501863951";
    // return `${serie}-${chapter}`;
  },
  getRefs: () => {
    return {
      videoRef: document.getElementsByTagName('video')[0] as HTMLVideoElement,
      videoParent: document.getElementsByClassName('k-screen')[0] as HTMLElement,
    };
  },
}
