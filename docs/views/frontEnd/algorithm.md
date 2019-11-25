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

##  字符串解码
::: tip
这道题近半年来广受各大公司的青睐，出现非常频繁，在腾讯仅仅半年就出现了17次。
例子:<br>
`'2[abc]3[cjh]' => abcabccjhcjhcjh`
`'2[a2[b]]' => abbabb`
`'2[a2[b3[c]]]' => abcccbcccabcccbccc`
思路：一看到这个题首先想到的是递归，因为有无限嵌套的可能，但是每种递归都可以用栈来保存我们所需要的数据，所以这道题至少有两种写法。
:::
### 首先用栈来保存收集到的系数和字符串
```js
function decodeString(str) {
  // 系数栈
  let coefficientStack = []
  // 结果集栈
  let resultStack = []
  let result = ''
  // 初始化系数为0
  let coefficient = 0
  for (let i = 0; i < str.length; i++) {
    let current = str.charAt(i)
    switch (current) {
      case '[':
      // 当碰到'['就将以前收集字符串和系数的推入栈中
      // 重新开始收集字符串和系数
        coefficientStack.push(coefficient)
        resultStack.push(result)
        result = ''
        coefficient = 0
        break;
      case ']':
      // 碰到']'代表结束：计算当前[]中的字符串，和
        let count = coefficientStack.pop()
        let tempResult = ''
        // 将收集到字符串翻成系数倍
        for (let j = 0; j < count; j++) {
          tempResult += result
        }
        // 和前面已经求得的字符串进行拼接
        result = resultStack.pop() + tempResult
        break;
      default:
        if (current >= 0 && current <= 9) {
          // 系数累积 2[ab16[cd]] 下面的代码为了让16能够存下来，current - '0'是为了隐式转换成数字
          coefficient = coefficient * 10 + (current - '0');
        } else {
          // 字母累加 字符串收集
          result += current;
        }
        break;
    }
  }
  return result
}
```
### 用递归的方法来解决

## LRU-缓存机制
::: tip
运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 get 和 写入数据 put 。

获取数据 get(key) - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。
写入数据 put(key, value) - 如果密钥不存在，则写入其数据值。当缓存容量达到上限时，它应该在写入新数据之前删除最近最少使用的数据值，从而为新的数据值留出空间。

