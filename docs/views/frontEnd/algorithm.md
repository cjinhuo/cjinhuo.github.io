---
title: '练习过的一些算法题'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories:
- frontEnd
# 分类 共有三个分类： frontEnd work hobby
date: 2019-05-24
# 时间
tags:
- 算法
- js
---

::: tip 概述
前端也需要学习算法，算法是每个程序员的内功，内功越强学习新知识越快。
:::
## 找出字符串中最高key的数量并显示
```js
/**
 * 找出字符串中最高key的数量并显示 复杂度为 2n
 * @param {字符串} str
 */
function computedCount(str) {
  // 将字符串拆成对象形式，value为单个字符出现的次数
  const cache = {}
  for (let i = 0; i < str.length; i++) {
    if (cache.hasOwnProperty(str[i])) {
      cache[str[i]] = cache[str[i]] + 1
    } else {
      cache[str[i]] = 1
    }
  }
  let temp = []
  const caches = Object.entries(cache)
  // 找出最高的key，可能有几个一样高的key，但是不管几个
  // 在temp里面出现的value肯定都是一样的，所以不需要遍历temp
  for (let i = 0; i < caches.length; i++) {
    if (i === 0) {
      temp = [caches[i]]
      continue
      // [['1', 3]]
    } else if (temp[0][1] < caches[i][1]) {
      temp = [caches[i]]
    } else if (temp[0][1] === caches[i][1]) {
      temp.push(caches[i])
    }
  }
  // 将数组转成对象形式
  const result = {}
  temp.forEach(([key, value]) => {
    result[key] = value
  })
  return result
}
let str = '12311qdaddsss'
// { '1': 3, d: 3, s: 3 }
console.log(computedCount(str))
```
## 荷兰国旗
```js
/**
 * 荷兰国旗问题 => 分成小于 等于 大于 num 的三个分区
 * @param {数组} arr
 * @param {需要分割的数字} num
 */
function partition(arr, num) {
  const swap = (arr, l, r) => {
    if (l === r) return
    let temp = arr[l]
    arr[l] = arr[r]
    arr[r] = temp
  }
  let l = -1
  let r = arr.length
  let i = 0
  while (i < r) {
    if (arr[i] < num) {
      swap(arr, ++l, i)
      i++
    } else if (arr[i] > num) {
      swap(arr, i, --r)
    } else {
      i++
    }
  }
}
let test = [999, 3, 4, 78, 56, 8, 32, 7, 0, 100]
partition(test, 8)
// [ 0, 3, 4, 7, 8, 32, 56, 78, 100, 999 ]
console.log(test)
```
## 数组去重
```js
Array.prototype.unique = function(){
  let hash = new Map()
  let result = []
  let item
  for (let i = 0; i < this.length; i++) {
    if (Object.prototype.toString.call(this[i]) === '[object Object]'
      || Object.prototype.toString.call(this[i]) === '[object Array]') {
      item = JSON.stringify(this[i])
    } else {
      item = this[i]
    }
    if (!hash.has(item)) {
      hash.set(item, true)
      result.push(this[i])
    }
  }
  return result
}
```
``` js
console.log([123,undefined, undefined, { a: 1 }, { a: { b: 1 } }, { a: "1" }, { a: { b: 1 } }, "meili"].unique())

```
结果对比
`[123,undefined, undefined, { a: 1 }, { a: { b: 1 } }, { a: "1" }, { a: { b: 1 } }, "meili"]`<br/>
`[ 123, undefined, { a: 1 }, { a: { b: 1 } }, { a: '1' }, 'meili' ]`
## 冒泡排序
::: tip
| 时间复杂度（平均）| 时间复杂度（最坏）| 时间复杂度（最好）| 空间复杂度| 稳定性|
| --------------| --------------- | -------------  |-------| ------|
|     O（n²）    | O（n²）         | O（n）          | O（1）  | 稳定 |
:::
```js
function bubbleSort(arr) {
  let length = arr.length
  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (arr[i] > arr[j]) {
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }
    }
  // [ -10, 2, 4, 52, -2, 3, 2, 56, 23, 1 ]
  // [ -10, -2, 4, 52, 2, 3, 2, 56, 23, 1 ]
  // [ -10, -2, 1, 52, 4, 3, 2, 56, 23, 2 ]
  // [ -10, -2, 1, 2, 52, 4, 3, 56, 23, 2 ]
  // [ -10, -2, 1, 2, 2, 52, 4, 56, 23, 3 ]
  // [ -10, -2, 1, 2, 2, 3, 52, 56, 23, 4 ]
  // [ -10, -2, 1, 2, 2, 3, 4, 56, 52, 23 ]
  // [ -10, -2, 1, 2, 2, 3, 4, 23, 56, 52 ]
  // [ -10, -2, 1, 2, 2, 3, 4, 23, 52, 56 ]
  // [ -10, -2, 1, 2, 2, 3, 4, 23, 52, 56 ]
    console.log(arr)
  }
  return arr
}
let test = [2, -2, 4, 52, -10, 3, 2, 56, 23, 1]
bubbleSort(test)
// [ -10, -2, 1, 2, 2, 3, 4, 23, 52, 56 ]
console.log(test)
```
## 选择排序
```js
// 选择排序
function selectSort(arr) {
    let length = arr.length
    let min = 0
    let minIndex = 0
    for (let i = 0; i < length - 1; i++) {
        min = arr[i]
        minIndex = i
        for (let j = i + 1; j < length; j++) {
            if (min > arr[j]) {
                min = arr[j]
                minIndex = j
            }
        }
        if (minIndex !== i) {
            let temp = arr[i]
            arr[i] = min
            arr[minIndex] = temp
        }
    }
    return arr
}
let test = [2, -2, 4, 52, -10, 3, 2, 56, 23, 1]
selectSort(test)
console.log(test)
```
## 插入排序
```js
//插入排序
function insertSort(arr) {
    let length = arr.length
    let preIndex, current
    for (let i = 1; i < length; i++) {
        preIndex = i - 1
        current = arr[i]
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex]
            preIndex--
        }
        arr[preIndex + 1] = current
    }
    return arr
}
let test = [2, -2, 4, 52, -10, 3, 2, 56, 23, 1]
insertSort(test)
console.log(test)
```
## 归并排序
```js
//归并排序
function mergeSort(arr) {
    const merge = (arr, l, mid, r) => {
      let help = []
      let i = 0
      let p1 = l
      let p2 = mid + 1
      while (p1 <= mid && p2 <= r) {
        help[i++] = (arr[p1] < arr[p2]) ? arr[p1++] : arr[p2++]
      }
      while (p1 <= mid) {
        help[i++] = arr[p1++]
      }
      while (p2 <= r) {
        help[i++] = arr[p2++]
      }
      console.log('help', help)
      for (let i = 0; i < help.length; i++) {
        arr[l + i] = help[i]
      }
      console.log('arr', arr)
    }
  const sortProcess = (arr, l, r) => {
    if (l == r) {
      return
    }
    let mid = Math.floor((l + r) / 2)
    sortProcess(arr, l, mid)
    sortProcess(arr, mid + 1, r)
    merge(arr, l, mid, r)
  }

    if (arr.length < 2) {
      return
    }
    sortProcess(arr, 0, arr.length - 1)
}
mergeSort(test)
```
打印
```
help [ 2, 4 ]
arr [ 2, 4, 52, 3, 2, 56, 23, 1 ]
help [ 3, 52 ]
arr [ 2, 4, 3, 52, 2, 56, 23, 1 ]
help [ 2, 3, 4, 52 ]
arr [ 2, 3, 4, 52, 2, 56, 23, 1 ]
help [ 2, 56 ]
arr [ 2, 3, 4, 52, 2, 56, 23, 1 ]
help [ 1, 23 ]
arr [ 2, 3, 4, 52, 2, 56, 1, 23 ]
help [ 1, 2, 23, 56 ]
arr [ 2, 3, 4, 52, 1, 2, 23, 56 ]
help [ 1, 2, 2, 3, 4, 23, 52, 56 ]
arr [ 1, 2, 2, 3, 4, 23, 52, 56 ]
```
## js 快速排序
```js
function quickSort(arr, left, right) {
     //为了防止剩一个数时再进行计算
    if (left < right) {
        //设置最左边的元素为基准点：pivot
    let p = arr[left];
    //把要排序的序列中比p大的放到右边，比p小的放到左边，p的下标位置为i
    let i = left,
        j = right;
    while(i<j)
    {
        //j向左移，找到一个比p小的元素，直到找到小于p的数就停止在j下标上
        while(arr[j] >= p && i < j){
            j--;
        }
        //i向右移，找到一个比p大的元素
        while(arr[i] <= p && i < j){
            i++;
        }
        //当i和j不相等的时候交换
        if (i<j){
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    arr[left] = arr[i];
    arr[i] = p;
      //i-1,i+1是为了让当前基准点继续参加排序
    quickSort(arr,left,i - 1);
    quickSort(arr, i + 1, right);
    }
    return arr;
}
var arr = [1,3,4,2,45,2,92,0,-2];
console.log(quickSort(arr,0,arr.length-1));
```
## 三路随机快排
```js

```
## 堆排序
