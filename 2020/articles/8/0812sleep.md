js中如何模拟sleep

参考文章：

https://cloud.tencent.com/developer/article/1090479

https://www.ctolib.com/topics/67500.html





1. jQuery的 $.delay 方法

   但是返回的是jQuery 对象，一般用于链式调用， pass

2. 使用时间差

```
console.log('start...');
console.log('now time: ' + Date(/\d{10,10}/.exec(Date.now())));
function sleep(sleepTime) {
       for(var start = Date.now(); Date.now() - start <= sleepTime; ) { } 
}
sleep(5000); // sleep 5 seconds
console.log('end...');
console.log('end time: ' + Date(/\d{10,10}/.exec(Date.now())));
```



```
function sleep(n) {
    var start = new Date().getTime();
    while(true)  if(new Date().getTime()-start > n) break;
}
```

3. 使用promise

   ```
   sleep = (ms) => {
     return new Promise(resolve => setTimeout(resolve, ms))
   }
   
   async function b() {
     await sleep(1000)
     console.log('delay output.')
   }
   ```

   