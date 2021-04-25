/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { IRoute } from 'umi-types';
import Cookies from 'js-cookie';
import emojiRegex from 'emoji-regex';
import _, { isNaN as _isNaN, cloneDeep as _cloneDeep, forEach as _forEach } from 'lodash';
import { Route } from '@ant-design/pro-layout/es/typings';
import { formatMessage } from 'umi-plugin-react/locale';

// eslint-disable-next-line max-len
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path: string) => reg.test(path);

// 设置cookie过期时间（天）
export const setCookieExpires = (key: string, val: string, num: number) => {
  let curTime = new Date().getTime();
  let expiresTime = new Date(curTime + num * 24 * 60 * 60 * 1000);
  Cookies.set(key, val, {
    expires: expiresTime,
  });
};

// 正则匹配特殊字符
export const checkNameByReg = (str)=>{
  // ~`!@#$%^&*()_<>?:"{}|,\/;'[]·~！￥……（）——\-+={}|《》？：“”【】、；‘'，。、
  if(!str) return true;
  const reg = /^[~`!@#\$%\^&\*\(\)_<>\?:"\{\}\|,\\\/;'\[\]·~！￥……（）——\-\+=\{\}\|《》？：“”【】、；‘'，。、]{1,}$/;
  const emojiReg = emojiRegex();

  let hasEmoji = false; let hasSpecial = false;

  function checkEmoji() {
    if (emojiReg.test(str)) {
      hasEmoji = true;
      return;
    }
    for (let i = 0, len = str.length; i < len; i++) {
      if(reg.test(str[i])) {
        hasSpecial = true;
        return;
      }
    }
  }

  checkEmoji();

  if(hasSpecial) {
    console.log('有特殊字符')
    return false;
  } if(hasEmoji) {
    console.log('有表情符号')
    return false;
  }
    console.log('校验通过')
    return true;

}

/**
 * 校验字符串长度范围
 * @param min: 最小长度   默认长度1
 * @param max: 最大长度   默认长度30
 * @param str: 字符串
 */
export const valifyStringLength = ({ min = 1, max = 30, str }:{min?:number, max?:number, str:string})=>{
  let len = String(str).length;
  return len >= min && len <= max;
}

/**
 * @param authoritRoutes [{}]：接口返回权限
 * @param routes [{}]：前端定义的全部路由route.js
 * @param pathname string
 */
 export const getAuthorityFromRouter = (authoritRoutes: IRoute[] = [], routes: Route[] = [], pathname: string) => {
  if (pathname === '/home') return true;

  if (!authoritRoutes || !authoritRoutes.length) return false;

  function findRouteByPath(route, pathname) {
    if (route.path === pathname) return true;

    if (route.routes && route.routes.length) {
      return route.routes.some(item => findRouteByPath(item, pathname));
    }
      return false;

  }

  function getAuthorResult(routers) {
    return routers.some(route => findRouteByPath(route, pathname));
  }

  // 在接口返回中找到直接返回，否则去全部路由当中查找，存在则403、不存在则404
  if (authoritRoutes && authoritRoutes.length > 0) {
    let res = getAuthorResult(authoritRoutes);
    if (res) {
      return res;
    } if (routes && routes.length > 0) {
      let res2 = getAuthorResult(routes);
      if (res2) {
        return '403';
      }
        return '404';

    }
    return null;
  }
  return null;
};

export const getTargetObject = (targetObject: any, propsArray: any) => {
  if (typeof targetObject !== 'object' || !Array.isArray(propsArray)) {
    throw new Error('参数格式不正确');
  }
  const result: any = {};
  Object.keys(targetObject)
    .filter((key: any) => propsArray.includes(key))
    .forEach(key => {
      result[key] = targetObject[key];
    });
  return result;
};

export const sortByAscll = (obj: any) => {
  let arr: any = [];
    let num = 0;
  for (let i in obj) {
    arr[num] = i;
    num++;
  }

  // let sortArr = arr.sort((a,b) => {
  //   return a.charCodeAt(0) - b.charCodeAt(0);
  // });
  let sortArr = arr.sort();
  let sortObj: any = {};

  for (let j in sortArr) {
    sortObj[`${sortArr[j] }`] = `${obj[sortArr[j]] }`;
  }
  return sortObj;
};

export const getTitle = (route: any, path: string) => {
  if (route && route[path] && route[path].name) {
    return `${route[path].name } - ${ formatMessage({ id: 'zhilan' })}`;
  }
    return formatMessage({ id: 'zhilan' });

};

// NOTE: 新添加一些 utils 方法 by joah
// eslint-disable-next-line @typescript-eslint/unbound-method
const _toString = Object.prototype.toString;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === '[object Object]';
}

export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]';
}

export function toNumber(val: string): number | string {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}

declare const WXEnvironment: any;

export function inBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function numberToFixed(num: number, fixedLen: number, forceFiexed = false): string {
  if (isNaN(num)) {
    return 'NaN';
  }
  const s = num.toString();
  const [i, f = ''] = s.split('.');
  let res = `${i}.${f.slice(0, fixedLen)}`;
  if (f.length < fixedLen && forceFiexed) {
    for (let j = 1; j <= fixedLen - f.length; j++) {
      res += '0';
    }
  }
  if (res.endsWith('.')) {
    res = res.slice(0, -1);
  }
  return res;
}

/**
 * 向给定 url 后添加 query 参数
 */
export function addUrlArgs(url: string, args: { [key: string]: string | number }): string {
  const res = url.split('#');
  let baseUrl = res[0];
  const hash = res[1];
  const parts: string[] = [];
  for (const k in args) {
    const v = args[k];
    if (v !== undefined && v !== null) {
      parts.push(`${k }=${ encodeURIComponent(v.toString())}`);
    }
  }
  if (baseUrl.includes('?')) {
    baseUrl += `&${ parts.join('&')}`;
  } else {
    baseUrl += `?${ parts.join('&')}`;
  }
  if (hash) {
    return `${baseUrl }#${ hash}`;
  }
    return baseUrl;

}

