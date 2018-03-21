import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import { getVodSelector, getVodParentSelector } from 'Constants';
import { IState, ISyncState, VideoType } from 'Reducers';
import { SyncActions, ISyncActions } from 'Actions';
import { EaAPI } from 'Services';

declare const DiveAPI: EaAPI;

const delay = 0; // -6; // -15;

// tslint:disable-next-line:no-namespace
export namespace VODvideo {
  export interface IOwnProps {
    videoRef: HTMLVideoElement | HTMLObjectElement;
    parentRef?: HTMLElement;
    containerHeight: number;
    videoType: VideoType;
    playerAPI?: any;
  }

  export interface IActionProps {
    syncActions: ISyncActions;
  }

  export interface IState {
    /* empty */
  }
}

type VODVideoProps = VODvideo.IOwnProps & VODvideo.IActionProps & VODvideo.IState;

interface IVideoRefs {
  el: HTMLVideoElement;
  parent?: HTMLElement;
  parentHTML?: string;
  playerAPI?: any;
  style?: string;
  time?: number;
}

class VODvideoClass extends React.Component<VODVideoProps, {}> {
  private videoRefs: IVideoRefs;
  private videoParent: HTMLElement;
  private videoContainer: HTMLElement;
  private videoInterval: number;
  private mode: "HBBTV" | "HTML5" = "HTML5";
  private lastVODHbbtvData = {
    time: 0,
    playState: 0,
    timeScale: 0,
    lastCheck: 0,
  };
  private ignoreNext = false;

  public shouldComponentUpdate(nextProps: VODVideoProps) {
    return this.props.containerHeight !== nextProps.containerHeight;
  }

  public componentWillMount() {
    // CDM : this.videoContainer = document.getElementById("VODvideocontainer");
    this.toggleVideoStyles();
  }

  public componentWillUnmount() {
    clearInterval(this.videoInterval);
    if (this.videoRefs) {
      this.releaseVideo();
    }
    this.videoRefs = undefined;
  }

  public componentDidUpdate() {
    this.toggleVideoStyles();
  }

  public render(): any {
    const passive = this.props.containerHeight === 100 || this.props.parentRef == null;
    return (
      <div className="fillParent">
        {passive ? null :
          <style>
            {`
                    body {
                        overflow: hidden;
                    }
                    body > * {
                        visibility: hidden !important;
                        pointer-events: none;
                    }
                    body video, body object {
                        visibility: visible !important;
                        pointer-events: all;
                    }
                    body .vjs-control-bar, body .vjs-control-bar {
                        visibility: visible !important;
                        pointer-events: all;
                    }
                    `}
          </style>
        }

        <div className="fillParent" key="vodVideoContainerParent">
          <div id="VODvideocontainer" className="fillParent"></div>
        </div>
      </div>
    );
  }
  private getVideo() {
    const el = this.props.videoRef;
    if (el) {
      const style = this.storeCurrentVideoStyle(el);
      this.mode = el.tagName === "object" ? "HBBTV" : "HTML5";
      const time = 0;

      // tslint:disable-next-line:max-line-length
      return { el: (el as HTMLVideoElement), parent: this.props.parentRef, playerAPI: this.props.playerAPI, /*parentHTML: el.parentElement.innerHTML,*/ style, time };
    } else {
      console.error("NO VIDEO FOUND FOR VOD");
    }
  }

  private storeCurrentVideoStyle(el?: Element) {
    const target = el ? el : this.videoRefs.el;
    let style = null;
    if (target && target.getAttribute) {
      style = target.getAttribute("style");
    }
    if (this.videoRefs) {
      this.videoRefs.style = style;
    }
    return style;
  }

