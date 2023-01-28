我们在做vue开发的时候, 经常会遇到父子组件, 祖孙(跨级)组件, 陌生人组件间需要传递一些参数. Vue给我们提供了几个方法用以适用于各个不同的场景.<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1560505776138-194c28fd-3e0d-4f55-b150-48f61e40c8a0.png#align=left&display=inline&height=186&name=image.png&originHeight=186&originWidth=302&size=33779&status=done&width=302)![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1560505782088-b9ef5c87-55ef-441a-bb65-59169f88202e.png#align=left&display=inline&height=195&name=image.png&originHeight=195&originWidth=223&size=24754&status=done&width=223)

### props & emit
```html
// parent.vue
<template>
  // component children
  <children :propObj="parentObj" @emitEvent="objUpdate"></children>
</template>

// =============
// children.vue
<template>
  <div>{{props.parentObj}}</div> // 从父组件传递来的parentObj
  <button @click="$emit('emitEvent', {name: 1})"></button> // 提交一个 emitEvent 事件触发父组件 objUpdate 事件
</template>
```
此方法用于父子组件间通讯, 使用vue指令 v-on 传递父组件的数据给子组件, 子组件通过 $emit 提交一个事件来触发父组件数据更新.
> 该方法有缺点是无法直接处理 **祖孙(跨级)组件** 之间的数据传递, 不然的话只有一级一级的传递, 维护成本很高.


### eventBus 事件中心
由于上面方法的局限性, 我们可以散发思维:<br />创建一个空的实例, 用他作为所有组件的中间实例, 同时在自己的组件上监听这个实例的子组件提交 $emit

```html
// eventBus.vue
<script>
  export default {
  	name: 'eventBus'
  }
</script>

<!-- AB组件之间没有任何联系 -->
// A.vue
<script>
  import bus from 'eventBus'
  export default {
    // ...
    created () {
			bus.$on('emitEvent', (data) => {
      	// do something with data
      })
    }
    // ...
  }
</script>

// B.vue
<script>
  import bus from 'eventBus'
  export default {
    // ...
    created () {
			bus.$emit('emitEvent', '提交数据')
    }
    // ...
  }
</script>
```
这种方法的好处是, 脱离了父子链, 甚至可以在毫不相干的组件间传递数据, 仅仅使用一个中间组件.

但是使用事件中转的时候会有一个问题, **$on** 的重复监听. 所以我们需要在自己的组件销毁的时候同时取消监听相应的事件.

```javascript
// c.vue
export default {
	// ...
  created () {
    bus.$emit('emitEvent', '提交数据')
  },
  beforeDestroy () {
  	bus.$off('emitEvent', this.emitEvent)
    								// 取消绑定不添加指向变量的话
    								// 会取消掉bus对于emitEvent的所有监听
    								// 所以需要根据实际情况判断是否需要取消指定调用事件, 或全部事件
  },
  methods: {
  	emitEvent () {
    	// DO STH
    }
  }
  // ...
}
```



