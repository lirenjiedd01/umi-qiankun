import { Menu, Spin } from "antd"; // Avatar,
import Icon from '@ant-design/icons';
import ClickParam  from "antd/es/menu";
import { FormattedMessage } from "umi-plugin-react/locale";
import React from "react";
import { connect } from "dva";
import router from "umi/router";

import { ConnectProps, ConnectState } from "@/models/connect";
// import { CurrentUser } from "@/models/user";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: any;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  onMenuClick = (event: ClickParam) => {
    const { key }:any = event;

    if (key === "logout") {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: "account/logout"
        });
      }

      return;
    }
    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser = {}, menu } = this.props;
    if (!menu) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.avatar}
            alt="avatar"
          /> */}
          <span className={styles.name}>{currentUser.username}</span>
          <span>--</span>
          <span className={styles.name}>
          {
            JSON.parse(localStorage.getItem('antd-pro-authority') || '').includes('admin') ? '管理员' : '普通用户'
          }
          </span>
        </span>
      );
    }
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
      >
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <span className={styles.name}>{currentUser.username}</span>
          <span>--</span>
          <span className={styles.name}>
          {
            JSON.parse(localStorage.getItem('antd-pro-authority') || '').includes('admin') ? '管理员' : '普通用户'
          }
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ account }: ConnectState) => ({
  currentUser: account
}))(AvatarDropdown);
