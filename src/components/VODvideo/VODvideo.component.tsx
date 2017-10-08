import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IVODvideoProps {
    // TODO: Fill the component props:  any;
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
    public static defaultProps: IVODvideoProps = {
        // TODO: Fill the component props: ,
    };

    public componentDidMount() {
        this.videoContainer = document.getElementById("VODvideocontainer");
        this.videoRefs = this.findVideo();
        this.moveVideo(this.videoRefs.el);
        this.videoInterval = window.setInterval(this.getVideoStatus.bind(this), 500);
    }

    public componentWillUnmount() {
        this.releaseVideo(this.videoRefs);
    }

    public render(): any {
        return (
            <div className="fillParent" key="vodVideoContainerParent" dangerouslySetInnerHTML={
                {
                    __html: `<div id="VODvideocontainer" class="fillParent"></div>`,
                }} />
        );
    }

    private findVideo(): IVideoRefs {
        const el = document.getElementsByTagName('video')[0];
        const parent = el.parentElement;
        const parentHTML = parent.innerHTML;
        const style = el.getAttribute("style");
        const time = el.currentTime;
        return { el, parent: el.parentElement, parentHTML: el.parentElement.innerHTML, style, time };
    }

    private moveVideo(video: HTMLVideoElement) {
        if (video) {
            this.videoContainer.appendChild(video);
            video.setAttribute("style", "");
            video.play();
        }
    }

    private releaseVideo(videoRefs: IVideoRefs) {
        if (videoRefs) {
            videoRefs.el.setAttribute("style", videoRefs.style);
            videoRefs.parent.appendChild(videoRefs.el);
            if (videoRefs.parent.tagName.toLocaleLowerCase() !== "body") {
                console.log("PARENT VOD TAG", videoRefs.parent.tagName);
                videoRefs.parent.innerHTML = videoRefs.parentHTML;
            }
            const videoRefs2 = this.findVideo();
            videoRefs2.el.currentTime = videoRefs.time;
            videoRefs2.el.play();
        }
        clearInterval(this.videoInterval);
    }

    private getVideoStatus() {
        this.videoRefs.time = this.videoRefs.el.currentTime;
    }
}
