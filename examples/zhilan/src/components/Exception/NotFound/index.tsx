import React from 'react';
import Link from 'umi/link';
import { Button } from 'antd';
import styles from './index.module.less';
import { formatMessage } from 'umi-plugin-react/locale';

const NotFound = () => (
   <div className={styles.notFound}>
      <div>
        <img src={require('../../../assets/no_found.png')} className={styles.notFoundImg}/>
        <div className={styles.statusName}>
          {/* 页面不存在 */}
          {
            formatMessage({
              id: "noFound"
            })
          }
        </div>
        <Link to="/home">
          <Button type="primary">
            {/* 返回到首页 */}
            {
              formatMessage({
                id: "backTohome"
              })
            }
          </Button>
        </Link>
      </div>
   </div>
);

export default NotFound;
