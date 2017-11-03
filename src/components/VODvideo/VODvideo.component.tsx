import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getVodSelector, getVodParentSelector } from 'Constants';
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
        const passive = this.props.containerHeight === 100;
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

    private findVideo(): IVideoRefs {
        const vodSelector = getVodSelector();
        console.log("VOD_SELECTOR", vodSelector);
        let el: Element = document.querySelector((vodSelector ? vodSelector : "video"));
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
            const parentSelector = getVodParentSelector();
            let parent: HTMLElement;
            if (parentSelector) {
                parent = document.querySelector(parentSelector) as HTMLElement;
            }
            // const parentHTML = parent.innerHTML;
            const style = this.storeCurrentVideoStyle(el);
            this.mode = el.tagName === "object" ? "HBBTV" : "HTML5";
            const time = this.mode === "HBBTV" ?
                (el as any).playPosition :
                (el as HTMLVideoElement).currentTime
                ;
            // tslint:disable-next-line:max-line-length
            return { el: (el as HTMLVideoElement), parent, /*parentHTML: el.parentElement.innerHTML,*/ style, time };
        } else {
            console.error("NO VIDEO FOUND FOR VOD");
        }
    }

    private storeCurrentVideoStyle(el?: Element) {
        const target = el ? el : this.videoRefs.el;
        let style = null;
        if (target) {
            style = target.getAttribute("style");
        }
        if (this.videoRefs) {
            this.videoRefs.style = style;
        }
        return style;
    }

    private toggleVideoStyles() {
        const passive = this.props.containerHeight === 100;
        console.log("TVS passive: ", passive);
        if (!this.videoRefs || !this.videoRefs.el || !this.videoRefs.el.parentElement) {
            console.log("TVS with VR");
            // tslint:disable-next-line:no-conditional-assignment
            if (this.videoRefs = this.findVideo()) {
                console.log("TVS found VR");
                /*if (this.videoRefs.el.tagName.toLocaleLowerCase() === "video") {
                    this.videoRefs.el.addEventListener("seeked", () => { this.getVideoStatus(); this.handleSeek(); });
                    this.videoRefs.el.addEventListener("play", () => { this.getVideoStatus(); this.handlePlay(); });
                    this.videoRefs.el.addEventListener("playing", () => { this.getVideoStatus(); this.handlePlay(); });
                    this.videoRefs.el.addEventListener("pause", () => { this.getVideoStatus(); this.handlePause(); });
                    this.videoRefs.el.addEventListener("waiting", () => { this.getVideoStatus(); this.handlePause(); });
                    this.videoRefs.el.addEventListener("end", () => { this.getVideoStatus(); this.handleEnd(); });
                } else {*/
                    this.videoInterval = setInterval(() => { this.getVideoStatus(); }, 500) as any;
                /*}*/
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
        if (this.videoRefs) {
            const target = this.videoRefs.parent ? this.videoRefs.parent : this.videoRefs.el;
            const layout = document.getElementsByClassName("layoutTop")[0] as HTMLElement;
            if (target && layout) {
                // this.videoContainer.appendChild(video);
                // tslint:disable-next-line:max-line-length
                target.setAttribute("style", `visibility: visible !important; position: fixed; top: 0; left: 50%; margin-left: -50%; background: black; pointer-events: all; width: 100% !important; height: ${layout.offsetHeight}px !important; z-index:899;`);
            }
        }
    }

    private releaseVideo() {
        if (this.videoRefs) {
            const target = this.videoRefs.parent ? this.videoRefs.parent : this.videoRefs.el;
            if (target) {
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

    private getVideoStatus() {
        if (this.videoRefs) {
            const previousVODHbbtvData = { ...this.lastVODHbbtvData };
            if (this.videoRefs.el && this.videoRefs.el.currentTime) {
                this.videoRefs.time = this.videoRefs.el.currentTime;
                console.log("Set time (HTML5) ", this.videoRefs.time);
                this.lastVODHbbtvData = {
                    time: (this.videoRefs.el as any).currentTime,
                    playState: (this.videoRefs.el as any).playState,
                    timeScale: (this.videoRefs.el as any).speed,
                    lastCheck: Date.now(),
                };
            } else if (this.videoRefs.el && (this.videoRefs.el as any).playPosition) {
                this.videoRefs.time = (this.videoRefs.el as any).playPosition / 1000;
                console.log("Set time (VOD) ", this.videoRefs.time);
                this.lastVODHbbtvData = {
                    time: (this.videoRefs.el as any).playPosition,
                    playState: (this.videoRefs.el as any).playState,
                    timeScale: (this.videoRefs.el as any).speed,
                    lastCheck: Date.now(),
                };
            }
            
            const timeDiff = this.lastVODHbbtvData.time - previousVODHbbtvData.time;
            console.log("TIMEDIFFF", timeDiff);
            // this.props.syncActions.setTime(this.videoRefs.time);
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
                } else if (Math.abs(timeDiff) > 2500) {
                    // DELAY OVER 2.5 seconds
                    this.handleSeek();
                }
            } else {
                this.handleSeek();
            }
        }
    }

    private handleSeek() {
        if (this.videoRefs) {
            console.log("SEEK", this.videoRefs.time);
            if (DiveAPI.socket.authenticated) {
                DiveAPI.socket.emit("vod_set", JSON.stringify({ timestamp: this.videoRefs.time }));
            }
            this.props.syncActions.setTime(this.videoRefs.time);
        }
    }

    private handlePlay() {
        if (this.videoRefs) {
            console.log("PLAY", this.videoRefs.time);
            // this.handleSeek();
            if (DiveAPI.socket.authenticated) {
                DiveAPI.socket.emit("vod_continue", JSON.stringify({ timestamp: this.videoRefs.time }));
            }
            this.props.syncActions.setTime(this.videoRefs.time);
        }
    }

    private handleEnd() {
        console.log("VIDEO ENDED");
    }

    private handlePause() {
        if (this.videoRefs) {
            if (DiveAPI.socket.authenticated) {
                DiveAPI.socket.emit("vod_pause", JSON.stringify({ timestamp: this.videoRefs.time }));
            }
            this.props.syncActions.setTime(this.videoRefs.time);
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
