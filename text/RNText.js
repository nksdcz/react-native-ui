/**
 * @author YangDong
 * @description:
 */
import React,{Component} from 'react';
import {Text} from 'react-native';
import {allowFontScaling} from '../configs/Constant';
export default class RNText extends Component{
    render(){
        return (
            <Text {...this.props} allowFontScaling={allowFontScaling}>
                {this.props.children}
            </Text>
        );
    }
}