import { IDemo } from "Services";

export const Starzplay: IDemo = {
  URL: "play.starzplayarabia.com",
  getId: () => {
    const arr = window.location.href.split('/');
    let spId = '';

    // tslint:disable-next-line:prefer-conditional-expression
    if (arr[arr.length - 3] === 'movies') {
      // Para las movies se devuelve la última parte de la url (ejemplo: 64860712307)
      // https://play.starzplayarabia.com/en/movies/hitch/23950888433
      spId = arr[arr.length - 1];
    } else {
      // Para el caso de la serie, se cogen las dos últimas partes de la url (ejemplo: 36008488058/s2e12)
      // https://play.starzplayarabia.com/en/series/sons-of-anarchy/47919656343/s1e3
      spId = arr[arr.length - 2] + '-' + arr[arr.length - 1];
    }
    return spId;
  },
  getRefs: () => {
    const videoRef: HTMLVideoElement = document.getElementById('bitdash-video-starzplayer') as HTMLVideoElement;
    const videoControls: HTMLVideoElement =
      document.getElementsByClassName('bitdash-ctrl-w')[0] as HTMLVideoElement;

    if (videoRef !== null) {
      videoRef.style.height = videoControls.style.height = '60%';
    }
    if (videoControls !== null) {
      videoControls.style.bottom = 'initial';
      videoControls.style.top = '0';
    }


    return {
      videoRef: document.getElementById('bitdash-video-starzplayer') as HTMLVideoElement,
      // videoParent: document.getElementsByClassName('bitdash-vc')[0] as HTMLElement,
      // videoParent: document.getElementsByClassName('bitdash-ctrl-w')[0] as HTMLElement,
    };
  },
}