/**
 * 获得 chrome 内核版本
 */
export function getChromeVersion(): number {
  const res = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)![1];
  return parseInt(res);
}

/**
 * 将key字符串转换成下划线方式命名 (如 "some_name") 的字符串
 * @param key 对象字符串
 * @param ignoreFirst 是否忽略第一个大写字母，如果忽略，会将其当成小写字母处理
 */
export function underlizeKey(key: string, ignoreFirst = false): string {
  const out: string[] = [];
  let i = 0;
  const lowerCasedStr: string = key.toString().toLowerCase();
  while (i < key.length) {
    if (key[i] !== lowerCasedStr[i]) {
      if (!ignoreFirst || i !== 0) {
        out.push('_');
        out.push(lowerCasedStr[i]);
        i++;
        continue;
      }
    }
    out.push(key[i].toLocaleLowerCase());
    i++;
  }
  return out.join('');
}

/**
 * 将对象键值对中的 key 转换为按照下划线方式命名的 key
 * @param obj 需要转换的对象
 */
export function underlize(obj: object | null | undefined, ignoreFirst = false): object | null {
  if (obj === null || obj === undefined) {
    return null;
  } if (obj instanceof Array) {
    return obj.map(item => {
      return underlize(item);
    });
  } if (typeof obj === 'object') {
    const out: any = {};
    for (const key in obj as any) {
      const v = (obj as any)[key];
      out[underlizeKey(key, ignoreFirst)] = underlize(v);
    }
    return out;
  }
    return obj;

}

/**
 * 将key字符串转换成中划线方式命名 (如 "some-name") 的字符串
 * @param key 对象字符串
 * @param ignoreFirst 是否忽略第一个大写字母，如果忽略，会将其当成小写字母处理
 */
export function middlelizeKey(key: string, ignoreFirst = false): string {
  const out: string[] = [];
  let i = 0;
  const lowerCasedStr = key.toString().toLowerCase();
  while (i < key.length) {
    if (key[i] !== lowerCasedStr[i]) {
      if (!ignoreFirst || i !== 0) {
        out.push('-');
        out.push(lowerCasedStr[i]);
        i++;
        continue;
      }
    }
    out.push(key[i].toLocaleLowerCase());
    i++;
  }
  return out.join('');
}

