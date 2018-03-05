import { IInitParams, ISyncVODParams } from "Main";
import { UIActions } from "Actions";
import { store } from "Store";
import { RTVE, Claro, Starzplay, Infomix, SevenTV, Watchbox, MaxdomeDemo, KeyMap } from "Services";


export let initFunc: (params: IInitParams) => any = null;
export let syncVODFunc: (params: ISyncVODParams) => any = null;
export let vodPause: () => any = null;
export let vodResume: (time: number) => any = null;

export interface IDemo {
  getId: () => string;
  getRefs: (callback?: (refs: IDemoRefs) => void) => IDemoRefs;
  URL: string;
  URL2?: string;
  API_KEY?: string;
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
          videoRefs.videoRef.classList.add('demoVideoId');
        }
        if (videoRefs.videoParent != null) {
          videoRefs.videoParent.classList.add('demoVideoContainer');
          videoRefs.videoParent.classList.add('demoVideoContainerId');
        }
      }

      const keyFunc = (event: KeyboardEvent) => {
        const km: any = KeyMap;
        const keyCode = event.keyCode;

        switch (keyCode) {
          case km.COLOR_YELLOW:
            DemoService.getRefsByProvider().then((vodRefs) => {
              if (vodRefs.videoParent.classList.contains('demoVideoContainer')) {
                vodRefs.videoRef.classList.remove('demoVideo');
                vodRefs.videoParent.classList.remove('demoVideoContainer');
              } else {
                vodRefs.videoRef.classList.add('demoVideo');
                vodRefs.videoParent.classList.add('demoVideoContainer');
              }
            });
            event.stopPropagation();
            event.preventDefault();
            break;
        }

      };
      document.removeEventListener("keypress", keyFunc);
      document.addEventListener("keypress", keyFunc);

    });
  };

  export const getApiKey = () => {
    switch (window.location.host) {
      case SevenTV.URL:
        return SevenTV.API_KEY;
      case MaxdomeDemo.URL:
        return MaxdomeDemo.API_KEY;
      case Watchbox.URL:
        return Watchbox.API_KEY;
      default:
        return 'cnR2ZV90ZXN0OnF6b1JiN0NZenJIcFlIUGZXTmM2bkczeGVUb0o5bVo2';
    }
  }

  export const OnInsert = (e: any) => {
    const tag: string = e.target.tagName as string;
    if (tag && tag.toLocaleLowerCase() === 'video') {
      console.log("[dive] instancia video");
      if (e.target.classList.contains('demoVideoId')) {
        console.log("[dive] es demoVideo");
        demoVOD(initFunc, syncVODFunc, vodResume, vodPause);
      }
    }
  };

  export const OnRemove = (e: any) => {
    const tag: string = e.target.tagName as string;
    if (tag && tag.toLocaleLowerCase() === 'video') {
      console.log("[dive] instancia video");
      if (e.target.classList.contains('demoVideoId')) {
        console.log("[dive] es demoVideo");
        vodPause();
      }
    }
  };


  export const demoVOD = (
    _initFunc: (params: IInitParams) => any,
    _syncVODFunc: (params: ISyncVODParams) => any,
    _vodResume: (time: number) => any,
    _vodPause: () => any,
  ) => {
    initFunc = _initFunc;
    syncVODFunc = _syncVODFunc;
    vodPause = _vodPause;
    vodResume = _vodResume;
    DemoService.getRefsByProvider().then((vodRefs) => {
      const { videoRef, videoParent } = vodRefs;
      document.addEventListener("DOMNodeInserted", OnInsert);
      document.addEventListener("DOMNodeRemoved", OnRemove);
      const apiKey: string = getApiKey();
      console.log("api key: ", apiKey);
      initFunc({
        selector: "#root",
        apiKey: apiKey,
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
