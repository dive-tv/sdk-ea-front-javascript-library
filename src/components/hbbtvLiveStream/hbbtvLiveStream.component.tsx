import * as React from 'react';

export interface IHbbtvLiveStreamProps {
    // TODO: Fill the component props:  any;
}
export class HbbtvLiveStream extends React.PureComponent<IHbbtvLiveStreamProps, {}> {
    public static defaultProps: IHbbtvLiveStreamProps = {
        // TODO: Fill the component props: ,
    };

    public componentDidMount() {
        window.setTimeout(this.getVideoStatus, 500);
    }

    public render(): any {
        // tslint:disable-next-line:max-line-length
        const styled: any = "position: relative; left: 700px; top: 300px; width: 320px; height: 180px; background-color:red;";
        /*
            http://demo.dive.tv:8079
            http://demo.dive.tv:8095/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000
            http://demo.dive.tv:8096/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000
        */
        return (
            <div className="fillParent" dangerouslySetInnerHTML={
                {
                    // tslint:disable-next-line:max-line-length
                    __html: `<object xmlns="http://www.w3.org/1999/xhtml" id="video1" type="video/broadcast"></object>`//``<object xmlns="http://www.w3.org/1999/xhtml" id="video1" type="video/mpeg"></object>`,
                }} />
        );
    }

    private getVideoStatus() {
        
        //const murl = "http://itv.mit-xperts.com/hbbtvtest/media/livestream.php";
        // const murl = "http://demo.dive.tv:8095/bd4f26ba-0c2a-3a16-bb7b-79aa066abf44-3000";
        // try {
        //     const videlem1: any = document.getElementById('video1');
        //     if (videlem1.play) {
        //         if (true) {
        //             videlem1.onPlayStateChange = function () {
        //                 if (1 == videlem1.playState) {
        //                     videlem1.onPlayStateChange = null;
        //                     //document.getElementById("1").innerHTML = "1 ERROR STATUS";
        //                     //(document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "red";
        //                 } else if (6 == videlem1.playState) {
        //                     videlem1.onPlayStateChange = null;
        //                     //document.getElementById("1").innerHTML = "6 ERROR STATUS";
        //                     //(document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "green";
        //                 }
        //             };
        //         }
        //         videlem1.data = murl;
        //         videlem1.play(1);
        //     } else {
        //         throw new Error("not video found");
        //     }
        // } catch (e) {
        //     console.error("Error hbbtv live streaming", e);
        //     // document.getElementById("1").innerHTML = "CATCH ERROR STATUS";
        //     // (document.getElementsByClassName("layoutTop")[0] as any).style.backgroundColor = "pink";
        //     // (document.getElementsByClassName("layoutTop")[0] as any).style.color = "black";
        //     // (document.getElementsByClassName("layoutTop")[0] as any).style.fontSize = "40px";
        //     // (document.getElementsByClassName("layoutTop")[0] as any).innerHTML += "ERROR: " + e;
        // }
        /*const videlem2: any = document.getElementById('video2');
        const videlem3: any = document.getElementById('video3');
        videlem2.play(1);
        videlem3.play(1);*/
    }
}
