/**
 * @author YangDong
 * @description: 网络请求公共封装
 */
import fetch from './fetch';
import Toast from "../toast/Toast";
import Loading from "../loading/Loading";

/**
 * 统一调用的post请求
 * @param url
 * @param params
 * @param tag
 * @returns {Promise}
 */
export const post = (url,params,tag)=>{
    return fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        },
        tag
    )
}

/**
 * 统一调用的get请求
 * @param url
 * @param params
 * @param tag
 * @returns {Promise}
 */
export const get = (url,params,tag)=>{
    let temp = '';
    for (let key in params) {
        temp = temp + key + '=' + params[key] + '&';
    }
    let http = url+'?'+temp.substring(0,temp.length-1);
    return fetch(http,{
        method: 'GET'
    },tag)
}

export const cancel = (tag)=>{
    fetch.abort(tag);
}

/**
 * 带loading的post请求
 * @param url 地址
 * @param params 参数
 * @param timeout 超时时间
 * @param tag
 * @param option
 * @returns {Promise.<*>}
 */
export async function postWithLoading(url,params,timeout,tag,option){
    let state = 0;//开始加载
    let loadingMsg = option.loadingMsg?option.loadingMsg: '加载中...';
    let errMsg = option.errMsg?option.errMsg: '请求失败,请重试。';
    let overTimeMsg = option.overTimeMsg?option.overTimeMsg: '请求超时,请重试。';


    //超时后取消请求
    this.timer = setTimeout(()=>{
        state = 1;
        fetch.abort(tag);
        Loading.hide();
        Toast.showError({message:overTimeMsg});
    },timeout * 1000);


    //开启一个Loading
    Loading.show(Object.assign({
        backHandler: false,
        isCancel: false,
        loadingSize: 'small',
        loadingText: loadingMsg,
        onHidden: ()=>{
            if(state === 0){
                this.timer && clearTimeout(this.timer);
                fetch.abort(tag);
            }
        }
    },option.loadingOption));


    let result = null;
    try{
        let request =  await post(url,params,tag);
        let data = await request.json();
        result = {
            msg: 'success',
            data: data
        };
    }catch (err){
        result = {
            msg: 'fail',
            data: err
        };
    }finally {
        state = 1;//加载完成
        this.timer && clearTimeout(this.timer);
        Loading.hide();
        if(result.msg === 'fail'){
            Toast.showError({message:errMsg});
        }
        return result;
    }
}

/**
 * 带loading的get请求
 * @param url 地址
 * @param params 参数
 * @param timeout 超时时间
 * @param tag
 * @param option
 * @returns {Promise.<*>}
 */
export async function getWithLoading(url,params,timeout,tag,option){
    let state = 0;//开始加载
    let loadingMsg = option.loadingMsg?option.loadingMsg: '加载中...';
    let errMsg = option.errMsg?option.errMsg: '请求失败,请重试。';
    let overTimeMsg = option.overTimeMsg?option.overTimeMsg: '请求超时,请重试。';


    //超时后取消请求
    this.timer = setTimeout(()=>{
        state = 1;
        fetch.abort(tag);
        Loading.hide();
        Toast.showError({message:overTimeMsg});
    },timeout * 1000);


    //开启一个Loading
    Loading.show(Object.assign({
        backHandler: false,
        isCancel: false,
        loadingSize: 'small',
        loadingText: loadingMsg,
        onHidden: ()=>{
            if(state === 0){
                this.timer && clearTimeout(this.timer);
                fetch.abort(tag);
            }
        }
    },option.loadingOption));


    let result = null;
    try{
        let request =  await get(url,params,tag);
        let data = await request.json();
        result = {
            msg: 'success',
            data: data
        };
    }catch (err){
        result = {
            msg: 'fail',
            data: err
        };
    }finally {
        state = 1;//加载完成
        this.timer && clearTimeout(this.timer);
        Loading.hide();
        if(result.msg === 'fail'){
            Toast.showError({message:errMsg});
        }
        return result;
    }
}

