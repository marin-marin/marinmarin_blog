Vue终于在2020/09/20这一天发布了第一个beta版 `One Piece` . 作为一只前端狗, 还得继续学学学. 在 vue2 用的熟练的情况下, 迁移到 vue3 的 compositionAPI 的操作上又有哪些我们需要注意的点呢? <br />这篇文章我将在边学习边记录的情况下完成. 也算是对整个学习过程的一个记录和总结.


## 全局API
```javascript
// main.js 2.x
new Vue({...}).$mount('#app')

// main.js 3.x
const app = createApp({...}).mount('#app')
```
使用新提供的ApplicationAPI `createApp` 来构建一个单例的应用. 将从2.x的多个实例中解放出来, 全局变量可以有清晰明确的定位.<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/122315/1600929982673-fc63feca-3a8d-41f9-8ec8-d02da804ae2d.png#align=left&display=inline&height=325&margin=%5Bobject%20Object%5D&name=image.png&originHeight=325&originWidth=569&size=30928&status=done&style=none&width=569)<br />同时, 我们之前所有自定义全局变量的方式也可以针对 **app** 进行优化.
```javascript
// main.js 2.x
Vue.prototype.$global = 'global str'

// main.js 3.x
app.globalData.global = 'global str'
```

## v-model的变更
2.0中 `v-model` 是 `:value` 和 `$emit('update:value')` 的语法糖, 相当于是硬编码 `v-model` 和 `value` 的关系了.<br />2.x中提供了实例方法 `model` 来指定 `v-model` 的属性和事件
```javascript
export default {
  model: {
  	prop: 'title', // 这里上层使用v-model时就变成对title的值进行更改了
    emit: 'change'
  }
}
```
3.0中则可以直接指定"代理"的属性, 其用法和 `v-bind` 差不多
```vue
<Children v-model:title="title" />
```
![image.png](https://cdn.nlark.com/yuque/0/2020/png/122315/1600937940169-542d720a-8bf6-4a12-b093-bbaa52e48a53.png#align=left&display=inline&height=282&margin=%5Bobject%20Object%5D&name=image.png&originHeight=282&originWidth=734&size=37888&status=done&style=none&width=734)

## 函数式组件
2.x中经常为了节省性能使用 `functional` 为 true 的子组件来快速编写组件. 但是在 vue3 中, 普通组件的性能已经大幅提升, 函数式组件对于普通组件来说, 性能的优势并不大, 所以官方现在还是推荐只使用普通组件来编写你的代码.<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/122315/1600939568179-2b7c3250-ea16-4f31-ae1e-0a1eae87c4a5.png#align=left&display=inline&height=165&margin=%5Bobject%20Object%5D&name=image.png&originHeight=165&originWidth=742&size=26483&status=done&style=none&width=742)<br />functional关键字已经被删除, 那么如何在vue3中创建函数式组件呢?
```javascript
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```

## 渲染函数

###   createElement
2.x的 `createElemen` 现在可以直接从 `vue` 引入了. 之前要在自己开发的第三方js中使用真的一把辛酸泪. 你得先实例化一个 `vue` 实例, 才能调用到 `vm.$createElement` 方法.
```javascript
import { h } from 'vue'

// 选项式
export default {
	render: () => {
    return h('div', {}, 'DIV')
  }
}

// 组件式
export default {
	setup (props, ctx) {
    // 可以访问到作用域中的props和ctx了
  	return () => h(props.tag, props.attrs, props.children)
  }
}
```

###   VNode props拍平
2.x的 `createElement` 方法中的 VNode 的 props 嵌套比较多.
```javascript
h('div', {
	class: {},
  style: {},
  domProps: { innerHTML: '' }, // 原生DOM的属性
  on: {
  	click: () => {}  // 事件的挂载
  }
}, 'PROPS')
```
在 vue3 中针对这一部分进行了优化
```javascript
h('div', {
  innerHTML: '',
	onClick: () => {}
}, 'PROPS')
```

## $scopedSlots改名
2.x的 `$scopedSlots` 更名为 `$slots` . (用的不太多, 也不太了解 = =)

## template
template虚拟节点内不再限制只能有一个子DOM了.
```javascript
<template>
  <h1>About</h1>
  <h2>Vue</h2>
  <h3>3.0</h3>
  <h4>One Piece</h4>
</template>
```
这样处理也不会报错, 而这在2.x中是不被允许的
