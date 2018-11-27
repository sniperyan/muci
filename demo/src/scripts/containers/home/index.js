/*eslint no-console: 'off'*/
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as homeAction from '../../actions/home';
import logo from '../../../assets/logo.svg';
import acc_icon from '../../../assets/acc_icon.webp';
import { Link } from 'react-router-dom';
import styles1 from './app.module.css';
import styles2 from './app.module.less';
import './noModule.css';
import request from '../../util/request';
import URL_PREFIX from '../../util/urlPrefix';

@connect(
  state => ({
    count: state.home.count,
  }),
  (dispatch) => ({
    actions: bindActionCreators(Object.assign({}, homeAction), dispatch),
  })
)
class Home extends PureComponent {
  static propTypes = {
   
  }
  componentDidMount() {
    //https://cnodejs.org/api/v1/topics
    request(`${URL_PREFIX}/api/v1/topics`, {
      method: 'GET',
    }).then((res) => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  click=() => {
    const {actions} = this.props;
    actions.add();

  }
  render() {
    const {count} = this.props;
    
    return (
      <div>
        <h1 >Home1</h1>
        <h2>{count}</h2>
        <p className={styles1.test}>测试css</p>
        <p className={styles2.test}>测试less</p>
        <p className="ttt">测试非模块化</p>
        <button onClick={this.click}>add</button>
        <img src={logo} alt="logo" />
        <img src={acc_icon} alt="logo" />
        <Link to="/about">To About</Link>
        
      </div>
    );
  }
}

export default Home;
