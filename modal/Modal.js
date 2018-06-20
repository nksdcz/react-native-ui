/**
 * @author YangDong
 * @description:
 */
import React, {
    Component,
} from 'react';
import RootSiblings from 'react-native-root-siblings';
import DialogContainer from './ModalContainer';

let lastModal = null;
let modalRef = null;
class Modal extends Component {

    /**
     * 打开dialog
     * @param option:
     * @returns {*}
     */
    static show = (option) => {
        if(!option){
            option = {}
        }
        onHide();
        lastModal = new RootSiblings(<DialogContainer ref = {(ref)=> modalRef=ref} {...option} onHide={()=> onHide(option.onHidden)}/>);
        return lastModal;
    };

    static hide= ()=>{
        if(modalRef){
            modalRef.onHidden && modalRef.onHidden();
        }
    };
}

function onHide(callBack) {
    if(lastModal && lastModal instanceof RootSiblings){
        lastModal.destroy();
        callBack && callBack();
    }
}

export default Modal;
