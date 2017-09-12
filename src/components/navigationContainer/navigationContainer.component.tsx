import * as React from 'react';

import { navigable, INavigableProps } from "HOC";

interface INCCOwnProps {
    propagateParent?: boolean;
}

type NCCProps =
    INavigableProps &
    React.HTMLProps<HTMLDivElement> &
    INCCOwnProps
    ;

class NavigationContainerClass
    extends React.Component<NCCProps, {}> {
    public static defaultProps: INCCOwnProps;
    public render() {
        // tslint:disable:no-unused-variable
        // tslint:disable:max-line-length
        const { accept, acceptCharset, action, allowFullScreen, allowTransparency, alt, async, autoComplete, autoFocus, autoPlay, capture, cellPadding, cellSpacing, charSet, challenge, checked, cite, classID, cols, colSpan, content, controls, coords, crossOrigin, data, dateTime, defer, disabled, download, encType, form, formAction, formEncType, formMethod, formNoValidate, formTarget, frameBorder, headers, height, high, href, hrefLang, htmlFor, httpEquiv, integrity, keyParams, keyType, kind, label, list, loop, low, manifest, marginHeight, marginWidth, max, maxLength, media, mediaGroup, method, min, minLength, multiple, muted, name, nonce, noValidate, open, optimum, pattern, placeholder, playsInline, poster, preload, readOnly, rel, required, reversed, rows, rowSpan, sandbox, scope, scoped, scrolling, seamless, selected, shape, size, sizes, span, src, srcDoc, srcLang, srcSet, start, step, summary, target, type, useMap, value, width, wmode, wrap, defaultChecked, defaultValue, suppressContentEditableWarning, accessKey, contentEditable, contextMenu, dir, draggable, hidden, id, lang, spellCheck, style, tabIndex, title, inputMode, is, radioGroup, role, about, datatype, inlist, prefix, property, resource, vocab, autoCapitalize, autoCorrect, autoSave, color, itemProp, itemScope, itemType, itemID, itemRef, results, security, unselectable, children, dangerouslySetInnerHTML, onCopy, onCopyCapture, onCut, onCutCapture, onPaste, onPasteCapture, onCompositionEnd, onCompositionEndCapture, onCompositionStart, onCompositionStartCapture, onCompositionUpdate, onCompositionUpdateCapture, onFocus, onFocusCapture, onBlur, onBlurCapture, onChange, onChangeCapture, onInput, onInputCapture, onReset, onResetCapture, onSubmit, onSubmitCapture, onInvalid, onInvalidCapture, onLoad, onLoadCapture, onError, onErrorCapture, onKeyDown, onKeyDownCapture, onKeyPress, onKeyPressCapture, onKeyUp, onKeyUpCapture, onAbort, onAbortCapture, onCanPlay, onCanPlayCapture, onCanPlayThrough, onCanPlayThroughCapture, onDurationChange, onDurationChangeCapture, onEmptied, onEmptiedCapture, onEncrypted, onEncryptedCapture, onEnded, onEndedCapture, onLoadedData, onLoadedDataCapture, onLoadedMetadata, onLoadedMetadataCapture, onLoadStart, onLoadStartCapture, onPause, onPauseCapture, onPlay, onPlayCapture, onPlaying, onPlayingCapture, onProgress, onProgressCapture, onRateChange, onRateChangeCapture, onSeeked, onSeekedCapture, onSeeking, onSeekingCapture, onStalled, onStalledCapture, onSuspend, onSuspendCapture, onTimeUpdate, onTimeUpdateCapture, onVolumeChange, onVolumeChangeCapture, onWaiting, onWaitingCapture, onClick, onClickCapture, onContextMenu, onContextMenuCapture, onDoubleClick, onDoubleClickCapture, onDrag, onDragCapture, onDragEnd, onDragEndCapture, onDragEnter, onDragEnterCapture, onDragExit, onDragExitCapture, onDragLeave, onDragLeaveCapture, onDragOver, onDragOverCapture, onDragStart, onDragStartCapture, onDrop, onDropCapture, onMouseDown, onMouseDownCapture, onMouseEnter, onMouseLeave, onMouseMove, onMouseMoveCapture, onMouseOut, onMouseOutCapture, onMouseOver, onMouseOverCapture, onMouseUp, onMouseUpCapture, onSelect, onSelectCapture, onTouchCancel, onTouchCancelCapture, onTouchEnd, onTouchEndCapture, onTouchMove, onTouchMoveCapture, onTouchStart, onTouchStartCapture, onScroll, onScrollCapture, onWheel, onWheelCapture, onAnimationStart, onAnimationStartCapture, onAnimationEnd, onAnimationEndCapture, onAnimationIteration, onAnimationIterationCapture, onTransitionEnd, onTransitionEndCapture, key, ...childrenProps } = this.props as any;
        let { className } = this.props as any;
        // tslint:disable-next-line:triple-equals
        className = className ? `navigableContainer ${className}` : "navigableContainer";
        className = `fillParent ${className}`;
        const divProps = { accept, acceptCharset, action, allowFullScreen, allowTransparency, alt, async, autoComplete, autoFocus, autoPlay, capture, cellPadding, cellSpacing, charSet, challenge, checked, cite, classID, cols, colSpan, content, controls, coords, crossOrigin, data, dateTime, defer, disabled, download, encType, form, formAction, formEncType, formMethod, formNoValidate, formTarget, frameBorder, headers, height, high, href, hrefLang, htmlFor, httpEquiv, integrity, keyParams, keyType, kind, label, list, loop, low, manifest, marginHeight, marginWidth, max, maxLength, media, mediaGroup, method, min, minLength, multiple, muted, name, nonce, noValidate, open, optimum, pattern, placeholder, playsInline, poster, preload, readOnly, rel, required, reversed, rows, rowSpan, sandbox, scope, scoped, scrolling, seamless, selected, shape, size, sizes, span, src, srcDoc, srcLang, srcSet, start, step, summary, target, type, useMap, value, width, wmode, wrap, defaultChecked, defaultValue, suppressContentEditableWarning, accessKey, className, contentEditable, contextMenu, dir, draggable, hidden, id, lang, spellCheck, style, tabIndex, title, inputMode, is, radioGroup, role, about, datatype, inlist, prefix, property, resource, vocab, autoCapitalize, autoCorrect, autoSave, color, itemProp, itemScope, itemType, itemID, itemRef, results, security, unselectable, children, dangerouslySetInnerHTML, onCopy, onCopyCapture, onCut, onCutCapture, onPaste, onPasteCapture, onCompositionEnd, onCompositionEndCapture, onCompositionStart, onCompositionStartCapture, onCompositionUpdate, onCompositionUpdateCapture, onFocus, onFocusCapture, onBlur, onBlurCapture, onChange, onChangeCapture, onInput, onInputCapture, onReset, onResetCapture, onSubmit, onSubmitCapture, onInvalid, onInvalidCapture, onLoad, onLoadCapture, onError, onErrorCapture, onKeyDown, onKeyDownCapture, onKeyPress, onKeyPressCapture, onKeyUp, onKeyUpCapture, onAbort, onAbortCapture, onCanPlay, onCanPlayCapture, onCanPlayThrough, onCanPlayThroughCapture, onDurationChange, onDurationChangeCapture, onEmptied, onEmptiedCapture, onEncrypted, onEncryptedCapture, onEnded, onEndedCapture, onLoadedData, onLoadedDataCapture, onLoadedMetadata, onLoadedMetadataCapture, onLoadStart, onLoadStartCapture, onPause, onPauseCapture, onPlay, onPlayCapture, onPlaying, onPlayingCapture, onProgress, onProgressCapture, onRateChange, onRateChangeCapture, onSeeked, onSeekedCapture, onSeeking, onSeekingCapture, onStalled, onStalledCapture, onSuspend, onSuspendCapture, onTimeUpdate, onTimeUpdateCapture, onVolumeChange, onVolumeChangeCapture, onWaiting, onWaitingCapture, onClick, onClickCapture, onContextMenu, onContextMenuCapture, onDoubleClick, onDoubleClickCapture, onDrag, onDragCapture, onDragEnd, onDragEndCapture, onDragEnter, onDragEnterCapture, onDragExit, onDragExitCapture, onDragLeave, onDragLeaveCapture, onDragOver, onDragOverCapture, onDragStart, onDragStartCapture, onDrop, onDropCapture, onMouseDown, onMouseDownCapture, onMouseEnter, onMouseLeave, onMouseMove, onMouseMoveCapture, onMouseOut, onMouseOutCapture, onMouseOver, onMouseOverCapture, onMouseUp, onMouseUpCapture, onSelect, onSelectCapture, onTouchCancel, onTouchCancelCapture, onTouchEnd, onTouchEndCapture, onTouchMove, onTouchMoveCapture, onTouchStart, onTouchStartCapture, onScroll, onScrollCapture, onWheel, onWheelCapture, onAnimationStart, onAnimationStartCapture, onAnimationEnd, onAnimationEndCapture, onAnimationIteration, onAnimationIterationCapture, onTransitionEnd, onTransitionEndCapture, key };
        // tslint:enable:no-unused-variable
        // tslint:enable:max-line-length
        return (
            <div {...divProps}>
                {
                    this.props.children ?
                        this.recursiveCloneChildren(this.props.children) : null
                }
            </div>
        );
    }
    private recursiveCloneChildren(children: any) {
        return this.props.propagateParent ? React.Children.map(children, (child: any, idx: number) => {
            // tslint:disable-next-line:curly
            if (!child) return child;
            let childProps: any = { ...child.props};
            let foundNav = false;
            // tslint:disable-next-line:triple-equals
            if (child.props == undefined) {
                return child;
            } else if (child.type && childProps.parent) { // Is Navigable!
                childProps = { ...childProps, parent: this };
                foundNav = true;
            } else {
                return child;
            }
            if (child.props && child.props.children) {
                if (!foundNav) {
                    childProps.children = this.recursiveCloneChildren(child.props.children);
                }
            }
            return React.cloneElement(child, {...childProps});
        }) : children;
    }
}

NavigationContainerClass.defaultProps = {
    propagateParent: false,
};

export const NavigationContainer = navigable(NavigationContainerClass);
