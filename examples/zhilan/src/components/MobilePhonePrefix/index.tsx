import React, { useEffect } from "react";
import { Select } from "antd";
import { getLocale } from 'umi-plugin-react/locale';

const prefixList = [
  { key: "zh-CN", value: "86" },
  { key: "ja-JP", value: "81" },
]

interface Iprops{
  setPrefix: (vals:string|number)=> void;
  [keyName:string]: any;
}

const MobilePhonePrefix:React.FC<Iprops> = (props)=>{
  // selecProps 为select组件的属性
  let { setPrefix,...selecProps } = props;

  useEffect(()=>{
    console.log(getLocale())
    let prefix = prefixList.filter(item=>item.key === getLocale())[0]?.value;
    if(prefix){
      setPrefix(prefix)
    }
  },[getLocale()])

  const onChangePrefix = (value)=>{
    setPrefix(value)
  }
  
  return (
    <Select
      disabled
      size="large"
      style={{
        width: "20%"
      }}
      onChange={onChangePrefix}
      {...selecProps}
    >
      {
        prefixList.map(item=>(
          <Select.Option key={item.value} value={item.value}>+{item.value}</Select.Option>
        ))
      }
    </Select>
  )
}

export default MobilePhonePrefix;