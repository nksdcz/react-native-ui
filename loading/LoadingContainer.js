/**
 * @author YangDong
 * @description:
 */
import React,{Component} from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import OverlayContainer from "../overlay/OverlayContainer";
import RNText from "../text/RNText";
import Overlay from "../overlay/Overlay";

export default class LoadingContainer extends Component{
    static propTypes = {
        style: PropTypes.object,//加载层样式
        loadingColor: PropTypes.string,//loading颜色,最后加载完成后的提示字体颜色会跟随
        loadingSize: PropTypes.oneOf(['small', 'large']),//loading的大小
        loadingText: PropTypes.string,//加载文字
        textStyle: PropTypes.object,//加载文字样式
    }

    static defaultProps = {
        loadingColor: '#fff',
        loadingSize: 'small',
    }

    constructor(){
        super();
    }

    render(){
        return null
    }

    componentDidMount(){
        Overlay.show({...this.props,
                        children:(
                            <View style={styles.container}>
                                <View style={[styles.loadingView,this.props.style]}>
                                    <ActivityIndicator  size={this.props.loadingSize}
                                                        color={this.props.loadingColor}/>
                                    <RNText style={[{color: this.props.loadingColor,fontSize:11,marginTop:5},this.props.textStyle]}>{this.props.loadingText}</RNText>
                                </View>
                            </View>)})
    }

    onHidden(){
        Overlay.hide();
    }
}


const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },
    loadingView:{
        opacity: 1,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5
    },
});