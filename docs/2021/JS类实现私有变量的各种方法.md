	随着前端技术发展, 之前的弱类型语言的js逐渐有了ts等向强类型语言靠拢的趋势. 对于`类`的概念来说, `私有变量`是强类型语言中必不可少的一个环节, 对应`privite`关键字.


### ES5的实现

#### 闭包
> **具体详情参看之前的blog **[https://www.yuque.com/chaojimalihao/px5pdq/msbm2k](https://www.yuque.com/chaojimalihao/px5pdq/msbm2k)

闭包本身即是规定一个私有作用域, 不影响外部作用域避免全局变量名污染. 那么这样也可以视为是形成了一个私有变量的环境, 闭包内部能够访问, 外部不能访问到, 需要通过闭包回调才能拿到变量.
```javascript
function closure () {
	var priviteProp = 123  // 在调用函数外部无法取得这个变量
  return () => {
		var result = priviteProp++ // 这里能访问内部变量
    return result
	}
}
```
	同样, 闭包的缺点即是不能及时清理掉不需要用的内部变量, 申明过多的话会造成内存泄露.


### ES6的实现

#### WeakMap
弱引用map, 即是`map`数据结构的弱化版本. 他不像`map`那样对存储的数据有**强引用**(即 存储的数据原本对象已经置为null了, 由于map有引用, 数据在堆内存中将仍然存在)
```javascript
let obj = {test: 123}
const m = new Map()
m.set(obj, obj.test)
obj = null
m.forEach((v, k) => {
	console.log(m.get(k)) // {test: 123} 数据仍然存在
})
```
	但是如果使用`WeakMap`, 将在原始数据被置为null时同时清除所有`WeakMap`上的引用, 
```javascript
let obj = {test: 123}
const wm = new WeakMap()
wm.set(obj ,obj.test) // 注意: WeakMap的key不能是基本类型
obj = null

```
	而且`WeakMap`的`key`是不可遍历的, 这种特性也就赋予了`WeakMap`能用来做`私有变量`存储的能力.


#### Symbol
```javascript
function Person (name) {
	const _p = Symbol('privite')

  this[_p] = { name }

	this.getName = () => {
  	return this[_p].name
  }
}

let p = new Person('Marin')
p.getName() // Marin
p.name // undefined
p._p // undefined
```

### ES10

#### `#`新特性
对, 就是 `#`.<br />具体用法直接看例子
```javascript
class Person {
	#name = 'marin'
  constructor (name) {
  	this.#name = name
  }

	getName () {
  	return this.#name
  }
}

let p = new Person('Mary')
p.getName()  // Mary
p.name // undefined
p.#name // error
```
	简单粗暴, 就和 `privite` 关键字一样. TS里有`privite`关键字, js看着眼红, 就整了个这.  但是现在还是属于实验性阶段,  适用性还不是很广
