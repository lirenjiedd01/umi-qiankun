import { Menu,Dropdown } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import React from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import cls from 'classnames';
import styles from './index.module.less';

const SelectLang = props => {
  const { className } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }) => setLocale(key, false);

  const locales = ['zh-CN','ja-JP'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'ja-JP':'日本語'
  };
  
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'ja-JP': 'jp'
  };
  
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={langMenu}>
      <span className={cls(styles.dropDown, className)}>
          {formatMessage({
            id: 'navbar.lang',
          })}
          <CaretDownOutlined style={{ marginLeft:8 }}/>
      </span>
    </Dropdown>
  );
};

export default SelectLang;
