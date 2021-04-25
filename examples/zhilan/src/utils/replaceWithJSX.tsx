import React from 'react'

// 用于处理翻译中的变量，替换成字符串和jsx
/* 调用示例
replaceWithJSX('s{t}r{i}<a>n</a>g', [
  ['{t}', <span style={{ color: 'red' }}>jsx</span>],
  ['{i}', 'str'],
  ['a', (text) => <a>{text}</a>]
])
*/
// list = [[key, value]]
export default function replaceWithJSX (str: string, list: any[][]) {
  const jsxList: any = []

  list.forEach(item => {
    const [key, value] = item
    const reg = new RegExp(`<${key}>([\\s|\\S]+?)<\\/${key}>`)

    // 优先用key去搜索<key>...</key>
    const result = str.match(reg)
    if (result && result.length) {
      const [matched, text] = result
      const [pre, remaining] = str.split(matched)
      jsxList.push(<>{pre}{strJsxFn(value, text)}</>)
      str = remaining
    } else {
      // 用key直接搜索
      const [pre, remaining] = str.split(key)
      jsxList.push(<>{pre}{strJsxFn(value, key)}</>)
      str = remaining
    }
  })

  const jsx = <>{jsxList.map(item => item)}{str}</>

  return jsx
}

function strJsxFn (value, text) {
  if (typeof value === 'string') {
    return value
  } else if (value.hasOwnProperty('$$typeof')) {
    return value
  } else if (typeof value === 'function') {
    return value(text)
  }
}