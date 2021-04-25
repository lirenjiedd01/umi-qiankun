import {
  MenuDataItem,
} from "@ant-design/pro-layout";

import React from "react";
import { connect } from "dva";
import { ConnectProps, ConnectState } from "@/models/connect";
import styles from "./UserLayout.less";

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    children,
  } = props;

  return (
    <div className={styles.container}>
      <h1>Backstage management system</h1>
      {children}
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings
}))(UserLayout);
