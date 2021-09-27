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
class MyPromise {
    constructor(fn) {
        this.status = 'pending';
        this.value = null;
        this.fufillcbs = [];
        this.rejectcbs = [];
        let resolve = val => {
            if(this.status == 'pending') {
                this.status = 'fufilled';
                this.value = val;
                for(let cb of this.fufillcbs) {
                    cb()
                }
            }
        }
        let reject = val => {
            if(this.status == 'pending') {
                this.status = 'rejected';
                this.value = val;
                for(let cb of this.rejectcbs) {
                    cb()
                }
            }
        }

        try{
            fn(resolve, reject)
        }
        catch(e) {
            reject(e)
        }
    }

    then(onfufilled, onrejected) {
        /* 透传实验

        Promise.resolve(2).then(4, 3).then((val)=>{
            console.log(val)
        },(val)=>{  console.log(val)})
        //期待2，正确
        

        Promise.resolve(2).then((val)=> val, 3).then((val)=>{
            console.log(val)
        },(val)=>{  console.log(val)})
        // 如果 onfulfiled 不是函数，包装成 (val) => val

        Promise.reject(2).then(null, 7).then((val)=>{
            console.log(val)
        },(val)=>{  console.log(val)})
        //期待2，正确


        Promise.reject(2).then(null, ( val)=> {throw val}).then((val)=>{
            console.log(val)
        },(val)=>{  console.log(val)})

        
        Promise.reject(2).then(null, function(r) {}).then((val)=>{
            console.log(val)
        },(val)=>{  console.log(val)})
        
        */

        let promise2;


        promise2 = new MyPromise((resolve, reject)=>{
            if(typeof onfufilled !== 'function') {
                onfufilled = val => val;
            }
            if(typeof onrejected !== 'function') {
                onrejected = val => reject(val);
            }
            /*
            if(this.status == 'pending') {
                setTimeout(()=>{
                    try{
                        this.fufillcbs.push(()=>{
                            let x = onfufilled(this.value)
                            resolvePromise(promise2, x, resolve, reject);
                        })

                        this.rejectcbs.push(()=>{
                            let x = onrejected(this.value)
                            resolvePromise(promise2, x, resolve, reject);

                        })

                    }catch(e) {
                        reject(e)
                    }
                }, 0)
    
            }
            */
            if(this.status == 'fulfilled') {
                setTimeout(()=>{
                    try{
                        let x = onfufilled(this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
                
            }
            if(this.status == 'rejected') {
                setTimeout(()=>{
                    try{
                        let x = onrejected(this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
            }
        })

        return promise2;
    }

    catch(onrejected) {
        return this.then(null, onrejected);
    }

    //finally方法总是会返回原来的值。
    //不管前面的 Promise 是fulfilled还是rejected，都会执行回调函数callback。
    finally(fn) {
        let P = this.constructor;
        return this.then(
            value  => P.resolve(fn()).then(() => value),
            reason => P.resolve(fn()).then(() => { throw reason })
        );
    }

    static race(promises) {
        return new MyPromise((resolve, reject)=>{
            for(let i of promises) {
                i.then(resolve, reject)
            }
        })
    }
    static reject (val) {
        return new MyPromise((resolve, reject)=>{
            reject(val)
        })
    }
    static all (promises) {
        let dataArr = [];
        let l = promises.length;
        let i = 0;
        return new MyPromise((resolve, reject)=>{
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
    static resolve (value) {
        if(value instanceof MyPromise) return value // 根据规范, 如果参数是Promise实例, 直接return这个实例
        return new MyPromise(resolve => resolve(value))
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) {
        reject( new Error('不能自己调用自己'))
    }
    try{
        if( x instanceof MyPromise) {
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


let p = new Promise((resolve, reject)=>{
    return new Promise((resolve, reject)=>{
        reject(2)
    })
}).then((val)=>{
    console.log(1, val)
},(val)=>{
    console.log(2, val)
})



// 如果x 或者 y 是对象
let x = {
    then: function(onfufilled, onrejected){
        onfufilled();
        onrejected();
    }
}
x.then(()=>{console.log(3)}, ()=>{console.log(4)})

function y () {}
y.then = function(onfufilled, onrejected){
    onfufilled();
    onrejected();
}

y.then(()=>{console.log(3)}, ()=>{console.log(4)})




/* 8.28 日 版本二
构造函数，resolve, reject

then
    判断状态，不同处理
catch
finally
静态方法
    all
    race
    resolve
    reject
*/

// 错误！都是构造函数里面的
class MyPromise {
    this.status = 'pending';
    this.data = null;
    this.resolveCbs = [];
    this.failCbs = [];

    function resolve (v) {
        if(this.status == 'pending') {
            this.status = 'fulfilled'
            this.resolveCbs.forEach((cb, index)=>{
                cb()
            })
        }
    }
    function reject (v) {
        if(this.status == 'pending') {
            this.status = 'rejected'
            this.failCbs.forEach((cb, index)=>{
                cb()
            })
        }
    }

    try {
        constructor((resolve, reject))
    }catch(e) {
        reject(e)
    }
}

// 第三版
function promises2(promises2, x, resolve, reject) {
    /*四种情况
    循环引用
    x是一个primise , promise2 的状态跟随 x
    thenable, function 或者 object
    then 是方法，then 不是方法
    普通值
    */

    if(promises2 === x) {
        reject(new Error('循环引用'))
    }

    if(x && typeof x === 'object' || typeof x === 'function') {
        //保证只能调用一次
        let used;
        try{
            let then = x.then;
            if(typeof then === 'function') {
                then.call(x, y=>{
                    if(used) return
                    used = true
                    resolvePromise(promises2, y, resolve, reject)
                }, Error=> {
                    if(used) return
                    used = true
                    reject(Error)
                })
            }else {
                resolve(x)
            }
        }catch(e) {
            if (called) return
            called = true;
            reject(error)
        }else {
            resolve(x)
        }
    }



}
class MyPromise {
    constructor(fn) {
        this.status = 'pending';
        this.data = null;
        this.resolveCbs = [];
        this.failCbs = [];

        function resolve (v) {
            if(this.status == 'pending') {
                this.status = 'fulfilled';
                this.data = v;  //忘记了
                this.resolveCbs.forEach((cb, index)=>{
                    cb()
                })
            }
        }
        function reject (v) {
            if(this.status == 'pending') {
                this.status = 'rejected';
                this.data = v;
                this.failCbs.forEach((cb, index)=>{
                    cb()
                })
            }
        }

        try {
            fn(resolve, reject)
        }catch(e) {
            reject(e)
        }
    }
    


    // 思路：反正还是要返回 promise 的
    static all (promises) {
        return new MyPromise((resolve, reject)=> {
            let result = [];
            for(let i = 0 ; i < promises.length; i++) {
                promises[i].then(data=> {
                    result.push(data);
                    if( i == promises.length - 1) {
                        resolve(result)
                    }
                }, reject)
            }
        })
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for(let i = 0 ; i < promises.length; i++) {
                promises[i].then(resolve, reject)
            }
        })
    }

    static resolve(value) {
        if(value instanceof MyPromise) return value // 根据规范, 如果参数是Promise实例, 直接return这个实例
        return new MyPromise(resolve => resolve(value))
    }

    static reject(value) {
        return new Promise((resolve, reject)=>{
            reject(value)
        })
    }

    then(onfufilled, onrejected) {
        // 处理值穿透

        onfufilled = typeof onfufilled === 'function' ? onfufilled : (value)=> value;
        onrejected = typeof onfufilled === 'function' ? onfufilled : (value)=> {throw value};

        let self = this;
        //返回一个新的 promise
        let promises2 = new Promise((resolve, reject)=> {
            if(self.status == 'fulfilled') {
                setTimeout(()=>{
                    try {
                        let x = onfufilled(self.value)
                        resolvePromise(promises2, x, resolve, reject)
                    }catch(e) {
                        throw(e)
                    }
                })
            }

            if(self.status == 'rejected') {
                setTimeout(()=>{
                    try {
                        let x = onfufilled(self.value)
                        resolvePromise(promises2, x, resolve, reject)
                    }catch(e) {
                        throw(e)
                    }
                })
            }

            if(self.status == 'pending') {
                self.onfufilled.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onfufilled(self.value)
                            resolvePromise(promises2, x, resolve, reject)
                        }catch(e) {
                            throw(e)
                        }
                    })
                })
                self.onrejected.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onfufilled(self.value)
                            resolvePromise(promises2, x, resolve, reject)
                        }catch(e) {
                            throw(e)
                        }
                    })
                })
            }
        })

        return promises2

    }

    catch(fn) {
        return this.then(null, fn)
    }

    /* 
    （1）f是一个无参函数，不论该promise最终是fulfilled还是rejected。
    （1）f是一个无参函数，不论该promise最终是fulfilled还是rejected。2）finally不改变promise的状态，
        
     调用第一个then 是因为

    */
    finally(fn) {
        let P = this.constructor;
        return this.then(
            value  => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason })
        );
    }
}



// 理解： finally
//  相当于透传，无论什么状态，我执行 finally的 函数，而且把 this 的值传递出去

let p = Promise.resolve(2).finally(() => {}).then((v)=>{
    console.log('成功',v)
    return v;
}, (v)=>{
    console.log('失败',v)
    throw v;
})

// 理解 finally
let  p2 = Promise.reject(2).finally(() => {
    Promise.reject(444)
    return  2  // 无论finaly 的函数式是什么，我返回的只能是 this.value
}, ()=>{
    throw 2
}).then((v)=>{
    console.log('成功',v)
    return v;
}, (v)=>{
    console.log('失败',v)
    throw v;
})

// 如果 resolve 参数是一个 promise 怎么处理
let p4 = Promise.resolve(Promise.reject(4)).then((v)=>{
    console.log('成功',v)
    return v;
}, (v)=>{
    console.log('失败',v)
    throw v;
})


