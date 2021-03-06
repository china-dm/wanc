import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as headerActions from '../actions/header'
import {Button, Icon} from 'antd-mobile';
import format from 'format-datetime';
import '../assets/css/list.less';
import * as runningAPI from "../api/running";
import Loading from '../components/Loading'
import NoData from '../components/NoData'

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
export default class Running extends Component {
    constructor(options) {
        super(options);
    }

    state = {
        data: {},
        banner: '',
        typeMap: ['试驾场次预约', '跑步预约', '自行车预约', '卡丁车预约', '赛道预约'],
    }

    componentWillMount() {
        this.setTitle();
        this.setBanner();
        this.getList();
    }

    componentDidMount() {
    }

    setTitle = () => {
        let type = parseInt(this.props.match.params.type);
        let title = this.state.typeMap[type];
        this.props.setTitle(title);
    }

    setBanner() {
        let type = parseInt(this.props.match.params.type);
        let banner = '';
        switch (type) {
            case 1 :
                banner = require('../assets/images/run.jpg');
                break;
            case 2 :
                banner = require('../assets/images/bicycle.jpg');
                break;
            case 3 :
                banner = require('../assets/images/kdc.jpg');
                break;
            case 4 :
                banner = require('../assets/images/road.jpg');
                break;
            default:
                banner = require('../assets/images/4s.jpg');
                break;
        }
        this.setState({
            banner,
        })
    }

    /**
     *
     * @param type 1:跑步,2：自行车，3：卡丁车，4：塞道
     * @param id
     */
    getList() {
        let type = this.props.match.params.type;
        this[`getList${type}`] && this[`getList${type}`]();
    }

    async getList0() {
        let ret = await runningAPI.get4SList();
        this.setState({
            data: ret.body
        })
    }

    async getList1() {
        let ret = await runningAPI.getRunningList();
        this.setState({
            data: ret.body
        })
    }

    async getList2() {
        let ret = await runningAPI.getBicycleList();
        this.setState({
            data: ret.body
        })
    }

    async getList3() {
        let ret = await runningAPI.getKartList();
        this.setState({
            data: ret.body
        })
    }

    async getList4() {
        let ret = await runningAPI.getTrackList();
        this.setState({
            data: ret.body
        })
    }

    goDetail(type, id, over) {
        if (over) {
            return;
        }
        // 场次预约
        if (type == 0) {
            this.props.history.push({
                pathname: `/order/fill/${type}/${id}`,
            });
            return;
        }
        this.props.history.push({
            pathname: `/subscribe/running/detail/${type}/${id}`,
        });
    }

    async submit() {
        //const {type} = this.props.match.params;
        //console.log(type)
    }

    render() {
        let {type} = this.props.match.params;
        if (this.state.data.activitys == undefined) {
            return <Loading/>
        }
        if (this.state.data.activitys && this.state.data.activitys.length === 0) {
            return <NoData text="暂无数据"/>
        }
        return (
            <div>
                <div className="home-banner">
                    <div className="running-subscribe-count">
                        已预约{this.state.data.activityCount}场次，共{this.state.data.userCount}次
                    </div>
                    <div>
                        <img src={this.state.banner} alt=""/>
                    </div>
                </div>
                <div className="list-stat">
                    <div className="running-describe">采用现场手机扫码方式入场</div>
                </div>
                {!this.state.data.activitys.length ?
                    <div style={{textAlign: 'center'}}>
                        <Icon type="loading"></Icon>
                    </div>
                    :
                    <ul className="subscribe-list">
                        {this.state.data.activitys.map((item, i) => (
                            <li className={!item.applyIsOver ? '' : 'disabled'} onClick={() => {
                                this.goDetail(type, item.id, item.applyIsOver)
                            }}>
                                <div className="sl-date">
                                    <div className="date">{format(new Date(item.date), 'M/d')}</div>
                                    <div className="year">{format(new Date(item.date), 'yyyy')}年</div>
                                </div>
                                <div className="sl-time">
                                    <div className="sl-hours">{item.startHour}-{item.endHour}
                                    </div>
                                    <div className="sl-end">截止至{format(new Date(item.applyEndTime), 'M月d日')}</div>
                                </div>
                                <div className="sl-price">
                                    <b>￥{item.discountPrice}</b>
                                    <del>￥{item.price}</del>
                                    <Button type="primary" onClick={() => {
                                        this.submit()
                                    }}>预约</Button>
                                </div>
                            </li>
                        ))}
                    </ul>}

            </div>
        )
    }
}
