import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    Platform,
    TouchableWithoutFeedback,
    StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import RNText from "../text/RNText";
import {getBarHeight, getHeaderHeight, getNowTime} from "../utils/Unitls";

export default class ToastContainer extends Component{

    static propTypes = {
        barStyle: PropTypes.oneOf(['default','light-content','dark-content']),
        backgroundColor: PropTypes.string, //背景颜色
        messageStyle: PropTypes.object,//文字样式
        timeStyle: PropTypes.object,//时间样式
        message: PropTypes.string.isRequired,//显示的文字
        duration: PropTypes.number, //过几秒后关闭
        onHide: PropTypes.func,//关闭后的回调方法
        onShow: PropTypes.func //显示完成后的回调方法
    }

    static defaultProps = {
        barStyle: 'dark-content',
        backgroundColor: '#fff',
        duration: 1,
    }

    constructor(){
        super();
        this.state={
            animatedValue: new Animated.Value(0),
            height: getHeaderHeight()
        }
    }

    render(){
        const y = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-this.state.height, 0]
        })
        let nowTime = getNowTime();
        return(
            <TouchableWithoutFeedback onPress={()=> this.onHide()}>
                <Animated.View style={[styles.container,{shadowColor: this.props.backgroundColor,height:this.state.height,backgroundColor: this.props.backgroundColor,transform: [{ translateY: y }]}]}>
                    <StatusBar
                        animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                        hidden={false}  //是否隐藏状态栏。
                        backgroundColor={'rgba(0,0,0,0)'} //状态栏的背景色
                        translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                        barStyle={this.props.barStyle} // enum('default', 'light-content', 'dark-content')
                    />
                        <RNText style={[styles.messageStyle,this.props.messageStyle]} numberOfLines={1}>
                            {this.props.message}
                        </RNText>
                        <RNText style={[styles.timeStyle,this.props.timeStyle]}>{`${nowTime.h}:${nowTime.min} ${nowTime.tz}`}</RNText>
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }

    componentDidMount(){
        Animated
            .timing(this.state.animatedValue, { toValue: 1, duration: 350 })
            .start(({finished})=>{
                if(finished){
                    this.props.onShow && this.props.onShow();
                    if(this.props.duration>0){
                        this.timer = setTimeout(()=>{
                            this.onHide();
                        },this.props.duration * 1000);
                    }
                }

            })
    }

    onHide(){
        this.timer && clearTimeout(this.timer);
        Animated
            .timing(this.state.animatedValue, { toValue: 0, duration: 350 })
            .start(({finished})=>{
                if(finished){
                    this.props.onHide&&this.props.onHide();
                }
            })
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        opacity: 1,
        top: 0,
        right: 0,
        left: 0,
        paddingTop: getBarHeight(),
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 5
    },
    messageStyle:{
        flex: 1,
        fontSize: 12,
        color: '#000'
    },
    timeStyle: {
        marginLeft: 30,
        fontSize: 11,
        color: '#000'
    }
});