### Vuex
vuex是vue全家桶中的一个响应式的状态管理模式, 功能很强大. 通常在大型项目中承当状态存储, 全局数据处理<br />![](https://cdn.nlark.com/yuque/0/2019/webp/122315/1560994016333-8d8ef629-e8a4-42d5-8f1b-7b7ef11dd5ea.webp#align=left&display=inline&height=464&originHeight=464&originWidth=761&size=0&status=done&width=761)

#### vuex的几个问题

1. vuex作为vue的插件, 是应用级的管理模式, 在页面重载(刷新)后, 当前所存储的状态数据将会全部丢失. 此时, 我们将需要持久存储的数据使用 **WebStorage **(localStorage , sessionStorage, cookie) 来进行持久化存储(视使用场景而定)
2. state 中存储的内容无法直接利用赋值变更, 必须经过 **mutations** 中 **commit **来提交变更. 同时, 如果变更是**异步**的话, 应该在 **Actions **中使用 **dispatch **来处理好异步的数据, 再通过 Mutations 的 commit 来提交变更.
> 官方解释:
> ![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1560994642052-d0c9a737-a7a0-42d6-bd39-e1f4e05b80d6.png#align=left&display=inline&height=436&name=image.png&originHeight=436&originWidth=757&size=56818&status=done&width=757)


### $attrs & $listeners
个人把这两个理解为 "捡漏".
> 官方解释
> ![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1561011416891-a6bd8c48-6408-4349-87f3-98a5b2ed12cd.png#align=left&display=inline&height=728&name=image.png&originHeight=728&originWidth=739&size=67393&status=done&width=739)

简化了**跨级**(爷孙)组件之间的通信, 这个属性在 **中间组件** 中进行传递.

```html
// grand.vue  爷组件 (顶层组件)
<template>
	<parent :attrA="'attrA'" :attrB="'attrB'"></parent>
</template>

// parent.vue 父组件 (中间组件)
<template>
  <child v-bind="$attrs" v-on="$listeners"></child>
</template>
<script>
  export default {
    props: {
      attrA: {...} // 这里在中间组件中使用prop识别到了传递下来的A, B并没有识别
    },
    created () {
    	console.log(this.$attrs) // {attrB: 'attrB'}
    }
  }
</script>

// child.vue 子组件 (底层组件)
<script>
  export default {
  	props: {
      attrB: {...} // 可以直接识别到爷组件(跨级)传递下来的 attrB
		},
    created () {
    	console.log(this.attrB) // "attrB"
    }
  }
</script>
```


### privide & inject
顾名思义, 即是 **提供 **和 **注入**. 由上层组件 **提供(privide)** , 在下层组件中 **注入(inject)**. 方式感觉有点像 **Vue.mixin**. 

```javascript
// grand.vue
export default {
	name: 'Parent',
  privide () {
    return {
    	keyA: 'valueA',
      keyB: 'valueB'
    }
  }
}

// child.vue (中间的组件同样可以直接拿到注入的内容)
export default {
	name: 'Child',
  inject: {
    'keyA': {
    	from: 'grand', // 可选, 选择注入属性的来源, 在上级多层组件有同key属性的时候可以选择
      default: 'valueA' // 可选, 设置默认值.
      					// 方式与 props 类似, 在默认为一个数组或对象的时候, 需要使用一个工厂函数来返回
    }
  }
}
```

注意: privide 提供的内容是**无法响应式**变化的, 也就是说, 下层的 inject 数据无法跟随上层 privide 的更改改变.<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1561012799242-fa298d51-b5c3-4305-99cf-8c3bcdf23428.png#align=left&display=inline&height=83&name=image.png&originHeight=83&originWidth=690&size=14287&status=done&width=690)<br />按照官方的说法, 那么我们可以直接将整个上层组件传入

```javascript
// grand.vue
export default {
	privide () {
  	return {
    	grand: this // 将实例传入
    }
  },
  data () {
  	return {
    	name: 'grand'
    }
  }
}

// child.vue
export default {
	inject: ['grand'],
  computed: {
  	name: this.grand.name // 此时的内容是响应变化的了
  }
}
```


### $parent & $children ($refs)
这俩玩意儿直接就没啥说的了. 有点操作 dom 的感觉了. 一个是拿到自己的父组件 ($parent) , 一个是拿到自己的子组件 ($children), 然后使用里面的 data 和 methods 等就完事了.

```javascript
// grand.vue
`<template>
	<parent ref="parent"></parent> // 子组件
  <child-a ref="childA"></child-a> // 孙组件
	<other-component>
		<child-b></child-b> // 孙组件B
	</other-component>
</template>`
const grand = {
  data () {
  	return {
    	name: 'grand'
    }
  },
  created () {
  	console.log(this.$children) // [VueComponent, VueComponent] (parent, childA)
    														// $children 只能拿到下一层的组件, 不能拿到嵌套插槽(slot)的子组件
    console.log(this.$refs.childB) // VueComponent (childB) . ref 指哪打哪
  }
}


// parent.vue
`<template>
  <child-b ref="childB"></child-b> // 子组件
</template>`
const parent = {
  data () {
  	return {
    	name: 'parent'
    }
  },
  created () {
  	console.log(this.$children) // [VueComponent]
  }
}

// childA.vue
const childA = {
	data () {
  	return {
    	name: 'childA'
    }
  },
  created () {
  	console.log(this.$parent) // VueComponent (grand)
    console.log(this.$parent.name) // grand
  }
}
```

$parent 和 $children 是父子间的通讯, 无法直接跨级通讯. 使用 $refs 后就是指哪打哪 (当然前提是有定义了 ref 属性.)
