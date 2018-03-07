import { IDemo } from "Services";

declare const Maxdome: any;
export const MaxdomeDemo: IDemo = {
  URL: 'www.maxdome.de',
  API_KEY: 'bWF4ZG9tZV9lYV90ZXN0OjdZODJFVGhHTWg1dmpnSFRCTHdrUVJQMjVZNkZWVmVv',
  getId: () => {
    /*const src: string = (document.getElementById('videoPlayer') as HTMLVideoElement).src;
    const arr = src.split('/');
    const id = arr.pop();*/
    let id: string = "63501863951";

    if (Maxdome && Maxdome.generatedPlaybackOptions &&
      Maxdome.generatedPlaybackOptions.asset &&
      Maxdome.generatedPlaybackOptions.asset.id) {
      id = Maxdome.generatedPlaybackOptions.asset.id;
    }

    console.log('[Maxdome] id: ', id);
    return id;
  },
  getRefs: () => {
    document.getElementsByClassName('html5-player')[0].classList.add('demoFillContent');
    document.getElementsByClassName('video-element-and-controls')[0].classList.add('demoFillContent');
    return {
      videoRef: document.getElementById('videoPlayer') as HTMLVideoElement,
      videoParent: document.getElementById('mxd-content-player') as HTMLDivElement,
    };
  },
};
