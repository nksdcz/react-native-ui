/**
 * @author YangDong
 * @description:
 */
import React, {
    Component,
} from 'react';
import RootSiblings from 'react-native-root-siblings';
import LoadingContainer from './LoadingContainer';

let lastLoading = null;
let loadingRef = null;
class Loading extends Component {

    static show = (option) => {
        if(!option){
            option = {}
        }
        onHide();
        lastLoading = new RootSiblings(<LoadingContainer ref = {(ref)=> loadingRef=ref} {...option} onHide={()=> onHide(option.onHidden)}/>);
        return lastLoading;
    };

    static hide= ()=>{
        if(loadingRef){
            loadingRef.onHidden && loadingRef.onHidden();
        }
    };
}

function onHide(callBack) {
    if(lastLoading && lastLoading instanceof RootSiblings){
        lastLoading.destroy();
        callBack && callBack();
    }
}

export default Loading;
