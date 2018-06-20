/**
 * @author YangDong
 * @description:
 */
import React, {
    Component,
} from 'react';
import RootSiblings from 'react-native-root-siblings';
import DialogContainer from './DialogContainer';

let lastDialog = null;
let dialogRef = null;
class Dialog extends Component {

    /**
     * 打开dialog
     * @param option:
     *    style: PropTypes.object,//整体样式
     *    title: PropTypes.string,//标题
     *    headerStyle: PropTypes.object,//标题样式
     *    buttons: PropTypes.array,//按钮
     *    pressHide: PropTypes.bool,//按钮点击后是否关闭dialog,默认true
     *    vertical: PropTypes.bool,//是否竖向排列button,默认否
     *    overlayBackgroundColor: PropTypes.string,//遮罩层背景色
     *    overlayOpacity: PropTypes.number,//遮罩层透明度 0-1
     *    overlayAnimationIn: PropTypes.string,//遮罩层进入动画，默认淡入
     *    overlayAnimationOut: PropTypes.string,//遮罩层退出通话，默认淡出
     *    dialogAnimationIn: PropTypes.string,//dialog进入动画，默认放大
     *    dialogAnimationOut: PropTypes.string,//dialog退出动画，默认缩小
     *    duration: PropTypes.number,//动画持续时间，毫秒
     *    backHandler: PropTypes.bool,//点击遮罩层是否退出，android中包含物理返回键，默认为true
     *    onShow: PropTypes.func, //显示完成后的回调
     *    onHidden: PropTypes.func, //关闭完成后的回调
     *    onButtonPress: PropTypes.func,//按钮点击后的回调
     * @returns {*}
     */
    static show = (option) => {
        if(!option){
            option = {}
        }
        onHide();
        lastDialog = new RootSiblings(<DialogContainer ref = {(ref)=> dialogRef=ref} {...option} onHide={()=> onHide(option.onHidden)}/>);
        return lastDialog;
    };

    static hide= ()=>{
        if(dialogRef){
            dialogRef.onHidden && dialogRef.onHidden();
        }
    };
}

function onHide(callBack) {
    if(lastDialog && lastDialog instanceof RootSiblings){
        lastDialog.destroy();
        callBack && callBack();
    }
}

export default Dialog;
