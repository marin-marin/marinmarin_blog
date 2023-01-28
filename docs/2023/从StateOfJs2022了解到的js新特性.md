一年一度的 [StateOfJs](https://2022.stateofjs.com/zh-Hans/) 调研报告又出来辣, 除了一如既往的`从业者调查``特性/框架统计``T-Shirt`等, 也有一大批2022年更加活跃起来的js新特性数据公布, 其中不少已经在现代浏览器中有了广泛的支持, 现在来康康统计这些新特性里有意思的内容吧.

## 语言特性

### Nullish Coalescing **空值合并运算符 (??)**
`??`运算符解决了一个 `||`逻辑或运算符的痛点 -- javascript对于 `0`与 `null/undefined`的精准判断. 他相当于`0 NaN ''`则返回 `true`
```javascript
0 ?? 1 // 0
NaN ?? 1 // NaN
'' ?? 1 // ''
null ?? 1 // 1
undefined ?? 1 // 1
```
> 注意 `??` 不能与 `&& ||` 在同一优先级下使用
> null || undefined ?? 'marin'   // SyntaxError
> (null || undefined) ?? 'marin'  // 'marin'


### Privted Fields 类私有域
在`typescript`中有类似`Java`的`private`关键字, 但是在js中要实现私有域/私有变量需要一些[其他的方法](https://www.yuque.com/chaojimalihao/px5pdq/lp16px). 新特性直接赋予了js更方便的类私有属性能力
```javascript
class ClassWithPrivateField {
  #privateField;

  constructor() {
    this.#privateField = 42;
    delete this.#privateField;   // 语法错误
    this.#undeclaredField = 444; // 语法错误
  }
}

const instance = new ClassWithPrivateField()
instance.#privateField === 42;   // 语法错误
```

### Logical AND assignment 逻辑与归并(&&=)
一句话总结
```javascript
x &&= y
// equals
x && (x = y)

// 注意和 &= 的区别
x &= y
// equals
x = x & y
```

### Promise.any()
类似数组操作的 some 的意思.<br />接收一个由Promise组成的可迭代对象, 返回一个新的promise<br />**与Promise.race()的区别**<br />**race **是返回无论结果是 resolve 还是 reject 的第一个promise<br />**any  **是只返回第一个 resolve 的promise
```javascript
let promiseList = [
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('timeout')), 200)
  }),
  new Promise((resolve, reject) => {
  	setTimeout(() => resolve(123), 500)
  }),
  Promise.reject(new Error('wuhu'))
]

const pAny = Promise.any(promiseList)
pAny.then(res => console.log(res)) // 500ms后显示123

const pRace = Promise.race(promiseList)
pRace.then(res => console.log(res)) // 立即输出 Error -> wuhu
```
