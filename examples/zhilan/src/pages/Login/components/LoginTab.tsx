import { Tabs } from 'antd';
import React, { Component } from 'react';
import LoginContext from './LoginContext';
const { TabPane } = Tabs;

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

interface LoginTabProps {
  tabUtil: any;
}

class LoginTab extends Component<LoginTabProps, {}> {
  public uniqueId = '';

  constructor(props: LoginTabProps) {
    super(props);
    this.uniqueId = generateId('login-tab-');
  }

  public componentDidMount() {
    const { tabUtil } = this.props;

    if (tabUtil) {
      tabUtil.addTab(this.uniqueId);
    }
  }

  public render() {
    const { children } = this.props;
    return <TabPane {...this.props}>{children}</TabPane>;
  }
}

const WrapContext = (props: any) => (
  <LoginContext.Consumer>
    {(value: any) => <LoginTab tabUtil={value.tabUtil} {...props} />}
  </LoginContext.Consumer>
); // 标志位 用来判断是不是自定义组件

WrapContext.typeName = 'LoginTab';
export default WrapContext;
