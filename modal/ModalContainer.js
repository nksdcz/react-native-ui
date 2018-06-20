/**
 * @author YangDong
 * @description:
 */
import React,{Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableHighlight,
    BackHandler,
    Animated,
    StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import {getScreenHeight, getScreenWight, isAndroid} from "../utils/Unitls";

let isHide = false;
export default class ModalContainer extends Component{
    static propTypes = {
        top: PropTypes.bool, //是否从顶部出现，默认false
        height: PropTypes.number,//modal的高度，默认当前屏幕的一半
        overlayOpacity: PropTypes.number,//遮罩层的透明度
        backgroundColor: PropTypes.string,//modal背景色，默认白色
        duration: PropTypes.number,//动画持续时间，毫秒
        backHandler: PropTypes.bool,//点击遮罩层是否退出，android中包含物理返回键，默认为true
        onShow: PropTypes.func, //显示完成后的回调
        onHide: PropTypes.func, //关闭完成后的回调
    }

    static defaultProps = {
        top: false,
        height: getScreenHeight()/2,
        overlayOpacity: 0.4,
        backHandler: true,
        duration: 350,
        backgroundColor: '#fff'
    }

    constructor(props){
        super(props);
        this.state = {
            fadeAnimate: new Animated.Value(0),
            slideAnimate: new Animated.Value(0)
        }
    }

    render(){
        const y = this.state.slideAnimate.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.top?-this.props.height:this.props.height, 0]
        })
        let option = this.props.top?{top:0}:{bottom:0};
        let height = getScreenHeight()>getScreenWight()?this.props.height/getScreenHeight()*100+'%':this.props.height/getScreenWight()*100+'%';
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.props.backHandler && this.onHidden()}>
                    <Animated.View style={{height:'100%',backgroundColor: '#000',opacity: this.state.fadeAnimate}}>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.content,
                    {
                        height: height,
                        width: '100%',
                        backgroundColor:this.props.backgroundColor,
                        ...option,
                        transform: [{ translateY: y }]}]
                    }
                >
                    {this.props.content}
                </Animated.View>
            </View>
        );
    }

    buttonPress(index){
        this.onHidden();
        this.props.onButtonPress && this.props.onButtonPress(index);
    }

    componentWillMount(){
        isHide = false;
        if(isAndroid()){
            BackHandler.addEventListener('hardwareBackPress', ()=>this.androidBack());
        }
    }

    componentDidMount(){
        Animated.timing(
            this.state.fadeAnimate,
            {
                toValue: this.props.overlayOpacity,
                duration: this.props.duration
            }
        ).start();

        Animated.timing(this.state.slideAnimate, { toValue: 1, duration: this.props.duration })
            .start(({finished})=>{
                if(finished){
                    this.props.onShow&&this.props.onShow();
                }
            })
    }

    componentWillUnmount(){
        isHide = true;
        if(isAndroid()) {
            BackHandler.removeEventListener('hardwareBackPress', this.androidBack);
        }
    }

    androidBack(){
        if(!isHide){
            if(this.props.backHandler){
                this.onHidden();
            }
            return true;
        }
        return false;
    }

    onHidden(){
        Animated.timing(
            this.state.fadeAnimate,
            {
                toValue: 0,
                duration: this.props.duration
            }
        ).start();

        Animated.timing(this.state.slideAnimate, { toValue: 0, duration: this.props.duration })
            .start(({finished})=>{
                if(finished){
                    this.props.onHide&&this.props.onHide();
                }
            })
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 10
    },
    overlay: {
        flex: 1
    },
    dialogContainer:{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
    content:{
        position: 'absolute'
    }
});