prmise 几个面试题

https://mp.weixin.qq.com/s/ZO300QAmmD1ngB1adpnpfw

promise 中 then

https://segmentfault.com/a/1190000010420744

then方法提供一个供自定义的回调函数，若传入非函数，则会忽略当前then方法。
回调函数中会把上一个then中返回的值当做参数值供当前then方法调用。
then方法执行完毕后需要返回一个新的值给下一个then调用（没有返回值默认使用undefined）。
每个then只可能使用前一个then的返回值。



```
func().then(function () {
  return cb();
});
// 等价，相当于 cb 是 resolve 函数
func().then(cb);
```





题目二

实现如下调用，`lazyMan('xxx').sleep(1000).eat('333').sleepFirst(2000)` sleepFirst 最先执行。

思路：

lazyMan 肯定返回的是一个对象，这个对象有sleep、eat、sleepFirst 等方法

sleep、eat 执行后，返回this 对象

那么如何让sleepFirst 先执行？

我们使用一个任务队列存储要执行的fn，把sleepFirst 放在对首

为什么需要把run放到任务队列中，而不是主程序？

​	如果放在主程序，第一次lazyman的时候就执行了，return 了一个promise 而不是自己



第一遍自己写遇到的问题：sleep 到底是返回 this 对象还是，promise 对象？

答案是this， 没有直接调用then，返回的promise 在push 任务队列中做

```js
function lazyMan(name) {
    this.task = [];
    this.task.push(() => {
        return new Promise(res => {
            console.log('name:' + name);
          	res();
        })
    })
    let run = () => {
        let sequence = Promise.resolve()
        for (const func of this.task) {
            sequence = sequence.then(()=>func())
        }
    }
    setTimeout(() => {run()}, 0)
    this.eat = (str) => {
        this.task.push(() => {
            return new (res => {
                console.log('eat:' + str);res()
            })
        })
        return this;
    }
    this.sleep = (time) => {
        this.task.push(() => {
            return new Promise(res => {
                setTimeout(() => {
                    console.log(`Wake up after ` + time);res()
                }, time)
            })
        })
        return this;
    }
    this.sleepFirst = (time) => {
        this.task.unshift(() => {
            return new Promise(res => {
                setTimeout(() => {
                    console.log(`sleepFirst up after ` + time);res()
                }, time)
            })
        })
        return this;
    }
    return this;
}
```

自己写的：

学习到的：可以简写resolve

res => {  res() }  //当只有一个参数的时候 = resolve

```js
function lazyMan2(name){
    this.task = [];
    this.task.push(()=>{
        return new Promise(res => {
                console.log('name:' + name);
                res();
            })
        }
    )
    this.sleep = function(timer) {
        this.task.push(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    console.log('sleep');
                    resolve('sleep')
                },timer) 
            })
        })
        return this
    }
    this.eat = function(name) {
        this.task.push(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    console.log('eat');
                    resolve('eat', name)
                },0)
            })
        })
        return this
    }
    this.sleepFirst = function(timer) {
        this.task.unshift(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    console.log('sleepFirst');
                    resolve('sleepFirst', timer)
                },timer)
            })
        })
        return this
    }

    this.run = function() {
        this.task.reduce((acc, cur, index, arr)=>{
            return acc.then(cur)
        }, Promise.resolve())
    }
    setTimeout(()=>{
        this.run()
    },0)
    return this;
}
```



### 题三

任务队列可不断的添加异步任务（异步任务都是Promise），但只能同时处理5个任务，5个一组执行完成后才能执行下一组，任务队列为空时暂停执行，当有新任务加入则自动执行。

```
class RunQune{
    constructor(){
        this.list = []; // 任务队列
        this.target = 5; // 并发数量
        this.flag = false; // 任务执行状态
        this.time = Date.now()
    }
    async sleep(time){
        return new Promise(res=>setTimeout(res,time))
    }
    // 执行任务
    async run(){
        while(this.list.length>0){
            this.flag = true;
            let runList = this.list.splice(0,this.target);
            this.time = Date.now()
            await this.runItem(runList)
            await this.sleep(300) // 模拟执行时间
        }
        this.flag = false;
    }
    async runItem(list){
        return new Promise((res)=>{
            while(list.length>0){
                const fn = list.shift();
                fn().then().finally(()=>{
                    if(list.length === 0){
                        res()
                    }
                })
            }
        })
    }
    // 添加任务
    push(task){
        this.list.push(...task);
        !this.flag && this.run()
    }
}
```

思路：

我们每次截取task队列的前5个，构成任务队列

必须等这5个promise执行完毕后才能继续截取下5个

如何判断5个全部做完？5个promise，每执行完一个就可以 任务队列-1

当任务队列长度 = 0， 再继续后面的执行

等5个执行完，这里需要 await，所以返回的是一个 promise



自己写的：

少写了两个while, 一个是 list ， 一个是 taskList

```js
class RunQune{
    constructor(){
        this.list = []; // 任务队列
        this.target = 5; // 并发数量
        this.flag = false; // 任务执行状态
        this.time = Date.now()
    }
    async run() {
      while(this.list.length>0){
        let tashList = this.splice(0, 5)
        this.flag = true
        await this.runItem(tashList);
      }
        this.flag = false
    }
    runItem(tashList) {
        return new Promise((res)=>{
            while(tashList.length > 0) {
                let fn = tashList.shift();
                fn().then().finally(()=>{   // 不管成功失败，都要执行
                    if(tashList.length === 0) {
                        res()
                    }
                })
            }
        })
    }
    push() {
        this.list.push(...task)
        !this.flag && this.run()
    }
}
```







