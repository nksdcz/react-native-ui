/**
 * @author YangDong
 * @description:
 */
import React,{Component} from 'react';
import {
    View,
    TouchableWithoutFeedback,
    ActivityIndicator,
    BackHandler,
    StyleSheet,
    Animated,
    TouchableOpacity
} from 'react-native';
import PropType from 'prop-types';
import {getBarHeight, isAndroid} from "../utils/Unitls";

let hide = false;
export default class OverlayContainer extends Component{
    static propTypes = {
        backHandler: PropType.bool, //安卓返回键是否可以取消，默认true
        isCancel: PropType.bool, // 点击是否关闭，默认关闭
        opacity: PropType.number, //最大透明度，默认0.6
        backgroundColor: PropType.string,
        onShow: PropType.func,//显示成功后的回调
        onHide: PropType.func,//关闭成功后的回调
        onShowBefore: PropType.func,//在打开动画执行之前
        onHideBefore: PropType.func,//在关闭动画执行之前
    }

    static defaultProps = {
        backHandler: true,
        isCancel: true,
        opacity: 0.4,
        backgroundColor: '#000'
    }

    constructor(){
        super();
        this.state = {
            fadeAnimate: new Animated.Value(0),
        }
    }

    render(){
        return(
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.props.isCancel && this.onHidden()}>
                        <Animated.View style={[styles.overlay,{opacity: this.state.fadeAnimate,backgroundColor: this.props.backgroundColor}]}/>
                    </TouchableWithoutFeedback>
                    {this.props.children}
                </View>
        )
    }

    componentWillMount(){
        hide = false;
        if(isAndroid()){
            BackHandler.addEventListener('hardwareBackPress', ()=>this.androidBack());
        }
    }

    componentDidMount(){
        this.props.onShowBefore && this.props.onShowBefore();
        Animated.timing(
            this.state.fadeAnimate,
            {
                toValue: this.props.opacity,
                duration: 350
            }
        ).start(({finished})=>{
            if(finished){
                this.props.onShow&&this.props.onShow();
            }
        })
    }

    componentWillUnmount(){
        hide = true;
        if(isAndroid()) {
            BackHandler.removeEventListener('hardwareBackPress', this.androidBack);
        }
    }

    androidBack(){
        if(!hide){
            if(this.props.backHandler){
                this.onHidden();
            }
            return true;
        }
        return false;
    }

    onHidden(){
        this.props.onHideBefore && this.props.onHideBefore();
        Animated.timing(
            this.state.fadeAnimate,
            {
                toValue: 0,
                duration: 350
            }
        ).start(({finished})=>{
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
    content: {
        position: 'absolute',
        zIndex: 12
    }
});