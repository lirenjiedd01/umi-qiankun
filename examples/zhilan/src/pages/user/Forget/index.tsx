import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row, Select, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import md5 from 'md5';
import Link from 'umi/link';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { ConnectState } from '@/typings/connect';
import {
  ForgetPageDispatchProps,
  mapStateToProps,
  GetCaptchasPayload,
  mapDispatchToProps,
  SubmitPayload,
  ForgetPageModelState,
} from './dispatchAction';
import { ForgetStateType } from './model';
import styles from './style.less';
import { formatMessage } from 'umi-plugin-react/locale';
import MobilePhonePrefix from "@/components/MobilePhonePrefix"

const FormItem = Form.Item;
const InputGroup = Input.Group;

interface ForgetPageProps extends FormComponentProps, ForgetPageModelState, ForgetPageDispatchProps { }

interface ForgetPageState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  showFlag: boolean; // 获取验证码默认无法点击
  defCheckPw?: boolean;
  defPassword?: boolean;
  prefix: string;
}

class ForgetPage extends Component<ForgetPageProps, ForgetPageState> {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    showFlag: true, // 获取验证码默认无法点击
    prefix: "86"
  };

  private interval!: NodeJS.Timeout;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setPrefix = (value)=>{
    this.setState({
      prefix: value
    })
  }

  onGetCaptcha = async () => {
    const { form } = this.props;
    const paylaod: GetCaptchasPayload = {
      mobile_number: form.getFieldValue('mobile_number'),
      usage_type: '3',
      country_code: this.state.prefix
    };
    const res = (await this.props.getCaptchas(paylaod)) as any;
    if (res.status !== 1) {
      res.error && res.error.message && message.error(res.error.message);
    } else {
      message.success(formatMessage({
        // 验证码发送成功
        id: "user.valifyCodeSendSuccess"
      }));
      let count = 59;
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
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields(
      {
        force: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (err, values) => {
        if (!err) {
          // const { prefix } = this.state;
          const payload: SubmitPayload = {
            ...values,
            password: md5(values.password),
          };
          const res = (await this.props.submit(payload)) as any;
          if (res.status !== 1) {
            res.error && res.error.message && message.error(res.error.message);
          } else {
            router.push({
              pathname: '/user/forget-result',
            });
          }
        }
      },
    );
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      this.setState({
        defCheckPw: true,
      });
      callback(formatMessage({
        // 您输入的密码不一致，请重新输入
        id: "user.passwordValifyInconsistent"
      }));
    } else {
      this.setState({
        defCheckPw: false,
      });
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;
    if (!value) {
      callback(formatMessage({
        // 请输入密码！
        id: "user.passwordValifyInput"
      }));
      this.setState({
        defPassword: true,
      });
    } else if (value.length < 8 || value.length > 16) {
      self.setState({
        defPassword: true,
      });
      callback(formatMessage({
        // 请输入8-16个字符
        id: "user.passwordValifyDigits"
      }));
    } else if (/[\u4e00-\u9fa5]/g.test(value)) {
      self.setState({
        defPassword: true,
      });
      callback(formatMessage({
        // 请输入8-16位数字、字母或常用符号
        id: "user.passwordCommonSymbolsValify"
      }));
    } else {
      self.setState({
        defPassword: false,
      });
      callback();
      form.validateFields(['confirm'], { force: true });
    }
  };

  checkMobile = (rule, value, callback) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;
    if (value) {
      if (/^\d{11}$/.test(value)) {
        self.setState({
          showFlag: false,
        });
        callback();
      } else {
        callback(formatMessage({
          // 请输入正确的手机号
          id: "user.mobilePhoneValifyInput"
        }));
        self.setState({
          showFlag: true,
        });
      }
    } else {
      callback(formatMessage({
        // 请输入手机号
        id: "user.mobilePhoneInput"
      }));
      self.setState({
        showFlag: true,
      });
    }
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count,prefix, showFlag } = this.state;
    return (
      <div className={styles.main}>
        <p className={styles.rebind_tit}>
          {
            formatMessage({
              // 找回密码
              id: "user.retrievePassword"
            })
          }
        </p>
        <Form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            <InputGroup compact>
              <MobilePhonePrefix setPrefix={this.setPrefix} value={prefix}/>
              {getFieldDecorator('mobile_number', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: this.checkMobile,
                  },
                ],
              })(
                // 去掉input自动填充问题
                <span style={{ width: '80%' }}>
                  <Input size="large" 
                         type="text" 
                         className={styles.mobile} 
                         placeholder={
                          formatMessage({
                            // 11位手机号
                            id: "user.phonePlaceHolder"
                          })} 
                         autoComplete="off" />
                  <Input type="password" autoComplete="new-password" style={{ display: 'none' }} />
                </span>,
              )}
            </InputGroup>
          </FormItem>
          <Row gutter={8}>
            <Col span={14}>
              <FormItem>
                {getFieldDecorator('verification_code', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        // 请输入验证码
                        id: "user.valifyCodePlaceHolder"
                      }),
                    },
                  ],
                })(<Input size="large" placeholder={
                  formatMessage({
                    // 输入验证码
                    id: "login.valifyCodeInput"
                  })
                } autoComplete="off" />)}
              </FormItem>
            </Col>
            <Col span={10}>
              {showFlag ? (
                <Button size="large" disabled={true} className={styles.getCaptcha}>
                  {
                    formatMessage({
                      // 获取验证码
                      id: "login.getValifyCode"
                    })
                  }
                </Button>
              ) : (
                  <Button size="large" disabled={!!count} className={styles.getCaptcha} onClick={this.onGetCaptcha}>
                    {count ? `${count} s` : 
                      formatMessage({
                        // 获取验证码
                        id: "login.getValifyCode"
                      })
                    }
                  </Button>
                )}
            </Col>
          </Row>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(<Input size="large" type="password" placeholder={
              formatMessage({
                // 密码8-16位，区分大小写
                id: "user.passwordPlaceholder"
              })
            } />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('confirm', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    // 请确认密码!
                    id: "user.confirmPasswordValify"
                  }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={
              formatMessage({
                // 确认密码
                id: "user.confirmPasswordPlaceHolder"
              })
            } />)}
          </FormItem>
          <FormItem>
            <Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              {
                formatMessage({
                  // 确认
                  id: "user.confirm"
                })
              }
            </Button>
          </FormItem>
        </Form>
        <p style={{ textAlign: 'center' }}>
          <Link className={styles.login} to="/users/login">
            {
              formatMessage({
                // 使用已有帐号登录
                id: "user.alreadyAccount"
              })
            }
          </Link>
        </p>
      </div>
    );
  }
}

// NOTE: 固定写法
type OmitKey = keyof ForgetPageDispatchProps & keyof ForgetStateType;

export default connect<
  ForgetStateType,
  ForgetPageDispatchProps,
  Omit<ForgetPageProps, keyof OmitKey>,
  ConnectState<ForgetPageModelState>
>(
  mapStateToProps,
  mapDispatchToProps as any,
)(Form.create<ForgetPageProps>()(ForgetPage));
