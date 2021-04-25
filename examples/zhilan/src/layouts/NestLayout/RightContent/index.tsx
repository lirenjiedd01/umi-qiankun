import React from 'react';
//import SelectLang from './SelectLang';
import AvatarDropdown from './AvatarDropdown';
import SwicthSpace from './SwitchSpace';
import styles from './index.module.less';

const RightContent = (props) => {
  return (
    <div className={styles.right}>
      <SwicthSpace {...props}/>
      <AvatarDropdown />
      {/* <SelectLang /> */}
    </div>
  );
};

export default RightContent;
