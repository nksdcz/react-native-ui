/**
 * @author YangDong
 * @description:
 */
import React,{ Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import RNText from "../text/RNText";
import {post,cancel} from "../fetch/Request";

export const FetchState = {
    LOADING: 0, //加载中
    SUCCESS: 1, //加载成功
    FAIL: 2, //加载失败
    OVERTIME: 3 //超时
}

export default class NetWorkView extends Component<{}> {
    //属性验证
    static propTypes = {
        url: PropTypes.string.isRequired,//请求url
        params: PropTypes.object,//请求参数
        style: PropTypes.object,//最外层样式
        loadingType: PropTypes.oneOf(['loading','refresh']),//loading：页面中间转圈，refresh: 下拉刷新
        loadingColor: PropTypes.string,//loading颜色,最后加载完成后的提示字体颜色会跟随
        loadingSize: PropTypes.oneOf(['small', 'large']),//loading的大小
        refreshColor: PropTypes.string,//下拉刷新控件颜色
        refreshTitle: PropTypes.string,//下拉刷新控件标题，仅ios
        renderContent: PropTypes.func.isRequired,//加载成功后的内容
        timeout: PropTypes.number,//超时时间
        loadingText: PropTypes.string,//加载时的显示文字
        errorText: PropTypes.string,//加载出错后的显示文字
        overTimeText: PropTypes.string,//超时后的显示文字
        textStyle: PropTypes.object//加载文字样式
    }

    //设置默认值
    static defaultProps = {
        loadingType: 'loading',
        refreshColor: '#707070',
        refreshTitle: '加载中...',
        loadingColor: '#707070',
        loadingSize: 'small',
        timeout: 8,
        loadingText: '加载中...',
        failText: '请求出错，请重试。',
        overTimeText: '请求超时，请重试。'
    }

    /**
     * 设置初始值
     * @param props 默认值
     */
    constructor(props){
        super(props);
        this.state = {
            loadingState: 0,
            successData: null,
            failData: null
        }
    }

    /**
     * 初始化方法
     * @returns {XML}
     */
    render(){
        return (
            <ScrollView contentContainerStyle={[styles.container,this.props.style]}
                        refreshControl={ this.props.loadingType === 'refresh'?<RefreshControl
                            refreshing={this.state.loadingState === FetchState.LOADING}
                            onRefresh={()=> this.sendRequest()}
                            tintColor={this.props.refreshColor}
                            title={this.props.refreshTitle}
                            titleColor={this.props.refreshColor}
                            colors={[this.props.refreshColor]}
                            progressBackgroundColor="#fff"
                        />:null}>
                {this.renderChildren()}
            </ScrollView>
        );
    }

    renderChildren(){

        //加载中
        if(this.state.loadingState === FetchState.LOADING && this.props.loadingType === 'loading'){
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator  size={this.props.loadingSize}
                                        color={this.props.loadingColor}/>
                    <RNText style={[{color:this.props.loadingColor,fontSize:11},this.props.textStyle]}>{this.props.loadingText}</RNText>
                </View>
            );
        }

        if(this.state.loadingState === FetchState.LOADING && this.props.loadingType === 'refresh'){
            if(this.props.renderContent && this.state.successData)
                return this.props.renderContent(this.state.successData);
        }

        //加载成功
        if(this.state.loadingState === FetchState.SUCCESS){
            if(this.props.renderContent)
                return this.props.renderContent(this.state.successData);
        }

        //加载失败
        if(this.state.loadingState === FetchState.FAIL){
            return (
                <View style={styles.overTimeView}>
                    <TouchableOpacity onPress={()=> this.sendRequest()}>
                        <RNText style={[{color:this.props.loadingColor},this.props.textStyle]}>{this.props.failText}</RNText>
                    </TouchableOpacity>
                </View>
            )
        }

        //加载超时
        if(this.state.loadingState === FetchState.OVERTIME){
            return (
                <View style={styles.overTimeView}>
                    <TouchableOpacity onPress={()=> this.sendRequest()}>
                        <RNText style={[{color:this.props.loadingColor},this.props.textStyle]}>{this.props.overTimeText}</RNText>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    /**
     * 初始化完成，处理数据
     */
    componentDidMount(){
        this.sendRequest();
    }

    componentWillUnmount(){
        //删除定时器并取消请求
        this.timer && clearTimeout(this.timer);
        cancel(this);
    }

    /**
     * 发送请求
     * @returns {*}
     */
    sendRequest= ()=>{
        //设置超时后断开
        this.timer = setTimeout(()=>{
            if(this.state.loadingState === FetchState.LOADING){
                this.setState({
                    loadingState: FetchState.OVERTIME
                },()=>{
                    cancel(this);
                });
            }
        },this.props.timeout * 1000);

        this.setState({
            loadingState: FetchState.LOADING
        });
        post(
            this.props.url,
            this.props.params,
            this
        ).then((response) => {
            if(response.ok){
                return response.json();
            }
        }).then((json) => {
            this.setState({
                loadingState: FetchState.SUCCESS,
                successData: json
            })
        }).catch((err) => {
            this.setState({
                loadingState: FetchState.FAIL
            })
        }).done(()=>{this.timer && clearTimeout(this.timer)});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fafafa'
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overTimeView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});