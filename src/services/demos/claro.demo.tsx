import { IDemo } from "Services";

export const Claro: IDemo = {
  URL: "www.clarovideo.com",
  URL2: "www.clarovideo.com.mx",
  getId: () => {
    const pos = window.location.href.search(/=\d{6}/g) + 1;
    return window.location.href.substr(pos, 7);
  },
  getRefs: () => {
    return {
      videoRef: document.getElementById('video') as HTMLVideoElement,
      videoParent: document.getElementsByTagName('vph5-container')[0] as HTMLElement,
    };
  },
};
