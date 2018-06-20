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
    BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import Overlay from "../overlay/Overlay";
import RNText from "../text/RNText";
import {isAndroid} from "../utils/Unitls";

let isHide = false;
export default class DialogContainer extends Component{
    static propTypes = {
        style: PropTypes.object,//整体样式
        title: PropTypes.string,//标题
        headerStyle: PropTypes.object,//标题样式
        buttons: PropTypes.array,//按钮
        pressHide: PropTypes.bool,//按钮点击后是否关闭dialog,默认true
        vertical: PropTypes.bool,//是否竖向排列button,默认否
        overlayBackgroundColor: PropTypes.string,//遮罩层背景色
        overlayOpacity: PropTypes.number,//遮罩层透明度 0-1
        overlayAnimationIn: PropTypes.string,//遮罩层进入动画，默认淡入
        overlayAnimationOut: PropTypes.string,//遮罩层退出通话，默认淡出
        dialogAnimationIn: PropTypes.string,//dialog进入动画，默认放大
        dialogAnimationOut: PropTypes.string,//dialog退出动画，默认缩小
        duration: PropTypes.number,//动画持续时间，毫秒
        backHandler: PropTypes.bool,//点击遮罩层是否退出，android中包含物理返回键，默认为true
        onShow: PropTypes.func, //显示完成后的回调
        onHide: PropTypes.func, //关闭完成后的回调
        onButtonPress: PropTypes.func,//按钮点击后的回调
    }

    static defaultProps = {
        title: 'Title',
        content: (<RNText>content</RNText>),
        buttons: [
            {title: '确定',style:{}},
            {title: '取消',style:{color:'red'}}
        ],
        pressHide: true,
        vertical: false,
        backHandler: true,
        overlayBackgroundColor: '#000',
        overlayOpacity: 0.4,
        overlayAnimationIn: 'fadeIn',//遮罩层进入动画，默认淡入
        overlayAnimationOut: 'fadeOut',//遮罩层退出通话，默认淡出
        dialogAnimationIn: 'zoomIn',//dialog进入动画，默认放大
        dialogAnimationOut: 'zoomOut',//dialog退出动画，默认缩小
        duration: 300,
    }

    constructor(props){
        super(props);
        this.state = {
            status: 'begin',
            overlayAnimation: this.props.overlayAnimationIn,
            dialogAnimation: this.props.dialogAnimationIn,
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.props.backHandler && this.onHidden()}>
                    <Animatable.View animation={this.state.overlayAnimation} duration={this.props.duration}>
                        <View style={{height:'100%',backgroundColor: this.props.overlayBackgroundColor,opacity:this.props.overlayOpacity}}/>
                    </Animatable.View>
                </TouchableWithoutFeedback>
                <View style={styles.dialogContainer}>
                    <Animatable.View animation={this.state.dialogAnimation} duration={this.props.duration} onAnimationEnd={()=> this.onAnimationEnd()}>
                        <View style={[styles.content,this.props.style]}>
                            <RNText style={[styles.header,this.props.headerStyle]}>{this.props.title}</RNText>
                            <ScrollView style={styles.body}>
                                {this.props.content}
                            </ScrollView>
                            <View style={this.props.vertical?styles.footer:styles.rowFooter}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </Animatable.View>
                </View>
            </View>
        );
    }

    renderButton(){
        let component = [];
        let buttonStyle = this.props.vertical?styles.button:styles.rowButton;
        this.props.buttons.forEach((value,index)=>{
            let borderWidth = index+1 === this.props.buttons.length? 0:0.5;
            component.push(
                <TouchableHighlight key={'dialogButton'+index} onPress={()=> this.buttonPress(index)}
                                    style={[buttonStyle,this.props.vertical?{borderBottomWidth: borderWidth}:{borderRightWidth: borderWidth}]}
                                    underlayColor='#ddd'
                                    activeOpacity={0.6}>
                    <RNText style={[{color:'#000',fontSize:13},value.style]}>{value.title}</RNText>
                </TouchableHighlight>
            );
        })
        return component;
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
        this.setState({
            overlayAnimation: this.props.overlayAnimationOut,
            dialogAnimation: this.props.dialogAnimationOut,
            status: 'end'
        });
    }

    onAnimationEnd(){
        if(this.state.status === 'end'){
            this.props.onHide&&this.props.onHide();
        }else{
            this.props.onShow&&this.props.onShow();
        }
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
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    content:{
        opacity: 1,
        width: 270,
        backgroundColor: '#fff',
        borderRadius: 5,
        overflow: 'hidden'
    },
    header:{
        padding:10,
        textAlign:'center',
        color: '#000',
        fontSize: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dfdfdf'
    },
    body:{
        height: 160,
        paddingLeft: 10,
        paddingRight: 10
    },
    footer:{
        borderTopWidth: 0.5,
        borderTopColor: '#dfdfdf',
    },
    rowFooter:{
        borderTopWidth: 0.5,
        borderTopColor: '#dfdfdf',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button:{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#dfdfdf',
    },
    rowButton: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#dfdfdf'
    }
});