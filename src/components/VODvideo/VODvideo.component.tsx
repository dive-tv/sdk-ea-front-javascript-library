import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { VOD_SELECTOR } from 'Constants';
import { IState, ISyncState } from 'Reducers';
import { SyncActions, ISyncActions } from 'Actions';
import { DiveAPIClass } from 'Services';

declare const DiveAPI: DiveAPIClass;

// tslint:disable-next-line:no-namespace
export namespace VODvideo {
    export interface IOwnProps {
        containerHeight: number;
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
    style?: string;
    time?: number;
}

class VODvideoClass extends React.PureComponent<VODVideoProps, {}> {
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

    public componentDidMount() {
        this.videoContainer = document.getElementById("VODvideocontainer");
        // tslint:disable-next-line:no-conditional-assignment
        if (this.videoRefs = this.findVideo()) {
            this.moveVideo(this.videoRefs.el);
            if (this.videoRefs.el.tagName === "VIDEO") {
                this.videoRefs.el.addEventListener("seeked", () => { this.getVideoStatus(); this.handleSeek(); });
                this.videoRefs.el.addEventListener("play", () => { this.getVideoStatus(); this.handlePlay(); });
                this.videoRefs.el.addEventListener("pause", () => { this.getVideoStatus(); this.handlePause(); });
                this.videoRefs.el.addEventListener("end", () => { this.getVideoStatus(); this.handleEnd(); });
            } else {
                this.videoInterval = setInterval(() => { this.getVideoStatus(); }, 500) as any;
            }
            (this.videoRefs.el as any).play(this.videoRefs.el.tagName === "VIDEO" ? undefined : 1);
            // this.videoInterval = setInterval(this.getVideoStatus, 500) as any;
        }
    }

    public componentWillUnmount() {
        this.releaseVideo(this.videoRefs);
    }

    public render(): any {
        return (
            <div className="fillParent">
                <style>
                    {`
                    body > * {
                        visibility: hidden !important;
                        pointer-events: none;
                    }
                    body video, body object {
                        visibility: visible !important;
                        pointer-events: all;
                    }
                    `}
                </style>

                <div className="fillParent" key="vodVideoContainerParent" dangerouslySetInnerHTML={
                    {
                        __html: `<div id="VODvideocontainer" class="fillParent"></div>`,
                    }} />
            </div>
        );
    }

    private findVideo(): IVideoRefs {
        let el: Element = document.querySelector((VOD_SELECTOR ? VOD_SELECTOR : "video"));
        // Fallback for video
        if (!el) {
            // Fallback HTML5
            el = document.querySelector("video");
        }
        if (!el) {
            // Fallback HBBTV
            (document.querySelectorAll("object") as any).forEach((object: any) => {
                if (object.type.indexOf("video") > -1) {
                    el = object;
                    this.mode = "HBBTV";
                }
            });
        }
        if (el) {
            const parent = el.parentElement;
            const parentHTML = parent.innerHTML;
            const style = el.getAttribute("style");
            this.mode = el.tagName === "object" ? "HBBTV" : "HTML5";
            const time = this.mode === "HBBTV" ?
                (el as any).playPosition :
                (el as HTMLVideoElement).currentTime
                ;
            // tslint:disable-next-line:max-line-length
            return { el: (el as HTMLVideoElement), parent: el.parentElement, /*parentHTML: el.parentElement.innerHTML,*/ style, time };
        }
    }

    private moveVideo(video: HTMLVideoElement) {
        if (video) {
            // this.videoContainer.appendChild(video);
            // tslint:disable-next-line:max-line-length
            video.setAttribute("style", `visibility: visible !important; position: fixed; top: 0; left: 50%; margin-left: -50%; background: black; width: 100%; height: ${(document.getElementsByClassName("layoutTop")[0] as HTMLElement).offsetHeight}px; z-index:899;`);
            /*
            try {
                video.play();
            } catch (e) {
                console.error("Error playing video, ", e);
            }
            */
        }
    }

    private releaseVideo(videoRefs: IVideoRefs) {
        if (videoRefs) {
            videoRefs.el.setAttribute("style", videoRefs.style);
            // videoRefs.parent.appendChild(videoRefs.el);
            // if (videoRefs.parent.tagName.toLocaleLowerCase() !== "body") {
            //     console.log("PARENT VOD TAG", videoRefs.parent.tagName);
            //     videoRefs.parent.innerHTML = videoRefs.parentHTML;
            // }
            // const videoRefs2 = this.findVideo();
            // videoRefs2.el.currentTime = videoRefs.time;
            // videoRefs2.el.play();
        }
        clearInterval(this.videoInterval);
    }

    private getVideoStatus() {
        if (this.videoRefs.el && this.videoRefs.el.currentTime) {
            this.videoRefs.time = this.videoRefs.el.currentTime;
            console.log("Set time (HTML5) ", this.videoRefs.time);
        } else if (this.videoRefs.el && (this.videoRefs.el as any).playPosition) {
            this.videoRefs.time = (this.videoRefs.el as any).playPosition / 1000;
            console.log("Set time (VOD) ", this.videoRefs.time);
        }
        const previousVODHbbtvData = { ...this.lastVODHbbtvData };
        this.lastVODHbbtvData = {
            time: (this.videoRefs.el as any).playPosition,
            playState: (this.videoRefs.el as any).playState,
            timeScale: (this.videoRefs.el as any).speed,
            lastCheck: Date.now(),
        };
        const timeDiff = this.lastVODHbbtvData.time - previousVODHbbtvData.time;
        console.log("TIMEDIFFF", timeDiff);
        if (this.lastVODHbbtvData) {
            // PAUSE / PLAY
            if (previousVODHbbtvData.timeScale !== this.lastVODHbbtvData.timeScale) {
                if (this.lastVODHbbtvData.timeScale === 0) {
                    this.handlePause();
                } else {
                    this.handlePlay();
                }
            } else if (previousVODHbbtvData.time > this.lastVODHbbtvData.time) {
                // REWIND
                this.handleSeek();
            } else if (Math.abs(timeDiff) > 2000) {
                // DELAY OVER 2 seconds
                this.handleSeek();
            }

        } else {
            this.handleSeek();
        }
    }

    private handleSeek() {
        console.log("SEEK", this.videoRefs.time);
        if (DiveAPI.socket.authenticated) {
            DiveAPI.socket.emit("vod_set", JSON.stringify({ timestamp: this.videoRefs.time }));
        }
        // this.props.syncActions.setTime(this.videoRefs.time);
    }

    private handlePlay() {
        console.log("PLAY", this.videoRefs.time);
        // this.handleSeek();
        if (DiveAPI.socket.authenticated) {
            DiveAPI.socket.emit("vod_continue", JSON.stringify({ timestamp: this.videoRefs.time }));
        }
    }

    private handleEnd() {
        console.log("VIDEO ENDED");
    }

    private handlePause() {
        // this.handleSeek();
        if (DiveAPI.socket.authenticated) {
            DiveAPI.socket.emit("vod_pause", JSON.stringify({ timestamp: this.videoRefs.time }));
        }
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
