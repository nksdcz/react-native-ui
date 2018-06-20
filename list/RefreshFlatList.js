/**
 * @author YangDong
 * @description: 学生考勤
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ViewPropTypes} from 'react-native'
import PropTypes from 'prop-types';
import {get, post, cancel} from "../fetch/Request";
import RNText from "../text/RNText";
import {getArrayDifference} from "../utils/Unitls";

const RefreshState = {
    Idle: 0, //闲置中
    HeaderRefreshing: 1, //头部刷新
    FooterRefreshing: 2, //尾部加载更多
    NoMoreData: 3, //没有更多数据
    Failure: 4, //失败
    EmptyData: 5, //空数据
    OverTime: 6,//超时
}

export default class RefreshFlatList extends Component<Props, State> {

    static propTypes = {
        url: PropTypes.string, //请求地址
        params: PropTypes.object,//请求参数
        method: PropTypes.oneOf(['post','get']),//请求方式
        timeout: PropTypes.number,
        pageSize: PropTypes.number,//每页行数，默认15

        renderItem: PropTypes.func,//每行组件
        getPage: PropTypes.func,//获取下一页的页数
        tidyData: PropTypes.func,//整理数据，返回整理后的数据
        listRef: PropTypes.func,//list的ref

        footerContainerStyle: View.propTypes.style,//footer组件的样式
        footerTextStyle: View.propTypes.style,//底部组件text的样式
        footerRefreshingText: PropTypes.string,//加载更多的文字
        footerFailureText: PropTypes.string,//加载失败的文字
        footerNoMoreDataText: PropTypes.string,//没有更多数据的文字
        footerEmptyDataText: PropTypes.string,//空数据的文字
        footerOverTimeText: PropTypes.string,//超时文字
    }

    static defaultProps = {
        method: 'post',
        timeout: 5,
        pageSize: 15,
        footerRefreshingText: '玩命加载中 >.<',
        footerFailureText: '-哎哟，居然失败了，点击重新加载=.=!-',
        footerNoMoreDataText: '-没有更多数据了=.=!-',
        footerEmptyDataText: '-好像什么东西都没有=.=!-',
        footerOverTimeText: '-哎呦，加载超时了哦，点击重新加载=.=!-'
    }

    constructor(props){
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            data: []
        }
    }

    render() {
        let {renderItem, ...rest} = this.props;
        return (
            <FlatList
                ref={(ref)=> this.props.listRef && this.props.listRef(ref)}
                data={this.state.data}
                onEndReached={()=> this.onEndReached()}
                onRefresh={()=> this.onHeaderRefresh()}
                refreshing={this.state.refreshState === RefreshState.HeaderRefreshing}
                ListFooterComponent={()=> this.renderFooter()}
                onEndReachedThreshold={0.1}

                initialNumToRender={this.props.pageSize}
                renderItem={renderItem}

                {...rest}
            />
        )
    }

    //下拉刷新
    onHeaderRefresh(){
        this.props.getPage && this.props.getPage(1);
        if(this.state.refreshState === RefreshState.HeaderRefreshing || this.state.refreshState === RefreshState.FooterRefreshing) return;
        this.setState({
            refreshState: RefreshState.HeaderRefreshing
        },()=> this.sendRequest());
    }

    //上拉加载更多
    onEndReached(){
        this.props.getPage && this.props.getPage(Math.floor(this.state.data.length/this.props.pageSize)+1);
        if(this.state.refreshState !== RefreshState.Idle || this.state.data.length === 0) return;
        this.setState({
            refreshState: RefreshState.FooterRefreshing
        },()=> this.sendRequest());
    }

    //失败
    onFailure(){
        if(this.state.refreshState !== RefreshState.Failure) return;
        this.setState({
            refreshState: RefreshState.FooterRefreshing
        },()=> this.sendRequest());
    }

    //空数据
    onEmptyData(){
        if(this.state.refreshState !== RefreshState.EmptyData) return;
        this.setState({
            refreshState: RefreshState.FooterRefreshing
        },()=> this.sendRequest());
    }

    onOverTime(){
        if(this.state.refreshState !== RefreshState.OverTime) return;
        this.setState({
            refreshState: RefreshState.FooterRefreshing
        },()=> this.sendRequest());
    }

    renderFooter = () => {
        let footer = null

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle];
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle];
        let {footerRefreshingText, footerFailureText, footerNoMoreDataText, footerEmptyDataText, footerOverTimeText} = this.props;

        switch (this.state.refreshState) {
            case RefreshState.Idle:
                footer = (<View style={footerContainerStyle} />)
                break
            case RefreshState.Failure: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {this.onFailure()}}
                    >
                        <RNText  style={footerTextStyle}>{footerFailureText}</RNText>
                    </TouchableOpacity>
                )
                break
            }
            case RefreshState.EmptyData: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {this.onEmptyData()}}
                    >
                        <RNText  style={footerTextStyle}>{footerEmptyDataText}</RNText>
                    </TouchableOpacity>
                )
                break
            }
            case RefreshState.FooterRefreshing: {
                footer = (
                    <View style={footerContainerStyle} >
                        <ActivityIndicator size="small" color="#888888" />
                        <RNText  style={[footerTextStyle, {marginLeft: 7}]}>{footerRefreshingText}</RNText>
                    </View>
                )
                break
            }
            case RefreshState.NoMoreData: {
                footer = (
                    <View style={footerContainerStyle} >
                        <RNText  style={footerTextStyle}>{footerNoMoreDataText}</RNText>
                    </View>
                )
                break
            }
            case RefreshState.OverTime: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {this.onOverTime()}}
                    >
                        <RNText  style={footerTextStyle}>{footerOverTimeText}</RNText>
                    </TouchableOpacity>
                )
                break
            }
        }
        return footer
    }

    componentDidMount(){
        this.onHeaderRefresh();
    }

    componentWillMount(){
        this.timer && clearTimeout(this.timer);
        cancel(this);
    }

    //发送请求
    sendRequest= ()=>{
        //设置超时后断开
        this.timer = setTimeout(()=>{
            if(this.state.refreshState === RefreshState.HeaderRefreshing || RefreshState.FooterRefreshing){
                this.setState({
                    refreshState: RefreshState.OverTime
                },()=>{
                    cancel(this);
                });
            }
        },this.props.timeout * 1000);

        let promise = this.props.method === 'post'?post(
            this.props.url,
            this.props.params,
            this
        ): get(
            this.props.url,
            this.props.params,
            this
        );
        promise.then((response) => {
            if(response.ok){
                return response.json();
            }else{
                this.setState({
                    refreshState: RefreshState.Failure
                });
                return;
            }
        }).then((json) => {
            let data = json;
            if(this.props.tidyData){
                data = this.props.tidyData(data);
            }

            let state = RefreshState.Idle;
            let dataSource = [];
            if(this.state.refreshState === RefreshState.HeaderRefreshing){
                dataSource = data;

                if(data.length === 0){
                    state = RefreshState.EmptyData
                } else if(data.length < this.props.pageSize){
                    state = RefreshState.NoMoreData
                } else if(data.length === this.props.pageSize){
                    state = RefreshState.Idle
                }
            }else if(this.state.refreshState === RefreshState.FooterRefreshing){
                dataSource = dataSource.concat(data);
                state = data.length < this.props.pageSize? RefreshState.NoMoreData:RefreshState.Idle;
            }
            this.setState({
                data: dataSource,
                refreshState: state
            });
        }).catch((err) => {
            this.setState({
                refreshState: RefreshState.Failure
            })
        }).done(()=>{
            this.timer && clearTimeout(this.timer);
        });
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 13,
        color: '#555555'
    }
})
