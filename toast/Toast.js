import React, {
    Component,
} from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastContainer from './ToastContainer';
import Overlay from "../overlay/Overlay";

let lastToast = null;
let toastRef = null;

class Toast extends Component {

    /**
     * 显示一个toast
     * @param option
     * (
     *      message: PropTypes.string, 显示的文字
     *      onShow: PropTypes.func,//显示成功后的回调
     *      onHidden: PropTypes.func, // 关闭成功后的回调
     *      barStyle: PropTypes.oneOf(['default','light-content','dark-content']),
     *      backgroundColor: PropTypes.string, //背景颜色
     *      messageStyle: PropTypes.object,//文字样式
     *      timeStyle: PropTypes.object,//时间样式
     *      message: PropTypes.string.isRequired,//显示的文字
     *      duration: PropTypes.number, //过几秒后关闭 为0时需要手动关闭
     * )
     * @returns {*}
     */
    static show = (option) => {
        if(!option){
            option = {}
        }
        onHide();
        lastToast = new RootSiblings(<ToastContainer ref={(ref)=> toastRef = ref} {...option} onHide={()=> onHide(option.onHidden)}/>);
        return lastToast;
    };

    /**
     * 显示一个成功的toast
     * @param option
     */
    static showSuccess= (option) => {
        let opt = Object.assign({backgroundColor: 'blue',barStyle:'light-content',messageStyle:{color:'#fff'},timeStyle:{color:'#fff'}},option);
        Toast.show(opt);
    }

    /**
     * 显示一个失败的toast
     * @param option
     */
    static showError= (option) => {
        let opt = Object.assign({backgroundColor: 'red',barStyle:'light-content',messageStyle:{color:'#fff'},timeStyle:{color:'#fff'}},option);
        Toast.show(opt);
    }

    /**
     * 关闭一个toast
     * @param callback 关闭后的回调方法
     */
    static hide= ()=>{
        if(toastRef){
            toastRef.onHide && toastRef.onHide();
        }
    };
}

function onHide(callBack){
    if(lastToast && lastToast instanceof RootSiblings){
        lastToast.destroy();
        callBack && callBack();
    }
}

export default Toast;
