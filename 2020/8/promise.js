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