import React, { useState } from 'react';
import { Popover, Button, Select, Spin} from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { ISpaceItem } from '@/models/globalModel';
import { LoginSpaceProps } from '@/pages/LoginSpace';
import { formatMessage } from 'umi-plugin-react/locale';
import { setLocale } from 'umi-plugin-react/locale';

export interface SwitchSpaceProps extends LoginSpaceProps {}

const SwitchSpace: React.FC<SwitchSpaceProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [currentSelectedSpace, setSelectedSpace] = useState<ISpaceItem>(props.global.selectedSpace);
    const [visible, setVisible] = useState(false);
    const { rowSpaces, selectedSpace } = props.global;
    const onChangeSpace = (space_id) => {
       let space = rowSpaces.find( item => item.id === space_id);
       setSelectedSpace(space);
    };
    const onSwitch = () => {
        if (currentSelectedSpace.id !== selectedSpace.id) {
            props.selectSpaceInto(currentSelectedSpace, true);
        }
        setVisible(false);
    }
    const renderContent = () => {
      const { rowSpaces, selectedSpace } = props.global;
      if (rowSpaces && rowSpaces.length) {
        return <div className={styles.switchForm}>
        <Select placeholder={formatMessage({ id: "universal.pleaseChoose" })} onChange={onChangeSpace} value={currentSelectedSpace.id} loading={loading}>
            {rowSpaces && rowSpaces.map((item) => {
                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>;
            })}
        </Select>
        <div className={styles.switchFormFooter}>
            <Button type="default" size="small" onClick={() => {setVisible(false); setSelectedSpace(selectedSpace);}}>取消</Button>
            <Button type="primary" size="small" onClick={onSwitch}>确认</Button>
        </div>
       </div>;
      } else {
        return <div className={styles.nodataContainer}>
            <span className={styles.nodata}></span>
            暂无选择空间
        </div>;
      }
    };

    const onToggleSelect = () => {
        if (!visible) {
            setLoading(true);
            props.fetchRoleSpaces('', true, () => {
                setLoading(false);
            });
        }
        setVisible(!visible);
    };

    if (!rowSpaces || !rowSpaces.length) return null;
    return <div>
        <div className={styles.swicthSpaceBtn}>
            {
                process.env.NODE_ENV === 'development' && <>
                    <span onClick={() => setLocale('zh-CN')}>中文&nbsp;</span>
                    <span onClick={() => setLocale('ja-JP')}>日文&nbsp;</span>
                </>
            }
            <span>{selectedSpace.name}</span>
            {rowSpaces.length > 1 && <Popover visible={visible} content={renderContent()}  placement="bottomRight" arrowPointAtCenter  trigger="click">
               <span className={styles.switchIcon} onClick={onToggleSelect}><SwapOutlined size={12} color="#ffffff"/></span>
            </Popover> }
        </div>
    </div>;
};

export default SwitchSpace;