/**
 * 将对象键值对中的 key 转换为按照下划线方式命名的 key
 * @param obj 需要转换的对象
 */
export function middlelize(obj: object): object | null {
  if (obj === null || obj === undefined) {
    return null;
  } if (obj instanceof Array) {
    return obj.map(item => {
      return underlize(item);
    });
  } if (typeof obj === 'object') {
    const out: any = {};
    for (const key in obj as any) {
      const v = (obj as any)[key];
      out[middlelizeKey(key)] = middlelize(v);
    }
    return out;
  }
    return obj;

}

/**
 * 将key字符串转换成驼峰方式命名（如 "someName"） 的字符串
 * @param key string类型
 * @param separators key分隔符 "-"中划线/"_"下划线
 */
export function camelizeKey(key: string, separators: string[] = ['-', '_']): string {
  const out: any = [];
  let i = 0;
  const separatorsSet = new Set(separators);
  while (i < key.length) {
    if (separatorsSet.has(key[i])) {
      if (key[i + 1]) {
        out.push(key[i + 1].toUpperCase());
        i++;
      }
    } else {
      out.push(key[i]);
    }
    i++;
  }
  return out.join('');
}

/**
 * 将对象键值对中的 key 转换为按照驼峰方式命名的 key
 * @param obj
 */
export function camelize(obj: object): { [key: string]: any } | null {
  if (obj === null || obj === undefined) {
    return null;
  } if (obj instanceof Array) {
    return obj.map(item => {
      return camelize(item);
    });
  } if (typeof obj === 'object') {
    const out: any = {};
    for (const key in obj as any) {
      const v = (obj as any)[key];
      out[camelizeKey(key)] = camelize(v);
    }
    return out;
  }
    return obj;

}

// Browser environment sniffing
export function getUserAgent(): 'IE' | 'IE9' | 'isEdge' | 'android' | 'IOS' | 'chrome' {
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIE = UA && /msie|trident/.test(UA);
  const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  if (isIE) {
    return 'IE';
  }
  const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  if (isIE9) {
    return 'IE9';
  }
  const isEdge = UA && UA.indexOf('edge/') > 0;
  if (isEdge) {
    return 'isEdge';
  }
  const isAndroid = (UA && UA.indexOf('android') > 0) || weexPlatform === 'android';
  if (isAndroid) {
    return 'android';
  }
  const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === 'ios';
  if (isIOS) {
    return 'IOS';
  }
  const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  if (isChrome) {
    return 'chrome';
  }
  return 'chrome';
}

/**
 * 获得URL中”？“后面的参数 以键值对的形式放回
 * @param url string类型
 */
export function getUrlArgs(url: string = window.location.href, isCamelize = false): { [key: string]: string } | null {
  // remove url hash
  const [href] = url.split('#');
  const s = href.split('?')[1];
  if (!s) {
    return {};
  }
  let args: {
    [key: string]: string;
  } | null = {};
  for (const a of s.split('&')) {
    const part = a.split('=');
    let str = '';
    try {
      str = decodeURIComponent(part[1]);
    } catch (error) {
      str = part[1];
    }
    args[part[0]] = str;
  }
  if (isCamelize) {
    args = camelize(args);
  }
  return args;
}

export const isNumberString = (str: string) => {
  if (!isDigit(str)) {
    return false;
  }
    const numQ = Number(str);
    return !_isNaN(numQ);

};

export const getUid = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

// 获取json数组某个值的位置
export const findJsonArrayIndex = (arr, value, key = 'id') => {
  return arr.findIndex(item => item[key] === value);
};

export async function downloadWithA(url: string, fileName?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const link = document.createElement('a');
      link.download = fileName || url;
      link.href = url;
      const clickEvent = document.createEvent('MouseEvent');
      clickEvent.initEvent('click', true, true);
      link.dispatchEvent(clickEvent);
      resolve();
    } catch (error) {
      reject();
    }
  });
}

