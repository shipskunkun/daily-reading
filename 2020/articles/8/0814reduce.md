reduce的用法

https://juejin.im/post/6847902223964471309


参数

```
arr.reduce((acc, cur, index, arr)=>{},inital)
```

`initialValue`(**可选**): 作为第一次调用 `callback`函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

应用：

​	数组累加，promise串行，对象属性和，

```
let promiseFn = function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('resolve1')
        resolve()
      }, 1000)
    })
  }
  let promiseFn2 = function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('resolve2')
        resolve()
      }, 1000)
    })
  }
  let promiseFn3 = function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('resolve3')
        resolve('last resolve')
      }, 1000)
    })
  }
  let pro = [promiseFn, promiseFn2, promiseFn3].reduce((p, f) => {
    return p.then(f)  // then 接受一个onfufill 回调函数
  }, Promise.resolve()) // 提供initialValue，从第一个参数遍历
  pro.then(res => {
    console.log('res', res)
  })
```



```js
let p = Promise.resolve(2);

let a = function() {
    return Promise.resolve(1).then(p)
}

let c = a()  //fulfilled 1

let b = function() {
    return Promise.resolve(1).then(()=>{
      return p
    })
}
let d = b()  //fulfilled 2
```

**如果 onFulfilled 不是函数**，其必须被忽略。

**如果 onFulfilled 是函数**：当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值

https://segmentfault.com/a/1190000010420744   这篇文章讲的不错

then方法提供一个供自定义的回调函数，若传入非函数，则会忽略当前then方法。
回调函数中会把上一个then中返回的值当做参数值供当前then方法调用。
then方法执行完毕后需要返回一个新的值给下一个then调用（没有返回值默认使用undefined）。
每个then只可能使用前一个then的返回值。



reduce 可以代替map、filter、some、every

```
//map
const arr = [{name:'Amy'},{name:'Bob'}];
arr.map(it=>it.name); // map
arr.reduce((c,n)=>[...c,n.name],[]); // reduce

//filter
const arr = [{name:'Amy',age:18},{name:'Bob',age:20}];
arr.filter(it=>it.age>18); // filter
arr.reduce((c,n)=>n.age>18? [...c,n]:c,[]); // reduce

```

reduce 扁平数组

```js
let arr = [[1,2,3], [4,5, [6,7]]]
function flatArray(arr) {
    return arr.reduce((acc, cur, index)=>{
        return acc.concat(Array.isArray(cur)? flatArray(cur): cur)
    },[])
}
```
https://juejin.im/post/6844903827720650759#heading-2

reduce 实现大数相加

思路：

1234,  56

首先变成倒序的数组

[4, 3, 2, 1]  +  [6, 5]

对长的数组进行reduce，保存进位 ，和已经生成的 字符串







[https://github.com/dt-fe/weekly/blob/master/30.%E7%B2%BE%E8%AF%BB%E3%80%8AJavascript%20%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E4%B8%8E%E5%BC%82%E6%AD%A5%E3%80%8B.md](https://github.com/dt-fe/weekly/blob/master/30.精读《Javascript 事件循环与异步》.md)

