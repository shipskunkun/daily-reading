## 原文链接

[春招季如何横扫 Javascript 面试核心考点(基础版)](https://juejin.im/post/5c6ad9fde51d453c356e37d1)


## 自己不懂的问题

```diff
 -  1.函数传递，值传递，引用传递，js到底是啥传递???
 -  2. 深拷贝和浅拷贝，哪些深，哪些浅
 -  3. 执行上下文 = 代码解释执行时所在的环境
 		给形参复制 和 变量、函数提升，哪个先执行？
 -	4. 作用域： 房子，隔离变量
 		作用域链：找人，屋里找，出去找
- 	5. this 值的几种情况
- 	6. 原型链，那张图
 		继承，ES5 6中，es6 class
- 	7.
 		class Child extends Parent {
		  constructor(value) {
		    super(value)
		    this.val = value
		  }
		}
       
       为啥还要执行一遍， this.val = value?
-  8. dom 增删父子
-  9.
 	
```

## 扣原文


当自由变量从作用域链中去寻找，依据的是函数定义时的作用域链，而不是函数执行时。





<font color="red">1.3 深拷贝浅拷贝</font>



<font color="red">1.2 数据类型的判断</font>
这个自己之前也有总结过，收录在  
[判断是否是数组的几种方法](https://juejin.im/post/5be52b1ae51d450b3647e766)

再复习一下，typeof 只能基本类型  
   
 instanceof操作符判断类型不准确的问题在于，它假定只有一个全局环境     
  
constructor判断类型不准确的问题在于，可以被重写  

A instanceof B  等价于   

``` js
_instanceof(A, B);  

function _instanceof(L, R) {
    var R = o.prototype;
    var L = L.__proto__;
    while( true) {
        if(L == null) {
            return false;
        }
        if(L == R) {
            return true;
        }
        L = L.__proto__;
    }
}
```






``` diff
- 1.1 函数传递，值传递，引用传递，js到底是啥传递???
```

``` diff
- 结论:
```

js中所有函数的参数都是按值来传递的。所有函数的参数都是按值传递的,也就是说把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。


           
``` diff
- 原文：
```

在参数传递方式上，有所不同。

函数的参数如果是简单类型，会将一个值类型的数值副本传到函数内部，函数内部不影响函数外部传递的参数变量

如果是一个参数是引用类型，会将引用类型的地址值复制给传入函数的参数，函数内部修改会影响传递


``` diff
- 书上怎么说的？高程书 4.1.3 
```

js中所有函数的参数都是按值传递的，也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。

让 obj = person 指向同一个地址，然后改变了 person.name  
然后又让 obj 指向新地址。

``` js
function setName(obj) { 
	obj.name = "Nicholas";
	obj = new Object();
	obj.name = "Greg";}var person = new Object();setName(person);alert(person.name);    //"Nicholas"

```






