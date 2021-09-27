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
