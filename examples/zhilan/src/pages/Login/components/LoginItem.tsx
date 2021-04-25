import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'omit.js';
import React, { Component } from 'react';
import styles from '../styles/login.module.less';
import LoginContext from './LoginContext';
import ItemMap from './map';
const FormItem = Form.Item;

// NOTE: 由于当前页面重构导致现在类型暂时不清晰; 故先使用 ``any`` 类型跳过 ``ts`` 的类型检查

interface WrapFormItemProps {
  name: string;
  countDown: number;
  updateActive: (name?: string) => void;
  onGetCaptcha: () => boolean | Promise<any>;
  [key: string]: any;
}

interface WrapFormItemState {
  count: number;
}

class WrapFormItem extends Component<WrapFormItemProps, WrapFormItemState> {
  public static defaultProps = {
    getCaptchaButtonText: 'captcha',
    getCaptchaSecondText: 'second',
  };
  private interval!: NodeJS.Timeout;

  constructor(props: WrapFormItemProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  public componentDidMount() {
    const { updateActive, name = '' } = this.props;

    if (updateActive) {
      updateActive(name);
    }
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  public onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;
    const result = onGetCaptcha ? onGetCaptcha() : null;

    if (result === false) {
      return;
    }

    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };

  public getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }: any) => {
    const options: any = {
      rules: rules || customProps.rules,
    };

    if (onChange) {
      options.onChange = onChange;
    }

    if (defaultValue) {
      options.initialValue = defaultValue;
    }

    return options;
  };

  public runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({
      count,
    });

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  public render() {
    const { count } = this.state; // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil

    const {
      onChange,
      customProps,
      defaultValue,
      rules,
      name,
      getCaptchaButtonText,
      showFlag,
      getCaptchaSecondText,
      updateActive,
      type,
      form,
      tabUtil,
      ...restProps
    } = this.props;

    if (!name) {
      return null;
    }

    if (!form) {
      return null;
    }

    const { getFieldDecorator } = form; // get getFieldDecorator props

    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    if (type === 'Captcha') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <Row gutter={8}>
          <Col span={14}>
            <FormItem>
              {getFieldDecorator(name, {
                validateTrigger: 'onBlur',
                ...options
              })(<Input {...customProps} {...inputProps} autoComplete="off" />)}
            </FormItem>
          </Col>
          <Col span={10}>
            {
              showFlag ?
                <Button
                  size="large"
                  disabled={true}
                  className={styles.getCaptcha}
                >{getCaptchaButtonText}
                </Button> :
                <Button
                  disabled={!!count}
                  className={styles.getCaptcha}
                  size="large"
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
                </Button>}
          </Col>
        </Row>
      );
    }

    if(type === "Mobile"){
      return (
        <FormItem hasFeedback={true}>
          <Input.Group compact>
            <div className={styles.mobilePrefix}>{ otherProps.prefixcomp }</div>
            {getFieldDecorator(name, {
              validateTrigger: 'onBlur',
              ...options
            })(<Input {...customProps} {...otherProps} style={{width:"81%"}}/>)}
          </Input.Group>
        </FormItem>
      )
    }

    return (
      <FormItem hasFeedback={true}>
        {getFieldDecorator(name, {
          validateTrigger: 'onBlur',
          ...options
        })(<Input {...customProps} {...otherProps} />)}
      </FormItem>
    );
  }
}

const LoginItem: any = {};

Object.keys(ItemMap).forEach((key: string) => {
  const item = ItemMap[key as keyof typeof ItemMap];
  // NOTE: 暂时 any
  LoginItem[key] = (props: any) => (
    <LoginContext.Consumer>
      {(context: any) => (
        <WrapFormItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItem;
