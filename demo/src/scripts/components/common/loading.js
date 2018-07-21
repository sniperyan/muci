import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import Exception from '../exception';
import { Link } from 'react-router-dom';

//异步加载js module loading
export default function Loading(props) {
  if (props.isLoading) {
    if (props.timedOut) {
      return <Exception type="模块加载超时" 
        style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
    } else if (props.pastDelay) {
      return <Spin size="large" className={styles.globalSpin} />;
    } else {
      return null;
    }
  } else if (props.error) {
    return <Exception type="模块加载失败" 
      style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
  } else {
    return null;
  }
}