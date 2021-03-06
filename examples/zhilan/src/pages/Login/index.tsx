// eslint-disable-next-line @typescript-eslint/camelcase
import { Checkbox } from 'antd';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import md5 from 'md5';
import React, { Component } from 'react';
import Link from 'umi/link';
import { ConnectState } from '@/typings/connect';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import LoginComponents from './components/LoginComponent';
import MobilePhonePrefix from "@/components/MobilePhonePrefix"
import { formatMessage } from 'umi-plugin-react/locale';
import {
  LoginPageDispatchProps,
  LoginPayload,
  mapDispatchToProps,
  mapStateToProps,
  LoginPageModelState,
} from './dispatchAction';
import styles from './login.less';

const { Tab, UserName, Password, Mobile, Submit, Captcha } = LoginComponents as any;

interface IFromData {
  password: string;
  // eslint-disable-next-line camelcase
  account_name: string;
  // eslint-disable-next-line camelcase
  mobile_number: number;
  // eslint-disable-next-line camelcase
  verification_code: number;
}

interface LoginPageProps extends LoginPageModelState, LoginPageDispatchProps {}

interface LoginPageState {
  type: string;
  autoLogin: boolean;
  showFlag: boolean;
  prefix: string;
}


class Login extends Component<LoginPageProps, LoginPageState> {
  public state = {
    type: 'account',
    autoLogin: false,
    showFlag: true,
    prefix: "86"
  };
  private loginForm!: WrappedFormUtils;

  public setPrefix = (value)=>{
    this.setState({
      prefix: value
    });
  }

  public changeAutoLogin = (e: any) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  public handleSubmit = (err: Error, values: IFromData) => {
    const { type, autoLogin } = this.state;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { account_name, password, mobile_number, verification_code } = values;
    console.log('values=========', values);
    if (!err) {
      let payload: Partial<LoginPayload> = {
        autoLogin,
      };
      if (type === 'account') {
        // ???????????????
        payload.account_name = account_name;
        payload.password = md5(password);
      } else {
        // ?????????
        // eslint-disable-next-line @typescript-eslint/camelcase
        payload.mobile_number = mobile_number;
        payload.verification_code = verification_code;
      }
      this.props.login(payload as LoginPayload);
    }
  };

  public onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  public onPressEnter = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (this.loginForm) {
      this.loginForm.validateFields(this.handleSubmit);
    }
  };

  // ?????????????????????
  public onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.loginForm.validateFields(['mobile_number'], {}, async (err, values) => {
        console.log(values);
        if (err) {
          reject(err);
        } else {
          try {
            const success = await this.props.getCaptchas({
              mobile_number: values.mobile_number,
              usage_type: '2',
              country_code: this.state.prefix
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  public checkMobile = (rule: any, value: string, callback: (msg?: string) => void) => {
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
          // ???????????????????????????
          id: "user.mobilePhoneValifyInput"
        }));
        self.setState({
          showFlag: true,
        });
      }
    } else {
      callback(formatMessage({
        //??????????????????
        id: "login.mobilePhoneInput"
      }));
      self.setState({
        showFlag: true,
      });
    }
  };

  public onCreateHandle = (form: WrappedFormUtils<any>) => {
    this.loginForm = form;
  };

  public render() {
    const { submitting } = this.props;
    const { type,prefix, autoLogin, showFlag } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={this.onCreateHandle}
        >
          <Tab key="account" tab={
            formatMessage({
              // ????????????
              id: "login.accountSecretLogin"
            })
          }>
            <UserName
              name="account_name"
              placeholder={
                formatMessage({
                  // ??????
                  id: "login.accountPlaceholder"
                })
              }
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    // ??????????????????
                    id: "login.accountValify"
                  }),
                },
              ]}
              // style={{marginBottom: '20px'}}
            />
            
            <Password
              name="password"
              placeholder={
                formatMessage({
                  // ??????
                  id: "login.passwordPlaceHolder"
                })
              }
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    // ??????????????????
                    id: "login.passwordValify"
                  }),
                },
              ]}
              onPressEnter={this.onPressEnter}
            />
          </Tab>
          <Tab key="mobile" tab={
            formatMessage({
              // ????????????
              id: "login.smsLogin"
            })
          }>
            <Mobile
              name="mobile_number"
              prefixcomp={<MobilePhonePrefix size="middle" setPrefix={this.setPrefix} value={prefix}/>}
              placeholder={
                formatMessage({
                  // 11????????????
                  id:"login.phonePlaceHolder"
                })
              }
              rules={[
                {
                  required: true,
                  validator: this.checkMobile,
                },
              ]}
              style={{marginBottom: '20px'}}
            />
            <Captcha
              name="verification_code"
              placeholder={
                formatMessage({
                  // ??????????????????
                  id:"login.valifyCodeInput"
                })
              }
              countDown={60}
              showFlag={showFlag}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={
                formatMessage({
                  // ???????????????
                  id: "login.getValifyCode"
                })
              }
              getCaptchaSecondText="s"
              autoComplete="false"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    // ?????????????????????
                    id:"user.valifyCodePlaceHolder"
                  }),
                },
              ]}
            />
          </Tab>
          <Submit loading={submitting} className={styles.submit}>
            {
              formatMessage({
                // ??????
                id: "login.login"
              })
            }
          </Submit>
          <div className={styles.LoginFormfooter}>
            <div className={styles.flexBetween}>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <span className={styles.text}>
                  {
                    formatMessage({
                      // ????????????
                      id:"login.autoLogin"
                    })
                  }
                </span>
              </Checkbox>
              <Link to="/user/forget" className={styles.btnStyle}>
                {
                  formatMessage({
                    // ????????????
                    id: "login.forgetPassword"
                  })
                }
              </Link>
            </div>
            <div style={{height:'20px',marginBottom:'5px'}}><Link to="/user/register" className={styles.btnStyle}>
              {
                formatMessage({
                  // ????????????
                  id: "login.goRegister"
                })
              } {">>"}
            </Link></div>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

// NOTE: ????????????
type OmitKey = keyof LoginPageDispatchProps & keyof ReturnType<typeof mapStateToProps>;

export default connect<
  LoginPageModelState,
  LoginPageDispatchProps,
  Omit<LoginPageProps, keyof OmitKey>,
  ConnectState<LoginPageModelState>
>(
  mapStateToProps,
  mapDispatchToProps as any,
)(Login);
