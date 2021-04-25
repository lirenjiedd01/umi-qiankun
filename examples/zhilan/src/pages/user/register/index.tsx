import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, Input, Row, Select, message } from "antd";
import React, { Component } from "react";
import Link from "umi/link";
import { connect } from "dva";
import router from "umi/router";
import md5 from "md5";
import { FormComponentProps } from "@ant-design/compatible/lib/form";
import { ConnectState } from "@/typings/connect";
import styles from "./style.less";
import {
  RegisterPageModelState,
  RegisterPageDispatchProps,
  mapStateToProps,
  mapDispatchToProps
} from "./dispatchAction";
import { RegisterStateType } from "./model";
import { checkNameByReg,valifyStringLength } from '@/utils/utils'
import { formatMessage } from 'umi-plugin-react/locale';
import MobilePhonePrefix from "@/components/MobilePhonePrefix"

const FormItem = Form.Item;
const InputGroup = Input.Group;

interface RegisterPageState {
  count: number;
  showFlag: boolean; // 获取验证码默认无法点击,
  defAccout: boolean;
  defPassword: boolean;
  defCheckPw: boolean;
  defMobile: boolean;
  defCaptcha: boolean;
  isClicked: boolean;
  prefix: string;
}

interface RegisterPageProps
  extends FormComponentProps,
  RegisterPageModelState,
  RegisterPageDispatchProps { }

