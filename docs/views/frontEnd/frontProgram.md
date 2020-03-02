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