### 题四

期望id按顺序打印 `0 1 2 3 4` ，且只能修改 `start` 函数。

```
function start(id) {
    execute(id)
}
for (let i = 0; i < 5; i++) {
    start(i);
}
function sleep() {
    const duration = Math.floor(Math.random() * 500);
    return new Promise(resolve => setTimeout(resolve, duration));
}
function execute(id) {
    return sleep().then(() => {
        console.log("id", id);
    });
}
```

id 的打印是个异步事件，在 setTimeout 回调执行，按照上面的代码，谁的倒计时先结束，id就先打印，那么想要id按顺序打印，就需要将多个异步事件同步执行，promise 的链式调用可以派上用场。

思路：

如果不改的话，会发生什么

x秒会打印出0

x1秒后会打印出1... 顺序是不固定的

如何在start中改成链式调用？

```
function start(id) {
    // execute(id)
    // 第一种：promise 链式调用，execute 函数返回的就是 promise ，所以可以利用这一点，通过 promise.then 依次执行下一个打印
    this.promise = this.promise ? this.promise.then(()=>execute(id)) : execute(id)

    // 第二种：先用数组存储异步函数，利用事件循环的下一个阶段，即 setTimeout 的回调函数中执行 promise 的链式调用，这方法本质上和第一种是一样的
    this.list = this.list ? this.list : []
    this.list.push(() => execute(id))
    this.t;
    if (this.t) clearTimeout(this.t)
    this.t = setTimeout(() => {
        this.list.reduce((re, fn) => re.then(() => fn()), Promise.resolve())
    })

    // 第三种：数组存储id的值，在通过 await 异步执行 execute 函数
    this.list = this.list ? this.list : []
    this.list.push(id)
    clearTimeout(this.t)
    this.t = setTimeout(async () => {
        let _id = this.list.shift()
        while (_id !== undefined) {
            await execute(_id);
            _id = this.list.shift()
        }
    })
}
```

### 题五

手撕源码系列，来手写一个Promise，在动手前需要先了解 Promise/A+ 规范，列举关键部分的规范，详细规范可见文末链接

1. Promise 的状态：一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
2. 状态迁移：等待态可以迁移至执行态或者拒绝态；执行态和拒绝态不能迁移至其他状态，且必须有一个不可变的终值
3. then 方法：一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因，then 方法可以被同一个 promise 调用多次。then 方法接收两个参数 `onFulfilled, onRejected`，onFulfilled 和 onRejected 必须被作为函数调用，且调用不可超过1次。then 方法需返回 Promise 对象

根据这三点我实现了一个简化版的 Promise

```
function MPromise(executor) {
    this.status = 'pending'; // pending ， fulfilled ， rejected 
    this.data = '' // 当前promise的值，主要用于 then 方法中的 fulfilled ， rejected 两种状态的处理
    this.resolveFuncList = []; //  使用数组的原因是，一个promise可以同时执行多个 then 方法， 也就会同时存在多个then回调
    this.rejectFunc;
    const self = this;
    function resolve(value) {
        // 使用 setTimeout 实现异步
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.data = value;
                // 执行 resolve 函数
                self.resolveFuncList.forEach(func => {
                    func(value)
                });
            }
        })
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.data = value;
                self.rejectFunc && self.rejectFunc(reason);
            }
        })
    }
    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

MPromise.prototype.then = function (onFulfilled, onRejected) {
    let promise2;
    // 区分不同状态下的处理
    if (this.status === 'pending') {
        return promise2 = new MPromise((res, rej) => {
            this.resolveFuncList.push(function (value) {
                let x = onFulfilled(value);
                resolvePromise(promise2, x, res, rej)
            })

            this.rejectFunc = function (reason) {
                let x = onRejected(reason);
                resolvePromise(promise2, x, res, rej)
            }
        })
    }
    if (this.status === 'fulfilled') {
        return promise2 = new MPromise((res, rej) => {
            setTimeout(() => {
                let x = onFulfilled(this.data) // 输出将上一次执行结果
                resolvePromise(promise2, x, res, rej)
            })
        })
    }
    if (this.status === 'rejected') {
        return promise2 = new MPromise((res, rej) => {
            setTimeout(() => {
                let x = onRejected(this.data)
                resolvePromise(promise2, x, res, rej)
            })
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (x instanceof MPromise) {
        if (x.status === 'pending') {
            x.then(value => {
                resolvePromise(promise2, value, resolve, reject)
            }, reason => {
                reject(reason)
            })
        } else {
            x.then(resolve, reject)
        }
    } else {
        resolve(x)
    }
}
```

有的因为时间有限，会让手写 Promise 的 api，以下两个就常常被问到

1. 手写一个 Promise.all

```
/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部进入FulFilled状态的时候，才会resolve。
 */
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let values = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then(value => {
                console.log('value:', value, 'index:', index)
                values[index] = value
                count++
                if (count === promises.length) {
                    resolve(values)
                }
            }, reject)
        })
    })
}
```

2. 手写一个 Promise.rase

```
/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(resolve, reject);
        });
    });
}
```





