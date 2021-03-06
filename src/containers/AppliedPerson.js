import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as headerActions from '../actions/header'
import '../assets/css/applied.less';
import NoData from '../components/NoData'
import Loading from '../components/Loading'
//import * as applyAPI from "../api/appliedPerson";

import {getApplyPerson} from '../api/appliedPerson'


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
export default class Index extends Component {
    constructor(options) {
        super(options);
        this.state = {
            data: null,
            scroll: null,
            visible: false,
            slideNumber: 0,
            loadingText: '加载中...'
        };
        this.scroll = undefined;
    }


    componentWillMount() {
        this.props.setTitle('已申请人员列表');
        this.getList();

    }

    componentDidMount() {
        this.bindScroll();
    }

    bindScroll() {
        let self = this;
        document.body.onscroll = () => {
            if (self.state.data == null) {
                return;
            }
            clearTimeout(this.scroll);
            this.scroll = setTimeout(() => {
                if (window.screen.availHeight + window.pageYOffset >= document.body.clientHeight - 100) {
                    this.getList();
                }

            }, 100)
        }
    }

    async getList() {
        let ret = await getApplyPerson({
            s4id: this.props.match.params.id,
            pageNum: this.state.slideNumber,
            pageSize: 10
        });
        let data = this.state.data || []
        this.setState({
            data: [...data, ...ret.body],
            slideNumber: this.state.slideNumber + 1,
        }, this.getListCallback);
    }

    getListCallback = () => {
        this.initSwiper();
    }
    initSwiper = () => {
        var holdPosition = 0;
        var self = this;
        var mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            mode: 'vertical',
            watchActiveIndex: true,
            onTouchStart: function () {
                holdPosition = 0;
            },
            onTouchMove: function (s, pos) {
                if (s.positions.current > 50) {
                    self.setState({
                        visible: true,
                        loadingText: '松开加载'
                    })
                } else if (s.positions.current > 10) {
                    self.setState({
                        loadingText: '下拉加载',
                        visible: true
                    })
                }

            },
            onResistanceBefore: function (s, pos) {
                holdPosition = pos;
            },
            onTouchEnd() {
                if (holdPosition > 50) {
                    // Hold Swiper in required position
                    mySwiper.setWrapperTranslate(0, 65, 0)

                    //Dissalow futher interactions
                    mySwiper.params.onlyExternal = true

                    //Show loader

                    self.setState({
                        loadingText: '加载中...'
                    });
                    //Load slides
                    setTimeout(() => {
                        loadNewSlides.call(self);
                    }, 500)

                }
            }
        })

        function loadNewSlides() {
            this.getList().then(ret => {
                this.setState({
                    data: [...ret.body, ...this.state.data],
                    visible: false,
                    loadingText: '下拉加载'
                }, () => {
                    mySwiper.setWrapperTranslate(0, 0, 0)
                    mySwiper.params.onlyExternal = false;

                    //Update active slide
                    mySwiper.updateActiveSlide(0);

                })
            })
            this.setState({
                slideNumber: this.state.slideNumber + 1,
            })
        }

    }

    render() {
        let {data} = this.state;
        if (!data) {
            return <Loading/>
        }
        if (data.length === 0) {
            return <NoData text="暂无数据"/>
        }

        return (

            <div className="wan-c-applied">
                <div className="swiper-container">
                    <ul className="swiper-wrapper">
                        <li className="swiper-slide swiper-slide-visible">
                            <div className={this.state.visible ? 'visible preloader' : 'preloader'}>
                                {this.state.loadingText}
                            </div>
                        </li>
                        {this.state.data.map((value, index) => {
                            return (
                                <li className="swiper-slide swiper-slide-visible">
                                    <img src={value.userHeadPic} alt=""/>
                                    <div>
                                        <span>{value.userNickname}</span><br/>
                                        <span className="number">{value.userSex}</span>
                                    </div>
                                </li>
                            )
                        })}

                    </ul>
                </div>

            </div>
        )
    }
}
