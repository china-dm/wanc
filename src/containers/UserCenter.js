import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as headerActions from '../actions/header'
import {List, Button} from 'antd-mobile';
import WCTabBar from '../components/TabBar';
import '../assets/css/userCenter.less';
import {isLogin,logout} from "../api/login";

function matchStateToProps(state) {
    //...
    return {
        state
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        ...headerActions
    }, dispatch)
}

@connect(matchStateToProps, matchDispatchToProps)
export default class UserCenter extends React.Component {
    constructor(options) {
        super(options);
        this.state = {
            hasInfo: false,
            userInfo: null
        }
    }


    componentWillMount() {
        this.props.setTitle('个人中心', false, <div></div>);
        this.setUserInfoToState();
    }

    goAboutPage = () => {
        this.props.history.push({
            pathname: '/about'
        })
    }
    goFeedbackPage = () => {
        this.props.history.push({
            pathname: '/feedback'
        })
    }

    setUserInfoToState() {
        let strUserInfo = localStorage.getItem('wanchi-USER-INFO');
        if (strUserInfo) {
            let objUserInfo = JSON.parse(strUserInfo);
            this.setState({
                userInfo: objUserInfo
            })
        }
    }

    async goModifyPasswordPage() {
        let ret = await isLogin();
        let pathname = ret.body ? '/modify/password' : '/login'
        this.props.history.push({
            pathname,
        })
    }

    goInformationPage = () => {
        this.props.history.push({
            pathname: '/information'
        })
    }
    goOrderPage = type => {
        this.props.history.push({
            pathname: `/order/mine/${type}`
        })
    }
    goLogin = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }
    goRegister = () => {
        this.props.history.push({
            pathname: '/register'
        })
    }
    goContact = () => {
        this.props.history.push({
            pathname: '/contact'
        })
    }
    goServicePage = () => {
        this.props.history.push({
            pathname: '/service'
        })
    }

    async changePhone() {
        let ret = await isLogin();
        let pathname = ret.body ? '/modify/phone' : '/login'
        this.props.history.push({
            pathname,
        })
    }

    async logout() {
        await logout();
        localStorage.clear();
        this.props.history.push({
            pathname: '/login'
        })
    }

    render() {
        let {userInfo} = this.state;
        return (
            <div className="wan-c-user mart70">
                {
                    userInfo ?
                        <div className="user-head">
                            <div onClick={this.goInformationPage}>
                                <img src={userInfo.userHeadPic}/>
                                <div className="user-head-info">
                                    <span className="uhi-phone">{userInfo.username}</span>
                                    {/*<span>已预约 356 次</span>*/}
                                </div>
                            </div>

                        </div>
                        :
                        <div></div>
                }

                {/*<div className="user-head">
                    {
                        userInfo ?
                            <div onClick={this.goInformationPage}>
                                <img src={userInfo.userHeadPic}/>
                                <div className="user-head-info">
                                    <span className="uhi-phone">{userInfo.username}</span>
                                    <span>已预约 356 次</span>
                                </div>
                            </div>
                            :
                            <div className="not_login">
                                <span onClick={this.goLogin}>登 录</span>
                            </div>
                    }

                </div>*/}
                <div className="user-play-list">
                    <div onClick={() => {
                        this.goOrderPage('10')
                    }}>
                        <img src={require('../assets/images/icon-not-pay.png')}/>
                        未付款
                    </div>
                    <div onClick={() => {
                        this.goOrderPage('20')
                    }}>
                        <img src={require('../assets/images/icon-has-pay.png')}/>
                        已预约
                    </div>
                </div>
                <div className="user-control">
                    <List>
                        <List.Item extra="修改" arrow="horizontal" onClick={() => {
                            this.changePhone()
                        }}>
                            <img className="phone" src={require('../assets/images/icon-phone-2.png')} alt=""/>
                            <span>更改绑定</span>
                        </List.Item>
                        <List.Item extra="修改" arrow="horizontal" onClick={() => {
                            this.goModifyPasswordPage()
                        }}>
                            <img className="lock" src={require('../assets/images/icon-lock.png')} alt=""/>
                            <span>登录密码</span>
                        </List.Item>
                        <List.Item arrow="horizontal" onClick={() => {
                            this.goContact();
                        }}>
                            <img className="lock" src={require('../assets/images/icon-connect.png')}/>
                            <span>联系客服</span>
                        </List.Item>
                        <List.Item arrow="horizontal" onClick={this.goFeedbackPage}>
                            <img className="lock" src={require('../assets/images/icon-pen.png')}/>
                            <span>意见反馈</span>
                        </List.Item>
                        <List.Item arrow="horizontal" onClick={this.goAboutPage}>
                            <img className="lock" src={require('../assets/images/icon-about.png')}/>
                            <span>关于万驰</span>
                        </List.Item>
                        <List.Item arrow="horizontal" onClick={this.goServicePage}>
                            <img className="lock" src={require('../assets/images/icon-service.png')}/>
                            <span>服务协议</span>
                        </List.Item>
                    </List>
                    {userInfo ?
                        <Button type="primary" className="logout" onClick={() => {
                            this.logout()
                        }}>退出当前帐号</Button> :
                        <Button type="primary" className="logout" onClick={() => {
                            this.goLogin()
                        }}>登录</Button>
                    }
                </div>
                <WCTabBar {...this.props}></WCTabBar>
            </div>
        )
    }
}