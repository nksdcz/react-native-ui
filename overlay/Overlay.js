/**
 * @author YangDong
 * @description:
 */
import React, {
    Component,
} from 'react';
import {BackHandler} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import OverlayContainer from './OverlayContainer';
import {isAndroid} from "../utils/Unitls";
import Toast from "../toast/Toast";

let lastOverlay = null;

let overlayRef = null;

class Overlay extends Component {

    static show = (option) => {
        // Toast.hide();
        onHide();
        if(!option){
            option = {}
        }
        lastOverlay = new RootSiblings(<OverlayContainer ref={(ref) => overlayRef=ref} {...option} onHide={()=> onHide(option.onHidden)}/>);
        return lastOverlay;
    };

    static hide= ()=>{
        if(overlayRef){
            overlayRef.onHidden();
        }
    };
}

function onHide(callBack) {
    if(lastOverlay && lastOverlay instanceof RootSiblings){
        lastOverlay.destroy();
        callBack && callBack();
    }
}

export default Overlay;
