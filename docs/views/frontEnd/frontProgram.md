---
title: '前端面试编程题'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories:
# - frontEnd
# 分类 共有三个分类： frontEnd work hobby
date: 2020-03-01
# 时间
tags:
- 面试
- 编程题
# 标签
---

## 铃盛软件-RingCentral（厦门）
```js
/**
  extensions is an Array and each item has such format:
  {firstName: 'xxx', lastName: 'xxx', ext: 'xxx', extType: 'xxx'}
  lastName, ext can be empty, extType can only has "DigitalUser", "VirtualUser","FaxUser","Dept","AO".
**/

/**
  Question 1: sort extensions by "firstName" + "lastName" + "ext" ASC
**/
function sortExtensionsByName(extensions) {
  const compare = (x, y) => {
    const { firstName: f1, lastName: l1, ext: e1 } = x;
    const { firstName: f2, lastName: l2, ext: e2 } = y;
    if (f2 > f1 || (f2 === f1 && l2 > l1) || (f2 === f1 && l2 === l1 && e2 > e1)) return -1
    if (f2 === f1 && l2 === l1 && e2 === e1) return 0
    return 1
  }
  if (extensions.length <= 1) return extensions;
  return extensions.sort(compare)
}

/**
  Question 2: sort extensions by extType follow these orders ASC
  DigitalUser < VirtualUser < FaxUser < AO < Dept.
**/
function sortExtensionsByExtType(extensions) {
  // 桶排序
  const bucket = {
    DigitalUser: [],
    VirtualUser: [],
    FaxUser: [],
    AO: [],
    Dept: []
  }
  extensions.forEach(item => {
    bucket[item.extType].push(item)
  })
  const result = []
  Object.values(bucket).forEach(item => {
    result.push(...item)
  })
  return result
}


/**
  saleItems is an Array has each item has such format:
  {
	month: n, //[1-12],
	date: n, //[1-31],
	transationId: "xxx",
	salePrice: number
  }
**/

/**
  Question 3: write a function to calculate and return a list of total sales (sum) for each quarter, expected result like:
  [
  	{quarter: 1, totalPrices: xxx, transactionNums: n},
  	{....}
  ]
**/

function sumByQuarter(saleItems) {
  // 利用月份和数组下标关联上
  const result = [
    { quarter: 1, totalPrices: 0, transactionNums: 0 },
    { quarter: 2, totalPrices: 0, transactionNums: 0 },
    { quarter: 3, totalPrices: 0, transactionNums: 0 },
    { quarter: 4, totalPrices: 0, transactionNums: 0 },
  ]
  saleItems.forEach(item => {
    result[Math.ceil(item.month / 3) - 1].totalPrices += item.salePrice
    result[Math.ceil(item.month / 3) - 1].transactionNums++
  })
  return result
}

/**
  Question 4: write a function to calculate and return a list of average sales for each quarter, expected result like:
  [
    {quarter: 1, averagePrices: xxx, transactionNums: n},
    {....}
  ]
**/

function averageByQuarter(saleItems) {
  const result = [
    { quarter: 1, totalPrices: 0, transactionNums: 0 },
    { quarter: 2, totalPrices: 0, transactionNums: 0 },
    { quarter: 3, totalPrices: 0, transactionNums: 0 },
    { quarter: 4, totalPrices: 0, transactionNums: 0 },
  ]
  saleItems.forEach(item => {
    result[Math.ceil(item.month / 3) - 1].totalPrices += item.salePrice
    result[Math.ceil(item.month / 3) - 1].transactionNums++
  })
  return result.map(item => {
    const { quarter, totalPrices, transactionNums } = item
    return {
      quarter,
      averagePrices: transactionNums && totalPrices / transactionNums,
      transactionNums
    }
  })
}


/**
  Question 5: please create a tool to generate Sequence
  Expected to be used like:
  var sequence1 = new Sequence();
  sequence1.next() --> return 1;
  sequence1.next() --> return 2;

  in another module:
  var sequence2 = new Sequence();
  sequence2.next() --> 3;
  sequence2.next() --> 4;
**/
// 理解错题意，题目是要我们创建一个工具来生成Sequence这个对象
class Tool {
  static getSequence = function () {
    return function Sequence() {
      if (Sequence.instance) {
        return Sequence.instance
      }
      Sequence.instance = (function* () {
        let num = 0
        while (true) {
          yield ++num
        }
      })()
      return Sequence.instance
    }
  }
}


/**
    Question 6:
    AllKeys: 0-9;
    usedKeys: an array to store all used keys like [2,3,4];
    We want to get an array which contains all the unused keys,in this example it would be: [0,1,5,6,7,8,9]
**/
// 理解错题意，以为AllKeys是数字
function getUnUsedKeys(allKeys, usedKeys) {
  if (usedKeys.length === 0) return allKeys
  let allKeysSets = new Set(allKeys)
  usedKeys.forEach(num => {
    if (allKeysSets.has(num)) {
      allKeysSets.delete(num)
    }
  })
  return Array.from(allKeysSets)
}
```
## MetaAPP（厦门）
```js
/**
 * 1.输入：“get1_install2_app3_list4_by5_android6”（每个单词后面总会携带一个数字，只有偶数才删掉），
// 写一个函数实现输出"get1InstallApp3ListBy5Android"
 * @param {String} str
 */
function getString(str) {
  if (str.length <= 1) return str
  const strArr = str.split('')
  const length = strArr.length
  for (let i = 1; i < length; i++) {
    if (strArr[i] === '_') {
      if (!isNaN(strArr[i - 1]) && !(Number(strArr[i - 1]) & 1)) {
        strArr[i - 1] = '_'
      }
      if (i + 1 < length) {
        strArr[i + 1] = (strArr[i + 1]).toUpperCase()
      }
    }
  }
  return strArr.join('').replace(/_/g, '')
}
getString('get1_install2_app3_list4_by5_android6')

/**
 * 2.不使用任何循环控制语句和迭代器的情况下实现一个0到1000的数组赋值。
 * @param {Number} l 数组长度
 */
function getArr(l = 1001) {
  const arr = Array(l);
  (function recursion(n) {
    if (n === arr.length) return
    arr[n] = n++
    recursion(n)
  })(0)
  return arr
}
getArr()

/**
 * 3.写一个函数能判断两个对象（注意特殊对象）内包含的内容是否一致。
 * @param {*} o1
 * @param {*} o2
 */
function isEualObject(o1, o2) {
  if (o1 === o2) return true
  if (o1 !== o1) return o2 !== o2
  if (typeof o1 === 'function' || typeof o2 === 'function') return false
  return deepEqual(o1, o2)
}
function deepEqual(o1, o2) {
  const typeString = obj => Object.prototype.toString.call(obj);
  const type1 = typeString(o1)
  const type2 = typeString(o2)
  if (type1 !== type2) return false;
  switch (type1) {
    case '[object Date]':
      return +o1 === +o2
    case '[object Boolean]':
      return o1 === o2
    case '[object RegExp]':
    case '[object String]':
      return '' + o1 === '' + o2
    case '[object Number]':
      if (o1 !== o1) return o2 !== o2
      return o1 === o2
    case '[object Symbol]':
      return String(o1) === String(o2)
  }
  for (let attr in o1) {
    if (!deepEqual(o1[attr], o2[attr])) {
      return false
    }
  }
  return true
}
let a = { test: 1, two: [{ test: { test: 1 }, reg: new RegExp(/asd/gi) }] }
let b = { test: 1, two: [{ test: { test: 1 }, reg: new RegExp(/asd/gi) }] }
console.log(isEualObject(a, b))
```
