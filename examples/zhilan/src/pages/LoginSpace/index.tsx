import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Carousel, Spin } from 'antd';
import cls from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import router from 'umi/router';
import scrmStore from '@/utils/store';
import { ISpaceItem } from '../../models/globalModel';
import styles from './index.less';

export interface LoginSpaceState {
  current: number;
  selectedSpace: ISpaceItem;
  space_name: string;
}

export interface LoginSpaceProps {
  global: any;
  selectSpaceInto: (space, isGoHome?) => void;
  fetchRoleSpaces: (space_name, isReload?, callback?) => void;
}

class LoginSpace extends React.Component<LoginSpaceProps, LoginSpaceState>{
  private Carousel: Carousel | null = null;

  public state = {
    current: 0,
    selectedSpace: scrmStore.get('SPACE') || { id: 0, name: '' },
    space_name: ''
  };

  onPrev = () => {
    if (this.state.current !== 0) {
      this.Carousel && this.Carousel.prev();
    }
  };

  onNext = () => {
    let { roleSpaces } = this.props.global;
    if (this.state.current !== roleSpaces.length - 1) {
      this.Carousel && this.Carousel.next();
    }
  };

  onChangeSpaceName = (e) => {
    this.setState({ space_name: e.target.value });
  };

  onBeforeChange = (from, to) => {
    this.setState({ current: to });
  };

  onSelectSpace = (spaceItem) => {
    this.setState({ selectedSpace: spaceItem }, () => {
      this.onEnterInto();
    });
  };

  onEnterInto = () => {
    this.props.selectSpaceInto(this.state.selectedSpace);
  };

  render() {
    const { current, selectedSpace, space_name } = this.state;
    const { rowSpaces } = this.props.global;
    let roleSpaces = this.props.global.roleSpaces || [];
    if (!rowSpaces || rowSpaces.length === 1) {
      return <div className={styles.loading}><Spin spinning={true}></Spin></div>;
    }
    console.log(current, rowSpaces, roleSpaces)
    return <div className={styles.LoginSpaceContainer}>
      {rowSpaces && rowSpaces.length ? <><div className={cls(styles.searchHeader, styles.newSearch)}>
        <p>请选择要进入的空间</p>
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="空间名称" className={styles.spaceNameInput} onChange={this.onChangeSpaceName} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => {
              this.setState({ current: 0 }, () => this.Carousel && this.Carousel.goTo(0));
              this.props.fetchRoleSpaces(space_name, true)
            }}>
              <SearchOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
        <div className={cls(styles.CarouselContainer, { [styles.flexCenter]: !roleSpaces.length })}>
          <Carousel dots={false} effect="fade" ref={(node) => this.Carousel = node} beforeChange={this.onBeforeChange}>
            {roleSpaces.map((spaceGroup, index) => {
              return <div key={index}>
                <div className={styles.spaceItemContainer}>
                  {spaceGroup.map((item) => {
                    return <div className={cls(styles.spaceItem, { [styles.selected]: selectedSpace.id === item.id })}
                      key={item.id} onClick={() => this.onSelectSpace(item)}>
                      <div>{item.name}</div>
                      <div>{item.space_no}</div>
                    </div>;
                  })}
                </div>
              </div>;
            })}
          </Carousel>
          {roleSpaces.length > 1 && <div className={styles.prevBtn} onClick={this.onPrev}>
            <span className={cls(styles.prevIcon, { [styles.prevIcon_disabeld]: current === 0 })}></span>
          </div>}
          {roleSpaces.length > 1 && <div className={styles.nextBtn} onClick={this.onNext}>
            <span className={cls(styles.nextIcon, { [styles.nextIcon_disabeld]: current === roleSpaces.length - 1 })}></span>
          </div>}
        </div></> : <div className={styles.NoSpacesContainer}>
          <div className={styles.noSpacesBox}>
            <h3>暂无空间访问</h3>
            <img src={require('@/assets/not_spaces@2x.png')} />
            <Button type="primary" style={{ width: '88px' }} onClick={() => router.replace('/users/login')}>返回登录</Button>
          </div>
        </div>}
    </div>;
  }
}

export default connect((state: any) => {
  return {
    global: state.global,
  };
}, (dispatch: Function) => {
  return {
    selectSpaceInto: (sapce) => {
      dispatch({ type: 'global/selectSpaceInto', payload: sapce });
    },
    fetchRoleSpaces: (space_name, isReload) => {
      dispatch({ type: 'global/fetchRoleSpaces', payload: { space_name }, isReload });
    }
  };
})(LoginSpace);