/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @desc   转化树形图
 * @param  {data, attributes}
 * @return {Array}
 */
export function toTreeData(data, attributes) {
  const dataCopy = JSON.parse(JSON.stringify(data));
  // toTree
  const map = new Map(dataCopy.map(item => [item[attributes.id], item]));
  const treeData = [];
  dataCopy.map(item => {
    const parent = map.get(item[attributes.parentId]);
    if (parent) {
      (parent.children || (parent.children = [])).push(item); // parent 引用 item
    } else {
      treeData.push(item);
    }
  });
  return treeData;
}

// 防抖
export const debounce = (function() {
  let timer = null;

  return function(fn, wait) {
    const args = arguments;
    const context = this;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
})();

// 节流
export const throttle = (function() {
  let timer = null;

  return function(fn, wait) {
    const context = this;
    const args = arguments;

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
})();
