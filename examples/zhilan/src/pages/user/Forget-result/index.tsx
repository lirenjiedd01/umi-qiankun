import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';
import { formatMessage } from 'umi-plugin-react/locale';

const RegisterResult = () => {
  const actions = (
    <div className={styles.actions}>
      <Link to="/users/login">
        <Button size="large" type="primary">
          {
            formatMessage({
              // 立即登录
              id: "user.logining"
            })
          }
        </Button>
      </Link>
    </div>
  );
  
  return(
    <Result
      className={styles.registerResult}
      status="success"
      title={
        <div className={styles.title}>
          {
            formatMessage({
              // 修改密码成功
              id: "user.updatePassword"
            })
          }
        </div>
      }
      extra={actions}
    />
)};

export default RegisterResult;