class RegisterPage extends Component<RegisterPageProps, RegisterPageState> {
  state = {
    count: 0,
    showFlag: true, // 获取验证码默认无法点击,
    defAccout: true,
    defPassword: true,
    defCheckPw: true,
    defMobile: true,
    defCaptcha: true,
    isClicked: false,
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
    const res = (await this.props.getCaptchas({
      mobile_number: form.getFieldValue("mobile_number"),
      usage_type: "1",
      country_code: this.state.prefix
    })) as any;
    if (res.status !== 1) {
      res.error && res.error.message && message.error(res.error.message);
    } else {
      message.success(formatMessage({
        // 验证码发送成功
        id: "user.valifyCodeSendSuccess"
      }));
      let count = 59;
      this.setState({
        count
      });
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({
          count
        });

        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isClicked: true });
    const { form } = this.props;
    form.validateFields(
      {
        force: true
      },
      async (err, values) => {
        if (!err) {
          const payload = {
            ...values,
            password: md5(values.password),
            country_code: this.state.prefix
          };
          const res = (await this.props.submit(payload)) as any;
          if (res.status !== 1) {
            res.error && res.error.message && message.error(res.error.message);
            this.setState({ isClicked: false });
          } else {
            router.push({
              pathname: "/user/register-result"
            });
          }
        }
      }
    );
  };

  // 校验帐号名称唯一性(调用接口，有回调)
  checkAccount = async (rule, value, callback) => {
    let self = this;
    if (value) {
      console.log('校验开始=====')

      if(!value.trim().length){
        self.setState({
          defAccout: true
        });
        callback(formatMessage({
          // 请输入帐号名称
          id:"user.accountNameValify"
        }));
      }

      else if (!valifyStringLength({ str: value, min: 5, max: 25 })){
        self.setState({
          defAccout: true
        });
        callback(formatMessage({
          // 5-25个常用字符，推荐使用企业/商家名称注册
          id: "user.accountNameDigitsValify"
        }))
      }

      else if(!checkNameByReg(value)){
        self.setState({
          defAccout: true
        });
        callback(formatMessage({
          // 请输入30位以内的常用字符
          id: "user.accountNameUseDigitsValify"
        }))
      }

      else{

        const res = (await this.props.checkAccounts({
          account_name: value
        })) as any;
  
        if (res.status !== 1) {
          self.setState({
            defAccout: true
          });
          callback(res.error.message);
        } else {
          self.setState({
            defAccout: false
          });
          callback();
        }
      }


      // if (/^[a-zA-Z\u4e00-\u9fa5]{5,25}$/.test(value)) {
      //   const res = (await this.props.checkAccounts({
      //     account_name: value
      //   })) as any;

      //   if (res.status !== 1) {
      //     self.setState({
      //       defAccout: true
      //     });
      //     callback(res.error.message);
      //   } else {
      //     self.setState({
      //       defAccout: false
      //     });
      //     callback();
      //   }
      // } else {
      //   self.setState({
      //     defAccout: true
      //   });
      //   callback("5-25个中文或字母，推荐使用企业/商家名称注册");
      // }
    } else {
      self.setState({
        defAccout: true
      });
      callback(formatMessage({
        // 请输入帐号名称
        id:"user.accountNameValify"
      }));
    }
  };

  // 校验手机号唯一性(调用接口，有回调)
  checkMobile = async (rule, value, callback) => {
    let self = this;
    if (value) {
      if (/^\d{11}$/.test(value)) {
        const res = (await this.props.checkMobiles({
          mobile_number: value
        })) as any;
        if (res.status !== 1) {
          callback(res.error.message);
          self.setState({
            showFlag: true,
            defMobile: true
          });
        } else {
          callback();
          self.setState({
            showFlag: false,
            defMobile: false
          });
        }
      } else {
        callback(formatMessage({
          // 请输入正确的手机号
          id: "user.mobilePhoneValifyInput"
        }));
        self.setState({
          showFlag: true,
          defMobile: true
        });
      }
    } else {
      callback(formatMessage({
        // 请输入手机号!
        id: "user.mobilePhoneInput"
      }));
      self.setState({
        showFlag: true,
        defMobile: true
      });
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue("password")) {
      this.setState({
        defCheckPw: true
      });
      callback(formatMessage({
        // 您输入的密码不一致，请重新输入
        id: "user.passwordValifyInconsistent"
      }));
    } else {
      this.setState({
        defCheckPw: false
      });
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    let self = this;
    if (!value) {
      callback(formatMessage({
        // 请输入密码！
        id:"user.passwordValifyInput"
      }));
      this.setState({
        defPassword: true
      });
    } else if (value.length < 8 || value.length > 16) {
      self.setState({
        defPassword: true
      });
      callback(formatMessage({
        // 请输入8-16个字符
        id: "user.passwordValifyDigits"
      }));
    } else if (!/[\da-zA-Z_@#%\-]/g.test(value)) {
      self.setState({
        defPassword: true
      });
      callback(formatMessage({
        // 请输入8-16位数字、字母或常用符号
        id: "user.passwordCommonSymbolsValify"
      }));
    } else {
      self.setState({
        defPassword: false
      });
      callback();
      form.validateFields(["confirm"], { force: true });
    }
  };

  checkVerCode = (rule, value, callback) => {
    if (value) {
      this.setState({
        defCaptcha: false
      });
      callback();
    } else {
      this.setState({
        defCaptcha: true
      });
      callback(formatMessage({
        // 请输入验证码
        id: "user.valifyCodePlaceHolder"
      }));
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      count,
      showFlag,
      defAccout,
      defPassword,
      defCheckPw,
      defMobile,
      defCaptcha,
      isClicked,
      prefix
    } = this.state;
    return (
      <div className={styles.main}>
        <p className={styles.rebind_tit}>
          {
            formatMessage({
              // 注册
              id: 'user.register'
            })
          }
        </p>
        <Form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator("account_name", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  validator: this.checkAccount
                }
              ]
            })(
              // 去掉input自动填充问题
              <span>
                <Input
                  size="large"
                  type="text"
                  placeholder={
                    formatMessage({
                      // 账号名称
                      id: 'user.accountName'
                    })
                  }
                  autoComplete="off"
                />
                <Input
                  type="password"
                  autoComplete="new-password"
                  style={{ display: "none" }}
                />
              </span>
            )}
          </FormItem>
          <p
            style={{
              marginTop: "-18px",
              color: 'rgba(26, 68, 127, 0.65)',
              fontSize: 12,
              paddingBottom: '8px'
            }}
          >
            {
              formatMessage({
                // 推荐使用企业或商户名称，注册成功后将不能修改
                id: 'user.accountNameTip'
              })
            }
          </p>
          <FormItem hasFeedback>
            {getFieldDecorator("password", {
              validateTrigger: "onBlur",
              rules: [
                {
                  validator: this.checkPassword
                }
              ]
            })(
              <Input
                size="large"
                type="password"
                placeholder={
                  formatMessage({
                    // 密码8-16位，区分大小写
                    id: 'user.passwordPlaceholder'
                  })
                }
              />
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator("confirm", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    // 请确认密码！
                    id: "user.confirmPasswordValify"
                  })
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(<Input size="large" type="password" placeholder={
              formatMessage({
                // 确认密码
                id: 'user.confirmPasswordPlaceHolder'
              })
            } />)}
          </FormItem>
          <FormItem hasFeedback>
            <InputGroup compact>
              <MobilePhonePrefix setPrefix={this.setPrefix} value={prefix}/>
              {getFieldDecorator("mobile_number", {
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    validator: this.checkMobile
                  }
                ]
              })(
                <Input
                  size="large"
                  className={styles.mobile}
                  style={{
                    width: "80%"
                  }}
                  placeholder={
                    formatMessage({
                      // 11位手机号
                      id: 'user.phonePlaceHolder'
                    })
                  }
                />
              )}
            </InputGroup>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={14}>
                {getFieldDecorator("verification_code", {
                  rules: [
                    {
                      validator: this.checkVerCode
                    }
                  ]
                })(
                  <Input
                    size="large"
                    placeholder={
                      formatMessage({
                        // 输入验证码
                        id: "login.valifyCodeInput"
                      })
                    }
                    autoComplete="off"
                  />
                )}
              </Col>
              <Col span={10}>
                {showFlag ? (
                  <Button
                    size="large"
                    disabled={true}
                    className={styles.getCaptcha}
                  >
                    {
                      formatMessage({
                        // 获取验证码
                        id:"login.getValifyCode"
                      })
                    }
                  </Button>
                ) : (
                    <Button
                      size="large"
                      disabled={!!count}
                      className={styles.getCaptcha}
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : formatMessage({
                        // 获取验证码
                        id:"login.getValifyCode"
                      })}
                    </Button>
                  )}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={isClicked && !defAccout}
              className={styles.submit}
              disabled={
                defAccout ||
                defPassword ||
                defCheckPw ||
                defMobile ||
                defCaptcha ||
                isClicked
              }
              type="primary"
              htmlType="submit"
            >
              {
                formatMessage({
                  // 注册
                  id: "user.register"
                })
              }
            </Button>
          </FormItem>
        </Form>
        <p style={{ textAlign: "center" }}>
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
type OmitKey = keyof RegisterPageDispatchProps & keyof RegisterStateType;

export default connect<
  RegisterStateType,
  RegisterPageDispatchProps,
  Omit<RegisterPageProps, keyof OmitKey>,
  ConnectState<RegisterPageModelState>
>(
  mapStateToProps,
  mapDispatchToProps as any
)(Form.create<RegisterPageProps>()(RegisterPage));
