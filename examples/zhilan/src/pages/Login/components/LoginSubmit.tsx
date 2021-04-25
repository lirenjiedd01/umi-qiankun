import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from '../styles/login.module.less';
const FormItem = Form.Item;

// NOTE: 暂时显示声明为 any
const LoginSubmit = ({ className, ...rest }: any) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
