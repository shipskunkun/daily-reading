

参考：

1. [可能是目前最易理解的手写promise](https://juejin.im/post/6844903989058748429)

2. [Promise之你看得懂的Promise](https://juejin.im/post/6844903629187448845)

3. [Promise实现原理（附源码)](https://juejin.im/post/6844903665686282253)

4. [9k字 | Promise/async/Generator实现原理解析](https://juejin.im/post/6844904096525189128#heading-12)

5. [总结面试中 promise 相关题目的套路](https://mp.weixin.qq.com/s/ZO300QAmmD1ngB1adpnpfw)


6. [通俗浅显的理解Promise中的then](https://segmentfault.com/a/1190000010420744)

7. [thenable 对象](https://segmentfault.com/a/1190000007685095)


自己第一遍写

```js
/*
思路
then
catch
constructor
finally

resolve
reject
all
race


*/

// 版本一
class Promise {
    constructor(fn) {
        this.status = 'pending';
        this.value = null;
        this.fufillcbs = [];
        this.rejectcbs = [];
        let resolve = val => {
            this.status = 'fufilled';
            this.value = val;
            for(let cb of this.fufillcbs) {
                cb()
            }
        }
        let reject = val => {
            this.status = 'rejected';
            this.value = val;
            for(let cb of this.rejectcbs) {
                cb()
            }
        }
    }

    then(onfufilled, onrejected) {
        /* 透传实验
        Promise.reject(2).then(null, 7).then((val)=>{
            console.log(1)
        },(val)=>{  console.log(2)})
        */

        let promise2;


        promise2 = new Promise((resolve, reject)=>{
            if(typeof onfufilled !== 'function') {
                onfufilled = val => val;
            }
            if(typeof onrejected !== 'function') {
                onrejected = val => val;
            }
            if(this.status == 'pending') {
    
            }
            if(this.status == 'fulfilled') {
                let x = onfufilled(this.value)
                resolvePromise(promise2, x, resolve, reject);
            }
            if(this.status == 'rejected') {
                let x = onfufilled(this.value)
                resolvePromise(promise2, x, resolve, reject);
            }
        })

        return promise2;
    }

    catch(onrejected) {
        return this.then(null, onrejected);
    }

    finally(fn) {
        
    }

    static race(promises) {
        return new Promise((resolve, reject)=>{
            for(let i of promises) {
                i.then(resolve, reject)
            }
        })
    }
    static reject (val) {
        return new Promise((resolve, reject)=>{
            reject(val)
        })
    }
    static all (promises) {
        let dataArr = [];
        let l = promises.length;
        let i = 0;
        return new Promise((resolve, reject)=>{
            for(let p of promises) {
                p.then((val)=>{
                    i++;
                    dataArr.push(val)
                    if(i === l ) {
                        resolve(dataArr)
                    }
                }, reject)
            }
        })
    }
    static resolve (val) {
        return new Promise((resolve, reject)=>{
            resolve(val)
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) {
        throw new Error('不能循环引用自己')
    }
    try{
        if( x instanceof Promise) {
            x.then(resolve, reject)
        }
        else {
            resolve(x)
        }
    }
    catch(e) {
        reject(e)
    }
}
```



哪些没注意到的:

```
没调用构造函数
而且没有用，try catch 捕获异常


resolve 和 reject 改变状态，需要加上条件

fufilled 状态，需要异步执行，并且
try catch

pending 状态不会写

called 防止，promise2 状态改变，没搞懂

```

如何理解，then 的处理，要在 setTimeout 中

```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
上面代码中，调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。


如何理解 race

代表，对于每一个promise，如果成功了，执行onfulfilled， 失败了，执行 onrejected

而 onfulfilled， 就是 外层peomise  resolve， 自己失败了，外层的promise 也就失败了

```
static race(promises) {
      return new Promise((resolve, reject)=>{
            for(let i of promises) {
                i.then(resolve, reject)
            }
        })
    }
```

没搞懂，当 then 遇到 pending 状态的 promise , 为什么要把 onresolve 放到，resolvecbs 中呢？那当 promise 状态变成 resolved 之后呢？

如果不放到 callback 函数中，会怎样？


	具有then 方法的 不一定是 promise 对象，如果是 thenable 对象，难道 
	

什么是 thenable 对象？ 有 then 方法的对象，但不是 promise 实例
thenable对象指的是具有then方法的对象，比如下面这个对象。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});

```
上面代码中，thenable对象的then方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出 42。

测试代码：

```js
let thenable = {
  then: function(resolve, reject) {
    console.log(123)
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(456);  // 42
});
```

