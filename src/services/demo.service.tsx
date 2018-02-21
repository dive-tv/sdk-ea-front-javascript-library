import { IInitParams, ISyncVODParams } from "Main";
import { UIActions } from "Actions";
import { store } from "Store";
import { RTVE, Claro, Starzplay, Infomix, SevenTV, Watchbox, MaxdomeDemo } from "Services";


export interface IDemo {
  getId: () => string;
  getRefs: (callback?: (refs: IDemoRefs) => void) => IDemoRefs;
  URL: string;
  URL2?: string;
}

export interface IDemoRefs {
  videoRef: HTMLVideoElement | HTMLObjectElement;
  videoParent?: HTMLElement;
}

// tslint:disable-next-line:no-namespace
export namespace DemoService {

  declare const Vimeo: any;

  export const getIdByProvider = (): string => {
    switch (window.location.host) {
      case RTVE.URL:
        return RTVE.getId();

      case Claro.URL:
      case Claro.URL2:
        return Claro.getId();

      case Starzplay.URL:
        return Starzplay.getId();

      case Infomix.URL:
        return Infomix.getId();
      // return id;
      case SevenTV.URL:
        return SevenTV.getId();

      case Watchbox.URL:
        return Watchbox.getId();

      case MaxdomeDemo.URL:
        return MaxdomeDemo.getId();
    }
  };


  export const getRefsByProvider = (): Promise<{
    videoRef: HTMLVideoElement | HTMLObjectElement,
    videoParent?: HTMLElement,
  }> => {
    return new Promise((resolve, reject) => {
      let videoRefs: IDemoRefs;
      // videoRef: HTMLVideoElement | HTMLObjectElement, videoParent?: HTMLElement
      switch (window.location.host) {
        case RTVE.URL:
          videoRefs = RTVE.getRefs();
          resolve(videoRefs);
          break;

        case Claro.URL:
        case Claro.URL2:
          videoRefs = Claro.getRefs();
          resolve(videoRefs);
          break;

        case Starzplay.URL:
          videoRefs = Starzplay.getRefs();
          resolve(videoRefs);
          break;

        case Infomix.URL:
          Infomix.getRefs((refs: IDemoRefs) => {
            resolve(refs);
          });
          break;

        case SevenTV.URL:
          videoRefs = SevenTV.getRefs();
          resolve(videoRefs);
          break;

        case Watchbox.URL:
          videoRefs = Watchbox.getRefs();
          resolve(videoRefs);
          break;

        case MaxdomeDemo.URL:
          videoRefs = MaxdomeDemo.getRefs();
          resolve(videoRefs);
          break;
      }


      if (videoRefs != null) {
        if (videoRefs.videoRef != null) {
          videoRefs.videoRef.classList.add('demoVideo');
        }
        if (videoRefs.videoParent != null) {
          videoRefs.videoParent.classList.add('demoVideoContainer');
        }
      }

    });
  };


  export const demoVOD = (initFunc: (params: IInitParams) => any, syncVODFunc: (params: ISyncVODParams) => any) => {
    DemoService.getRefsByProvider().then((vodRefs) => {
      const { videoRef, videoParent } = vodRefs;
      initFunc({
        selector: "#root",
        apiKey: "cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2",
        deviceId: "test",
        showMenu: false,
        // platform: 'HBBTV',
      })
        .then(() => {
          const movieId = DemoService.getIdByProvider();
          // movieId = "577062"; // Creo que es sex and the city.
          // movieId = '63501863951'; // Jurassic World
          return syncVODFunc({ movieId, timestamp: (videoRef as any).currentTime || 1, videoRef, videoParent, isDemo: true });
        })
        .then(() => {
          store.dispatch(UIActions.open({
            top: 'VODVIDEO',
            bottom: 'CAROUSEL',
          }) as any);
          // store.dispatch(UIActions.setDivider(100));
        });
    });
  };


}
