import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';
import Cookies from 'js-cookie'
import { formatMessage } from 'umi-plugin-react/locale';

const RegisterResult = () => {
  let account = ''
  if (Cookies.get('currentAuthority') && JSON.parse(Cookies.get('currentAuthority') as string).account_name) {
    account = JSON.parse(Cookies.get('currentAuthority') as string).account_name;
  }

  const actions = (
    <div className={styles.actions}>
      <Link to="/">
        <Button size="large" type="primary">
          {
            formatMessage({
              // 进入后台
              id: "user.enterBackstage"
            })
          }
        </Button>
      </Link>
    </div>
  );
  
  return (
    <div className={styles.registerResult}>
      <p className={styles.rebind_tit}>
        {
          formatMessage({
            // 注册
            id: "user.register"
          })
        }
      </p>
      <Result
        className={styles.content}
        status="success"
        title={
          <div className={styles.title}>
            <p className={styles.regSucc}>
              {
                formatMessage({
                  // 注册成功
                  id:"user.registerSuccess"
                })
              }
            </p>
            <div className={styles.accountBox}>
              {
                formatMessage({
                  // 你的账号
                  id: "user.yourAccount"
                })
              }：<span>{account}</span>
            </div>
          </div>
        }
        extra={actions}
      />
    </div>
    
  );
}



export default RegisterResult;