  private ytPlayerEvents() {
    const ytPlayer: any = (this.videoRefs.playerAPI as any);
    this.videoRefs.time = ytPlayer.getCurrentTime();
    ytPlayer.lastTime = this.videoRefs.time;
    ytPlayer.playVideo();
    const interval = 500;
    /// Time tracking starting here
    const checkPlayerTime = () => {
      this.videoRefs.time = ytPlayer.getCurrentTime();
      // console.log('TIME: ' + t + ' LAST: ' + event.target.lastTime + " DIFF: " + Math.abs(t - event.target.lastTime - (interval / 1000)));
      if (Math.abs(this.videoRefs.time - ytPlayer.lastTime - (interval / 1000)) > (interval / 1000)) {
        // console.log("seek");
        this.handleSeek();
      }
      ytPlayer.lastTime = this.videoRefs.time;
    };
    setInterval(checkPlayerTime, interval);
  }
  private onPlayerStateChange(event: any) {
    // console.log('onPlayerStateChange', event);
    const YTClass: any = (window as any).YT;
    switch (event.data) {
      case YTClass.PlayerState.PLAYING:
        // console.log('PLAYING', event);
        this.handlePlay();
        break;
      case YTClass.PlayerState.PAUSED:
        // console.log('PAUSED', event);
        this.handlePause();
        break;
      case YTClass.PlayerState.ENDED:
        // console.log('ENDED', event);
        this.handleEnd();
        break;
      /*
    case YTClass.PlayerState.BUFFERING:
      // console.log('BUFFERING', event);
      break;
    case YTClass.PlayerState.CUED:
      // console.log('CUED', event);
      break;
      */
    }
  }
  private toggleVideoStyles() {
    const passive = this.props.containerHeight === 100 || this.props.parentRef == null;
    // console.log("TVS passive: ", passive);
    if (!this.videoRefs || !this.videoRefs.el || !this.videoRefs.el.parentElement) {
      // console.log("TVS with VR");
      // tslint:disable-next-line:no-conditional-assignment
      if (this.videoRefs = this.getVideo()) {
        // console.log("TVS found VR");
        switch (this.props.videoType) {
          case 'VIMEO':
            const vimeoPlayer: any = (this.videoRefs.el as any);
            vimeoPlayer.on("play", () => { /*console.log("video!!! playing");*/ this.handlePlay(); });
            vimeoPlayer.on("pause", () => { /*console.log("video!!! pause");*/ this.handlePause(); });
            vimeoPlayer.on("end", () => { /*console.log("video!!! eeeeend");*/ this.handleEnd(); });
            vimeoPlayer.on("timeupdate", () => { /*console.log("video!!! timeupdate");*/ this.getVideoStatus(); });
            vimeoPlayer.on("seeked", (e: any) => { /*console.log("[VODVideo][Vimeo][Seeked]");*/ this.handleSeek(); });
            break;
          case 'YOUTUBE':
            const ytPlayer: any = (this.videoRefs.playerAPI as any);
            const YTClass: any = (window as any).YT;
            this.ytPlayerEvents();
            // ytPlayer.addEventListener('onReady', (e: any) => { this.onPlayerReady(e); });
            ytPlayer.addEventListener('onStateChange', (e: any) => { this.onPlayerStateChange(e); });
            break;
          case 'VIDEO':
            this.videoRefs.el.addEventListener("playing", () => { /*console.log("video!!! playing");*/ /*this.getVideoStatus();*/ this.handlePlay(); });
            this.videoRefs.el.addEventListener("pause", () => { /*console.log("video!!! pause");*/ /*this.getVideoStatus();*/ this.handlePause(); });
            // this.videoRefs.el.addEventListener("suspend", () => { /*console.log("video!!! suspend");*//*this.getVideoStatus();*/ this.handlePause(); });
            this.videoRefs.el.addEventListener("suspend", () => { /*console.log("video!!! suspend");*//*this.getVideoStatus();*/ this.handleSuspend(); });
            this.videoRefs.el.addEventListener("end", () => { /*console.log("video!!! eeeeend");*/ this.getVideoStatus(); this.handleEnd(); });
            this.videoRefs.el.addEventListener("timeupdate", () => { /*console.log("video!!! timeupdate");*/ this.getVideoStatus(); });
            break;
          default:
            this.videoInterval = setInterval(() => { this.getVideoStatus(); }, 500) as any;
            break;
        }

        setTimeout(() => {
          this.getVideoStatus();
        }, 500);
        /*
        if ((this.videoRefs.el as any).play) {
            (this.videoRefs.el as any).play(this.videoRefs.el.tagName === "VIDEO" ? undefined : 1);
        }*/
      } else {
        console.error("NO VIDEO FOUND FOR VOD (toggle)");
      }
    }
    if (passive) {
      this.releaseVideo();
    } else {
      this.storeCurrentVideoStyle();
      this.moveVideo();
    }
  }

  private moveVideo() {
    console.log("Moving video");
    if (this.videoRefs !== undefined) {
      const target = this.videoRefs.parent !== undefined ? this.videoRefs.parent : this.videoRefs.el;
      const layout = document.getElementsByClassName("layoutTop")[0] as HTMLElement;
      if (target !== undefined && layout !== undefined) {
        target.setAttribute(
          "style",
          `visibility: visible !important; position: fixed; top: 0; bottom: initial; left: 50%; margin-left: -50%; background: black; pointer-events: all; width: 100% !important; height: ${layout.offsetHeight}px !important; z-index:899;`,
        );
        console.log("Moved video");
      } else {
        console.log("Cannot find target or layout,", target, layout);
      }
    } else {
      console.log("videoRefs not setted on moveVideo", this.videoRefs);
    }
  }

