import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { VOD_SELECTOR } from 'Constants';

export interface IVODvideoProps {
    containerHeight: number;
}
interface IVideoRefs {
    el: HTMLVideoElement; parent: HTMLElement; parentHTML: string; style?: string;
    time: number;
}

export class VODvideo extends React.PureComponent<IVODvideoProps, {}> {
    private videoRefs: IVideoRefs;
    private videoParent: HTMLElement;
    private videoContainer: HTMLElement;
    private videoInterval: number;

    public componentDidMount() {
        this.videoContainer = document.getElementById("VODvideocontainer");
        // tslint:disable-next-line:no-conditional-assignment
        if (this.videoRefs = this.findVideo()) {
            this.moveVideo(this.videoRefs.el);
            this.videoInterval = window.setInterval(this.getVideoStatus.bind(this), 500);
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
            el = document.querySelector("video");
        }
        if (el) {
            const parent = el.parentElement;
            const parentHTML = parent.innerHTML;
            const style = el.getAttribute("style");
            const time = (el as HTMLVideoElement).currentTime;
            // tslint:disable-next-line:max-line-length
            return { el: (el as HTMLVideoElement), parent: el.parentElement, parentHTML: el.parentElement.innerHTML, style, time };
        } else {
            el = document.getElementsByTagName('object')[0];
            const parent = el.parentElement;
            const parentHTML = parent.innerHTML;
            const style = el.getAttribute("style");
            const time = (el as any).playTime;
            // tslint:disable-next-line:max-line-length
            return { el: (el as HTMLVideoElement), parent: el.parentElement, parentHTML: el.parentElement.innerHTML, style, time };
        }
    }

    private moveVideo(video: HTMLVideoElement) {
        if (video) {
            // this.videoContainer.appendChild(video);
            // tslint:disable-next-line:max-line-length
            video.setAttribute("style", `visibility: visible !important; position: fixed; top: 0; left: 50%; margin-left: -50%; background: black; width: 100%; height: ${(document.getElementsByClassName("layoutTop")[0] as HTMLElement).offsetHeight}px; z-index:899;`);
            try {
                video.play();
            } catch (e) {
                console.error("Error playing video, ", e);
            }
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
        this.videoRefs.time = this.videoRefs.el.currentTime;
    }
}
