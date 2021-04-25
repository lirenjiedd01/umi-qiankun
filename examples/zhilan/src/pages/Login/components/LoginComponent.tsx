import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tabs } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import classNames from 'classnames';
import React, { Component } from 'react';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import styles from '../styles/login.module.less';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';

interface LoginProps extends FormComponentProps {
  className: string;
  defaultActiveKey: string;
  onTabChange: (type: string) => void;
  onSubmit: (err: Error, values: any) => void;
  onCreate: (from: WrappedFormUtils<any>) => void;
}

interface LoginState {
  type: string;
  tabs: any;
  active: any;
}

class LoginComponent extends Component<LoginProps, LoginState> {
  public static Tab = LoginTab;
  public static Submit = LoginSubmit;
  public static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {
      console.log('');
    },
    onSubmit: () => {
      console.log('');
    },
  };

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  public componentDidMount() {
    const { form, onCreate } = this.props;

    if (onCreate) {
      onCreate(form);
    }
  }

  public onSwitch = (type: string) => {
    this.setState(
      {
        type,
      },
      () => {
        const { onTabChange } = this.props;

        if (onTabChange) {
          onTabChange(type);
        }
      },
    );
  };
  public getContext = () => {
    const { form } = this.props;
    const { tabs = [] } = this.state;
    return {
      tabUtil: {
        addTab: (id: string) => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: (id: string) => {
          this.setState({
            tabs: tabs.filter((currentId: string) => currentId !== id),
          });
        },
      },
      form: { ...form },
      updateActive: (activeItem: any) => {
        const { type = '', active = {} } = this.state;

        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }

        this.setState({
          active,
        });
      },
    };
  };
  public handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];

    if (form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          if (onSubmit) {
            onSubmit(err, values);
          }
        },
      );
    }
  };

  public render() {
    const { className, children } = this.props;
    const { type, tabs = [] } = this.state;
    const TabChildren: any[] = [];
    const otherChildren: any[] = [];
    React.Children.forEach(children, (child: any) => {
      if (!child) {
        return;
      }

      if (child.type.typeName === 'LoginTab') {
        TabChildren.push(child);
      } else {
        otherChildren.push(child);
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            {tabs.length ? (
              <React.Fragment>
                <Tabs animated={false} centered activeKey={type} onChange={this.onSwitch}>
                  {TabChildren}
                </Tabs>
                {otherChildren}
              </React.Fragment>
            ) : (
                children
              )}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

// NOTE: 这样向 class 中添加属性欠妥, 过于动态了;
Object.keys(LoginItem).forEach(item => {
  (LoginComponent as any)[item] = LoginItem[item];
});

export default Form.create<LoginProps>()(LoginComponent);
