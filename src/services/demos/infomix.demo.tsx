import { IDemo, IDemoRefs } from "Services";

declare const Vimeo: any;
export const Infomix: IDemo = {
  URL: 'infomix.tv',
  getId: () => {
    const id = window.location.href.split("infomix.tv/")[1];
    return "63501863951"; // Creo que es sex and the city.
  },
  getRefs: (callback: (refs: IDemoRefs) => void) => {
    const script = document.createElement('script');
    script.src = "https://player.vimeo.com/api/player.js?retert=34535";
    script.onload = () => {
      const iframe = document.querySelector('iframe');
      const player = new Vimeo.Player(iframe);
      callback(Infomix.getRefs());
    };
    document.head.appendChild(script);

    return {
      videoRef: null,
    };
  }
}
