/**
 * @author YangDong
 * @description:
 */
import {
    Dimensions,
    Platform
} from 'react-native';
import {
    androidBarHeight, androidHeaderHeight, iosBarHeight, iosHeaderHeight, iphoneXBarHeight,
    iphoneXHeaderHeight
} from "../configs/Constant";
/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
    let dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}

/**
 * 是否是安卓
 * @returns {boolean}
 */
export function isAndroid() {
    return Platform.OS === 'android';
}

/**
 * 是否是ios
 * @returns {boolean}
 */
export function isIos() {
    return Platform.OS === 'ios';
}

/**
 * 获取头部高度，包含状态栏高度
 * @returns {*}
 */
export function getHeaderHeight() {
    if(isAndroid()){
        return androidHeaderHeight + androidBarHeight;
    }else if(isIos()){
        if(isIphoneX()){
            return iphoneXHeaderHeight + iphoneXBarHeight;
        }else {
            return iosHeaderHeight + iosBarHeight;
        }
    }
}

/**
 * 获取状态栏高度
 */
export function getBarHeight() {
    if(isAndroid()){
        return androidBarHeight;
    }else if(isIos()){
        if(isIphoneX()){
            return iphoneXBarHeight;
        }else {
            return iosBarHeight;
        }
    }
}

/**
 * 获取屏幕宽度
 */
export function getScreenWight() {
    return Dimensions.get('window').width;
}

/**
 * 获取屏幕高度
 */
export function getScreenHeight() {
    return Dimensions.get('window').height;
}

export function getNowTime() {
    let weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    let date = new Date();
    let month = date.getMonth() + 1||'';
    let day = date.getDate()||'';
    let h = date.getHours() || '';
    let tz = 'AM';
    let min = date.getMinutes() || '';
    let seconds = date.getSeconds() || '';

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }

    if(h>12){
        h = (h -12);
        tz = 'PM';
    }else{
        h = h;
    }
    if(h >= 0 && h < 9){
        h = '0' + h
    }

    if(min >= 0 && min <= 9){
        min = '0'+min;
    }

    if(seconds >= 0 && seconds <= 9){
        seconds = '0'+seconds;
    }

    return {
        time: date.getTime().toString()||'',//时间
        year: date.getFullYear().toString()||'', //年
        month: month, //月
        week: weeks[date.getDay()], //周
        day: day, //日
        h: h, //时 12时制
        hh: date.getHours().toString(),//时 24时制
        min: min, //分
        seconds: seconds, //秒
        mill: date.getMilliseconds().toString(),//毫秒
        tz: tz //上午or下午
    };
}

/**
 * 获取前一个数组中和后一个数组中不同的元素
 * @param array1
 * @param array2
 * @returns {Array}
 */
export function getArrayDifference(array, array1) {
    //将array数组转换成set对象
    let setObj = new Set(array)
    //循环数组array1，并将值通过add插入set对象中,此时重复数据并不会插入其中
    for(let i = 0; i < array1.length; i++) {
        setObj.add(array1[i]);
    }
    //使用Array.from()方法将set对象转换成数组，并使用sort()方法排序
    return Array.from(setObj).sort();
}