  private releaseVideo() {
    if (this.videoRefs) {
      const target = this.videoRefs.parent ? this.videoRefs.parent : this.videoRefs.el;
      if (target && target.setAttribute) {
        target.setAttribute("style", this.videoRefs.style);
        // videoRefs.parent.appendChild(videoRefs.el);
        // if (videoRefs.parent.tagName.toLocaleLowerCase() !== "body") {
        //     console.log("PARENT VOD TAG", videoRefs.parent.tagName);
        //     videoRefs.parent.innerHTML = videoRefs.parentHTML;
        // }
        // const videoRefs2 = this.findVideo();
        // videoRefs2.el.currentTime = videoRefs.time;
        // videoRefs2.el.play();
      }
    }
  }

  private getCurrentTime() {
    return new Promise((resolve, reject) => {
      if ((this.videoRefs.el as any).currentTime) {
        resolve((this.videoRefs.el as any).currentTime);
      } else if ((this.videoRefs.el as any).playPosition) {
        resolve((this.videoRefs.el as any).playPosition / 1000);
      } else if ((this.videoRefs.el as any).getCurrentTime) {
        (this.videoRefs.el as any).getCurrentTime().then((time: number) => {
          resolve(time);
        });

      } else {
        resolve(0);
      }
    });
  }

  private getVideoStatus() {
    if (this.ignoreNext) {
      this.ignoreNext = false;
      return;
    }
    if (this.videoRefs) {
      const previousVODHbbtvData = { ...this.lastVODHbbtvData };
      if (this.videoRefs.el) {
        this.getCurrentTime().then((time: number) => {
          this.videoRefs.time = time;
          this.lastVODHbbtvData = {
            time,
            playState: (this.videoRefs.el as any).playState,
            timeScale: (this.videoRefs.el as any).speed,
            lastCheck: Date.now(),
          };

          const timeDiff = parseFloat(Math.abs(this.lastVODHbbtvData.lastCheck - previousVODHbbtvData.lastCheck).toFixed(2));
          let threshold = 2500;
          threshold = parseFloat(threshold.toFixed(2));
          // console.log("TIMEDIFFF", timeDiff);
          // //this.props.syncActions.setTime(this.videoRefs.time);

          // console.log('timeDiff - threshold', timeDiff, threshold);
          if (this.lastVODHbbtvData) {
            // PAUSE / PLAY (HBBTV)
            if (previousVODHbbtvData.timeScale && previousVODHbbtvData.timeScale !== this.lastVODHbbtvData.timeScale) {
              if (this.lastVODHbbtvData.timeScale === 0) {
                // this.handlePause();
              } else {
                // this.handlePlay();
              }
            } else if (previousVODHbbtvData.time > this.lastVODHbbtvData.time) {
              // REWIND
              this.handleSeek();
            } else if (timeDiff > threshold) {
              // DELAY OVER 2.5 seconds
              console.log("DELAY OVER 2.5, handleSeek", timeDiff, time);
              this.handleSeek();
            }
          } else {
            this.handleSeek();
          }
        });
      }
    }
  }

  private handleSeek() {
    console.log('[VODVideo] handleSeek: ', this.videoRefs);
    if (this.videoRefs) {
      console.log("SEEK", this.videoRefs.time);
      if (DiveAPI.socket.authenticated) {
        DiveAPI.socket.emit("vod_set", JSON.stringify({ timestamp: Math.max(0, this.videoRefs.time + delay) }));
      }
      // this.props.syncActions.setTime(Math.max(0, this.videoRefs.time + delay));
    }
  }

  private handlePlay() {
    if (this.videoRefs) {
      console.log("PLAY", this.videoRefs.time);
      // this.handleSeek();
      if (DiveAPI.socket.authenticated) {
        DiveAPI.socket.emit("vod_continue", JSON.stringify({ timestamp: Math.max(0, this.videoRefs.time + delay) }));
      }
      // this.props.syncActions.setTime(Math.max(0, this.videoRefs.time + delay));
    }
    this.ignoreNext = true;
  }

  private handleEnd() {
    console.log("VIDEO ENDED");
  }

  private handlePause() {
    if (this.videoRefs) {
      if (DiveAPI.socket.authenticated) {
        DiveAPI.socket.emit("vod_pause", JSON.stringify({ timestamp: Math.max(0, this.videoRefs.time + delay) }));

      }
      // this.props.syncActions.setTime(Math.max(0, this.videoRefs.time + delay));
    }
  }

  private handleSuspend() {
    console.log("suspend!");
  }

  private handlePlayerstateChange() {
    console.log("PLAYER STATUS", (this.videoRefs.el as any).playState);
  }
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    syncActions: bindActionCreators(SyncActions, dispatch),
  };
};

export const VODvideo = connect<null, VODvideo.IActionProps, VODvideo.IOwnProps>
  (null, mapDispatchToProps)(VODvideoClass);
