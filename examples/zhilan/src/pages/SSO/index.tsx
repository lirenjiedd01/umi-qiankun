import { setTimeout } from 'timers';
import logo from '@/assets/logo.svg';
import { DefaultRootState } from '@/typings/connect';
import scrmStore from '@/utils/store';
import { reloadAuthorized } from '@/utils/Authorized';
import { underlize } from '@/utils/utils';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from './index.module.less';
import {
  MapStateToSSOProps,
  MapDispatchToSSOProps,
  ISSOProps,
  mapStateToSSO,
  mapDispatchToSSO,
  ISSOState,
  DynamicModelStateType,
  IDynamicConnectStateType,
} from './dispatchActions';

class SSOPage extends React.Component<ISSOProps, ISSOState> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private beisizerlinewidth = 2;
  private sinX = 0;
  private waveWidth = 0.014; // 海浪高度
  private speed = 0.1; // 数值越大速率越快
  private xofspeed = 0; // 波浪横向的偏移量
  private ctx: CanvasRenderingContext2D | null = null;
  private rand = 0;
  private beisizerwidth = 0;
  private beisizerheight = 0;
  private requestId: number | null = null;
  private ssoLoadingKey = 'sso';

  drawSin = (xofspeed: number) => {
    const sinY = this.beisizerheight / 2.0; // 轴长
    const axisLenght = this.beisizerwidth; // 弧度宽度
    const waveHeight = this.beisizerheight / 15.0;
    if (this.ctx === null) {
      return;
    }
    this.ctx.save(); // 存放贝塞尔曲线的各个点
    const points: [number, number][] = [];
    this.ctx.beginPath(); // 创建贝塞尔点
    for (let x = this.sinX; x < this.sinX + axisLenght; x += 80 / axisLenght) {
      const y = -Math.sin((this.sinX + x) * this.waveWidth + xofspeed);
      points.push([x, sinY + y * waveHeight]);
      this.ctx.lineTo(x, sinY + y * waveHeight);
    }

    this.ctx.lineTo(axisLenght, this.beisizerheight);
    this.ctx.lineTo(this.sinX, this.beisizerheight);
    this.ctx.lineTo(points[0][0], points[0][1]);
    this.ctx.stroke();
    this.ctx.restore(); // 贝塞尔曲线样式设置
    this.ctx.strokeStyle = 'rgba(24, 144, 255, 0)';
    this.ctx.fillStyle = 'rgba(24, 144, 255, 0.2)';
    this.ctx.fill();
  };

  rendY = () => {
    if (this.ctx === null) {
      return;
    }
    this.ctx.clearRect(0, 0, this.beisizerwidth, this.beisizerheight); // 控制海浪高度
    const tmp = 0.1;
    this.rand -= tmp;
    let b = this.beisizerheight - this.rand;
    // 控制循环涨潮
    if (b === this.beisizerheight) {
      this.rand = this.beisizerheight;
    }
    this.drawSin(this.xofspeed);
    this.xofspeed += this.speed;
    this.requestId = requestAnimationFrame(this.rendY);
  };

  drawWave() {
    // 获取画布
    if (this.canvasRef.current === null) {
      return;
    }
    const beisizer = this.canvasRef.current;
    this.ctx = beisizer.getContext('2d'); // 设置波浪海域（海浪宽度，高度）
    if (this.ctx === null) {
      return;
    }
    this.beisizerwidth = beisizer.width;
    this.beisizerheight = beisizer.height;
    this.rand = this.beisizerheight; // 波浪高度
    this.ctx.lineWidth = this.beisizerlinewidth;

    // 动态
    this.drawSin(0);
    this.rendY();
  }
  componentDidMount() {
    // 删除之前的用户信息，保证当前的状态为未登录
    Cookies.remove('currentAuthority');
    scrmStore.remove('USER_INFO');
    scrmStore.remove('SSO');
    reloadAuthorized();

    message.config({
      top: 200,
    });
    this.handleRoute();
    this.drawWave();
  }
  componentWillUnmount() {
    if (window.cancelAnimationFrame && this.requestId !== null) {
      window.cancelAnimationFrame(this.requestId);
    }
    message.config({
      top: 100,
    });
  }
  handleRoute = async () => {
    const { location, save } = this.props;
    const { query } = location as any;
    const ssoParam = scrmStore.get('SSO');
    if (query.token && query.back_url && query.app_id) {
      const payload = {
        token: decodeURIComponent(query.token),
        backUrl: decodeURIComponent(query.back_url),
        appId: query.app_id,
      };
      // 验证后重定向，不在url显示token
      // history.replace('/sso', payload);
      save(payload);
      scrmStore.set('SSO', payload);
      await this.handleLogin(payload.token, payload.backUrl, payload.appId);
    } else if (ssoParam !== undefined) {
      await this.handleLogin(ssoParam.token, ssoParam.backUrl, ssoParam.appId);
    } else {
      console.log(query);
      message.error({ content: '非法链接，授权失败', duration: 0 });
    }
  };
  handleLogin = async (token: string, backUrl: string, appId: string | number) => {
    const { login, saveInfo, history, selectSpace } = this.props;
    const ssoLoginMess = message.loading({ content: '授权中', key: this.ssoLoadingKey, duration: 0 });
    const res = await login({ token, appId });
    if (res.status === 1) {
      await saveInfo(res.data);
      scrmStore.set('SPACE', res.data.selectedSpace);
      await selectSpace(res.data.selectedSpace);
      Cookies.set('currentAuthority', JSON.stringify(underlize(res.data)));

      reloadAuthorized();
      setTimeout(ssoLoginMess, 100);
      message.success({ content: '授权成功, 即将跳转', key: this.ssoLoadingKey, duration: 1 });
      setTimeout(() => {
        history.replace(backUrl);
        scrmStore.remove('SSO');
      }, 1000);
    } else {
      if (res.error) {
        message.error({ content: res.error.message, key: this.ssoLoadingKey, duration: 0 });
      }
    }
  };
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logoWave}>
          <img src={logo} className={styles.logo} alt="logo" />
          <canvas ref={this.canvasRef} className={styles.canvas} />
        </div>
      </div>
    );
  }
}

export default connect<
  MapStateToSSOProps,
  MapDispatchToSSOProps,
  Omit<ISSOProps, keyof IDynamicConnectStateType>,
  DefaultRootState & DynamicModelStateType
>(
  mapStateToSSO,
  mapDispatchToSSO,
)(SSOPage);
