import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from './containers/home';
import About from './containers/about';
import configureStore from './store';



moment.locale('zh-cn');

const store = configureStore();
const history = createBrowserHistory();

function Main() {
  return (
    <LocaleProvider locale={zhCN}>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/home" component={Home} />
            <Route component={Home} />
          </Switch>
        </Router>
      </Provider>
    </LocaleProvider>
  );
}

export default Main;
