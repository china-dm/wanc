import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import configure from '../store/configureStoreSaga'
import createHistory from 'history/createBrowserHistory'

import Header from '../components/Header';
import List from './List'
import Running from './Running'
import Index from './Index'
import Login from './Login'
import ForgetPassword from './ForgetPassword'
import OrderConfirm from './OrderConfirm';
import OrderRunning from './OrderRunning';
import OrderSuccess from './OrderSuccess';
import OrderFill from './OrderFill';
import OrderPay from './OrderPay';
import Drive from './Drive';
import AppliedPerson from './AppliedPerson';
import UserCenter from './UserCenter'
import OrderMine from './OrderMine'
import OrderDetail from './OrderDetail'
import Feedback from './Feedback'
import BasicInfo from './BasicInfo'
import ModifyNickname from './ModifyNickname'
import Message from './Message'
import About from './About'

let history = createHistory();
const store = configure({config: global.$GLOBALCONFIG})
const NoMatch = ({location}) => (
    <div>
        <h3>No match for <code>{location.pathname}!</code></h3>
    </div>
)
export default class App extends React.Component {
    constructor(options) {
        super(options);
    }

    componentDidMount() {

    }

    componentWillMount() {
        //debugger;
    }

    render() {
        return (
            <BrowserRouter history={history}>
                <Provider store={store}>
                    <Route render={params => {
                        let {location} = params;
                        return (
                            <div>
                                {params.location.pathname == "/login" ? <div></div> : <Header {...params}></Header>}
                                <Switch key={location.pathname} location={location}>
                                    <Route exact path="/" component={Index}></Route>
                                    <Route exact path="/index" component={Index}></Route>
                                    <Route exact path="/login" component={Login}></Route>
                                    <Route path="/forget" component={ForgetPassword}></Route>
                                    <Route path="/feedback" component={Feedback}></Route>
                                    <Route exact path="/list" component={List}></Route>
                                    <Route exact path="/running" component={Running}></Route>
                                    <Route exact path="/order/car/:id" component={OrderConfirm}></Route>
                                    <Route exact path="/order/running/:id" component={OrderRunning}></Route>
                                    <Route exact path="/order/success/:id" component={OrderSuccess}></Route>
                                    <Route exact path="/order/fill" component={OrderFill}></Route>
                                    <Route exact path="/order/pay" component={OrderPay}></Route>
                                    <Route exact path="/order/detail" component={OrderDetail}></Route>
                                    <Route exact path="/drive" component={Drive}></Route>
                                    <Route exact path="/apply" component={AppliedPerson}></Route>
                                    <Route exact path="/mine" component={UserCenter}></Route>
                                    <Route exact path="/order/mine" component={OrderMine}></Route>
                                    <Route exact path="/information" component={BasicInfo}></Route>
                                    <Route exact path="/modify/nickname" component={ModifyNickname}></Route>
                                    <Route exact path="/message" component={Message}></Route>
                                    <Route exact path="/about" component={About}></Route>
                                    <Route component={NoMatch}/>
                                </Switch>
                            </div>

                        )
                    }}>
                    </Route>
                </Provider>
            </BrowserRouter>
        )
    }
}