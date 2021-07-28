export const timestamp = () => +Date.now();
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const noop = () => { };
export const now = () => Date.now();
/**
 * @description:  设置ui装载节点
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  if (node) {
    return node.parentNode as HTMLElement;
  }
  return document.body;
}
/**
 * 将对象作为参数添加到URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}

export function deepMerge<T = any>(src: any, target: any): T {
  let key: string;
  for (key in target) {
    src[key] =
      src[key] && src[key].toString() === '[object Object]'
        ? deepMerge(src[key], target[key])
        : (src[key] = target[key]);
  }
  return src;
}

/**
 * @description: 根据数组中某个对象值去重
 */
export function unique<T = any>(arr: T[], key: string): T[] {
  const map = new Map();
  return arr.filter((item) => {
    const _item = item as any;
    return !map.has(_item[key]) && map.set(_item[key], 1);
  });
}

/**
 * @description: es6数组去重复
 */
export function es6Unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 取出数组内的类型
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never;

/**
 * @desc   转化树形图
 * @param  {data, attributes}
 * @return {Array}
 */
export function toTreeData(data: any[], attributes: any) {
  const dataCopy: any = JSON.parse(JSON.stringify(data));
  // toTree
  const map = new Map(dataCopy && dataCopy.map((item: any) => [item[attributes.id], item]));
  const treeData: any[] = [];
  dataCopy && dataCopy.map((item: any) => {
    const parent: any = map.get(item[attributes.parentId]);
    if (parent) {
      (parent.children || (parent.children = [])).push(item); // parent 引用 item
    } else {
      treeData.push(item);
    }
  });
  return treeData;
}

/**
 * @description: 时间差值
 */
export function timesFun(curDate: string, nowDate: string) {
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(curDate.replace(/-/g, "/")); //将-转化为/，使用new Date
  var dateEnd = new Date(nowDate.replace(/-/g, "/")); //获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  var timesString = "";

  if (dayDiff != 0) {
    timesString = dayDiff + "天" + hours + "小时" + minutes + "分";
  } else if (dayDiff == 0 && hours != 0) {
    timesString = hours + "小时" + minutes + "分";
  } else if (dayDiff == 0 && hours == 0) {
    timesString = minutes + "分";
  }

  return timesString;
}

// get 所有数据过滤 前后空格
export function clearDataTrim(data:any){
  if (!data || Object.keys(data).length == 0) {
    return data;
  }
  for(let key  in data){
    if(typeof data[key] === 'string'){
      data[key] = data[key].trim();
    }
  }
  return data;
}