你是否可以在 O(1) 时间复杂度内完成这两种操作？
[leetcode地址](https://leetcode-cn.com/problems/lru-cache/)
:::

```js
LRUCache cache = new LRUCache( 2 /* 缓存容量 */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得密钥 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得密钥 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4
```
![](../../.vuepress/public/LRU_doubleLinkList.png)

代码实现:
```js
var NodeData = function ({ key = null, value = null }) {
  this.key = key
  this.value = value
}
var Node = function (data) {
  this.pre = null
  this.next = null
  this.data = new NodeData(data)
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {


  var DoublyLinkedList = function () {
    this.head = new Node({ key: 'null', value: 'null' })
    this.last = new Node({ key: 'null', value: 'null' })
    this.head.next = this.last
    this.last.pre = this.head
    this.length = 0
  }

  // 在从前往后在指定位置添加节点
  DoublyLinkedList.prototype.insertWithDataKeyForward = function (position, node) {
    let current = this.head
    if (position === 0) {
      this.insert(current, node)
    }
    if (position > 0 && position <= this.length) {
      for (let i = 0; i < position; i++) {
        current = current.next
      }
      this.insert(current, node)
    }
  }

  // 在前一个节点后面插入节点
  DoublyLinkedList.prototype.insert = function (preNode, currentNode) {
    // 保存下一个节点
    nextNode = preNode.next
    // 当前节点连接上一个节点
    preNode.next = currentNode
    currentNode.pre = preNode
    // 当前节点连接下一个节点
    currentNode.next = nextNode
    nextNode.pre = currentNode
    this.length++
  }


  // 在从后往前在指定位置添加节点
  DoublyLinkedList.prototype.insertWithDataKeyBackward = function (position, node) {
    let current = this.last.pre
    if (position === 0) {
      this.insert(current, node)
    }
    if (position > 0 && position <= this.length) {
      for (let i = 0; i < position; i++) {
        current = current.pre
      }
      this.insert(current, node)
    }
  }

  // 找出位置 从左向右开始找
  DoublyLinkedList.prototype.findPosition = function (node) {

  }

  // 移除当前节点
  DoublyLinkedList.prototype.removeCurrentNode = function (currentNode) {
    let preNode = currentNode.pre
    let nextNode = currentNode.next
    preNode.next = nextNode
    nextNode.pre = preNode
    this.length--
  }

  // 根据从到右的位置移除对应节点
  DoublyLinkedList.prototype.removeWithPosition = function (position) {
    if (this.length === 0) return
    if (this.position > 0 && this.position <= this.length) {
      let currentNode = this.head
      for (let i = 0; i < position; i++) {
        currentNode = currentNode.next
      }
      this.removeCurrentNode(currentNode)
    }
  }
  this.list = new DoublyLinkedList()
  this.capacity = capacity
  // map里面存的是：key:key，value：当前节点
  this.map = new Map()
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (this.map.has(key)){
    const curentNode = this.map.get(key)
    this.list.removeCurrentNode(curentNode)
    this.list.insertWithDataKeyForward(0, curentNode)
    return this.map.get(key).data.value
  }
  return -1
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  // 如果存在的就在双向链表移除，并且在头结点重新添加
  // 如果不存在就，并且capacity已经满了，删除最后一个节点，然后在头结点重写添加

  // 如果当前链表已经存在密钥，则删除该节点，在头部添加新节点
  if (this.map.has(key)) {
    const currentNode = this.map.get(key)
    this.list.removeCurrentNode(currentNode)
    this.list.insertWithDataKeyForward(0, new Node({key, value}))
    this.map.get(key).data.value = value
  }else if (this.list.length < this.capacity) {
    // 如果节点长度没有比capacity多则直接在头结点添加新节点
    const newNode = new Node({ key, value })
    this.list.insertWithDataKeyForward(0, newNode)
    this.map.set(key, newNode)
  } else {
    // 节点长度和capacity一样长，删除尾节点，在头部添加新节点
    const newNode = new Node({ key, value })
    const lastNode = this.list.last.pre
    this.list.removeCurrentNode(lastNode)
    this.list.insertWithDataKeyForward(0, newNode)
    this.map.delete(lastNode.data.key)
    this.map.set(key, newNode)
  }
};

const arr = [[6, 14], [3, 1], [3], [10, 11], [8], [2, 14], [1], [5], [4], [11, 4], [12, 24], [5, 18], [13], [7, 23], [8], [12], [3, 27], [2, 12], [5], [2, 9], [13, 4], [8, 18], [1, 7], [6]]
arr.forEach(v => {
  if (v.length > 1){
    cache.put(v[0], v[1])
  }
})
console.log(cache.map)
console.log(cache.list.head.next);
```
## 全O(1)操作
::: tip 题目
实现一个数据结构支持以下操作：

1. Inc(key) - 插入一个新的值为 1 的 key。或者使一个存在的 key 增加一，保证 key 不为空字符串。
2. Dec(key) - 如果这个 key 的值是 1，那么把他从数据结构中移除掉。否者使一个存在的 key 值减一。如果这个 key 不存在，这个函数不做任何事情。key 保证不为空字符串。
3. GetMaxKey() - 返回 key 中值最大的任意一个。如果没有元素存在，返回一个空字符串""。
4. GetMinKey() - 返回 key 中值最小的任意一个。如果没有元素存在，返回一个空字符串""。

以 O(1) 的时间复杂度实现所有操作。
[leetcode地址](https://leetcode-cn.com/problems/all-oone-data-structure/submissions/)
:::
```js
// 跟LRU差不多的结构 map + 双向链表
// map存储 key:key,value：值 1+~~ 插入key时，先在map中对应的key加1，然后判断当前curMax、curMin然后决定是否放入头结点或尾结点
// 重点是将curMax、curMin利用好

var NodeData = function ({ key = null, value = null }) {
  this.key = key
  this.value = value
}
var Node = function (data) {
  this.pre = null
  this.next = null
  this.data = new NodeData(data)
}
var AllOne = function () {
  var DoublyLinkedList = function () {
    this.head = new Node({ key: 'null', value: 'null' })
    this.last = new Node({ key: 'null', value: 'null' })
    this.head.next = this.last
    this.last.pre = this.head
    this.length = 0
  }

  // 在从前往后在指定位置添加节点
  DoublyLinkedList.prototype.insertWithDataKeyForward = function (position, node) {
    let current = this.head
    if (position === 0) {
      this.insert(current, node)
    }
    if (position > 0 && position <= this.length) {
      for (let i = 0; i < position; i++) {
        current = current.next
      }
      this.insert(current, node)
    }
  }

  // 在前一个节点后面插入节点
  DoublyLinkedList.prototype.insert = function (preNode, currentNode) {
    // 保存下一个节点
    nextNode = preNode.next
    // 当前节点连接上一个节点
    preNode.next = currentNode
    currentNode.pre = preNode
    // 当前节点连接下一个节点
    currentNode.next = nextNode
    nextNode.pre = currentNode
    this.length++
  }

  // 在从后往前在指定位置添加节点
  DoublyLinkedList.prototype.insertWithDataKeyBackward = function (position, node) {
    let current = this.last.pre
    if (position === 0) {
      this.insert(current, node)
    }
    if (position > 0 && position <= this.length) {
      for (let i = 0; i < position; i++) {
        current = current.pre
      }
      this.insert(current, node)
    }
  }

  // 移除当前节点
  DoublyLinkedList.prototype.removeCurrentNode = function (currentNode) {
    let preNode = currentNode.pre
    let nextNode = currentNode.next
    preNode.next = nextNode
    nextNode.pre = preNode
    this.length--
  }

  // 根据从到右的位置移除对应节点
  DoublyLinkedList.prototype.removeWithPosition = function (position) {
    if (this.length === 0) return
    if (this.position > 0 && this.position <= this.length) {
      let currentNode = this.head
      for (let i = 0; i < position; i++) {
        currentNode = currentNode.next
      }
      this.removeCurrentNode(currentNode)
    }
  }
  this.list = new DoublyLinkedList()
  this.map = new Map()
  this.curMax = 1
  this.curMin = 1
};

/**
 * Inserts a new key <Key> with value 1. Or increments an existing key by 1.
 * @param {string} key
 * @return {void}
 */
AllOne.prototype.inc = function (key) {
  let curNode
  if (this.map.has(key)){
    curNode = this.map.get(key)
    const curValue = ++curNode.data.value
    // 判断是否在头结点、中间结点、尾结点
    if (this.curMax <= curValue){
      this.curMax = curValue
      this.list.removeCurrentNode(curNode)
      this.list.insertWithDataKeyForward(0, curNode)
    }
    else if (curValue - this.curMin === 1) {
      // 当前节点本来就在末尾
      this.curMin = curValue
      if (curNode.pre && curNode.pre.data.value < this.curMin) {
        this.list.removeCurrentNode(curNode)
        this.list.insertWithDataKeyBackward(1, curNode)
      }
      // 本身就在最后一个，就没有必要在删除 插入了，跟下面得逻辑一样
      // this.list.removeCurrentNode(curNode)
      // this.list.insertWithDataKeyBackward(0, curNode)
    }
     else {
      // 当前值在最大值和最小值中间，所以在第一个位置插入节点
      this.list.removeCurrentNode(curNode)
      this.list.insertWithDataKeyBackward(1, curNode)
    }
  } else {
    curNode = new Node(new NodeData({key, value: 1}))
    this.map.set(key, curNode)
    this.list.insertWithDataKeyBackward(0, curNode)
    // 插入新节点 最小值重置成1
    this.curMin = 1
  }
};

/**
 * Decrements an existing key by 1. If Key's value is 1, remove it from the data structure.
 * @param {string} key
 * @return {void}
 */
AllOne.prototype.dec = function (key) {
  if(!this.map.has(key)){
    return
  }
  const curNode = this.map.get(key)
  const curValue = --curNode.data.value
  if (curValue === 0) {
    this.map.delete(key)
    this.list.removeCurrentNode(curNode)
  } else {
    if (this.curMax <= curValue) {
      this.curMax = curValue
      // 最大值--，没有必要再次删除 插入，因为本来就是在第一个
      // this.list.removeCurrentNode(curNode)
      // this.list.insertWithDataKeyForward(0, curNode)
    } else if (this.curMin >= curValue) {
      this.curMin = curValue
      this.list.removeCurrentNode(curNode)
      this.list.insertWithDataKeyBackward(0, curNode)
    } else {
      this.list.removeCurrentNode(curNode)
      this.list.insertWithDataKeyBackward(1, curNode)
    }
  }
};

/**
 * Returns one of the keys with maximal value.
 * @return {string}
 */
AllOne.prototype.getMaxKey = function () {
  if (this.list.length === 0) {
    return ''
  }
  return this.list.head.next.data.key
};

/**
 * Returns one of the keys with Minimal value.
 * @return {string}
 */
AllOne.prototype.getMinKey = function () {
  if (this.list.length === 0) {
    return ''
  }
  return this.list.last.pre.data.key
};
```
