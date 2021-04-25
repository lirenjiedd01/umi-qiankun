import React from 'react';
import Link from 'umi/link';
import { Button } from 'antd';
import styles from './index.module.less';
import { formatMessage } from 'umi-plugin-react/locale';

const NoMatch = () => (
   <div className={styles.noMatch}>
      <div>
        <img src={require('../../../assets/no_match.png')} className={styles.noMatchImg}/>
        <div className={styles.statusName}>
          {/* 无权限访问 */}
          {
            formatMessage({
              id: "noMatch"
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

export default NoMatch;