export const isDigit = (num: string | number) => {
  // const reg = /^-?\d*\.?(\d+)?$/;
  const reg = /^[0-9]{1,9}(\.\d{1,3})?$/;
  return reg.test(`${num }`);
};

export const millenniumRepresentation = value => {
  value = value || 0
  return value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
};

export function random(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function isAscendingArray(list) {
  if (!Array.isArray(list)) return false;
  if (list.length === 0) return false;
  let prevValue = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] <= prevValue) return false;
    prevValue = list[i];
  }
  return true;
}

export function duplicates(arr: (string | number)[] | number[]) {
  // 先排序，如果后一个与前一个相等且未保存，则保存。
  const newArr = arr.sort();
  const dupArr: (string | number)[] = [];
  for (let i = 0; i < newArr.length; i++) {
    const element = newArr[i];
    if (element === newArr[i - 1] && !dupArr.includes(element)) {
      dupArr.push(element);
    }
  }
  return dupArr;
}

export function getAbsCoordinates(dom) {
  let pos = { top: 0, left: 0, scrollTop: 0 };
  while (dom) {
    pos.left += dom.offsetLeft;
    pos.top += dom.offsetTop;
    pos.scrollTop += dom.scrollTop;
    dom = dom.offsetParent;
  }
  return pos;
}

/**
 * 替换对象数组中对象的key
 * @param obj object数据
 * @param keysRules 类似{id: 'key', name: 'title', routes: 'children'}
 * @param childrenKey
 */
export function objectArrayReplaceKeys(objArray, keysRules, childrenKey = 'children') {
  return objArray.map(obj => objectReplaceKeys(obj, keysRules, childrenKey));
}

/**
 * 替换对象中的key
 * @param obj object数据
 * @param keysRules 类似{id: 'key', name: 'title', routes: 'children'}
 * @param childrenKey
 * @returns
 */
// export function objectReplaceKeys(obj, keysRules, childrenKey = 'children') {
//   let newData = {};
//   for (let i in obj) {
//     if (Object.keys(keysRules).includes(i)) {
//       if (i === childrenKey) {
//         if (obj[i]) newData[keysRules[i]] = objectArrayReplaceKeys(obj[i], keysRules, childrenKey);
//       } else {
//         newData[keysRules[i]] = obj[i];
//       }
//     } else {
//       if (obj[childrenKey]) {
//         newData[childrenKey] = objectArrayReplaceKeys(obj[childrenKey], keysRules, childrenKey);
//       } else {
//         newData[i] = obj[i];
//       }
//     }
//   }

//   return newData;
// }
export function objectReplaceKeys(obj, keysRules, childrenKey) {
  let newData = {};

  for (let i in obj) {
    if (Object.keys(keysRules).includes(i)) {
      if (i === childrenKey) {
        if (obj[i]) newData[keysRules[i]] = objectArrayReplaceKeys(obj[i], keysRules, childrenKey);
      } else {
        newData[keysRules[i]] = obj[i];
      }
    } else {
      newData[i] = obj[i];
    }
  }

  return newData;
}

/**
 * 数组中含有某个值就删除掉，没有就添加上
 * @param arr
 * @param value
 */
export function arrayToogleAdd(arr, value) {
  let newArr = [...arr];
  if (!Array.isArray(arr)) {
    throw new Error('arrayToogleAdd方法第一个参数不是一个数组');
  }
  if (!value) {
    throw new Error('第三个参数必须要有值');
  }

  if (newArr.includes(value)) {
    newArr.splice(newArr.indexOf(value), 1);
  } else {
    newArr.push(value);
  }
  return newArr;
}

interface IPromise<T> extends Promise<T> {
  resolveHandle: (value: any) => void
  rejectHandle: (value: any) => void
}
export function genPromise<T = any>(): IPromise<T> { // gen = generate
  let resolveHandle
  let rejectHandle

  let promise = (new Promise((resolve, reject) => {
    resolveHandle = resolve
    rejectHandle = reject
  }) as IPromise<T>)

  promise.resolveHandle = resolveHandle
  promise.rejectHandle = rejectHandle

  return promise
}
