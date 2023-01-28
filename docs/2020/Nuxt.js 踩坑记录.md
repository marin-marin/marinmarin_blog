
### Nuxt中的路由
nuxt.js中没有对路由路径进行 user custom. 所有需要在路由方面上做的内容就只有新建page而已. 一个page对应的就是一个路由. <br />eg.
```javascript
/*
	pages/index.vue 地址为 xxx/
  pages/color.vue 地址为 xxx/color
  
 */
```
嵌套路由 也是同样的逻辑.  (需要添加一个同名的文件夹)
```javascript
/*
	pages/user.vue
  pages/user/index.vue  地址为 xxx/user/
  pages/user/detail.vue 地址为 xxx/user/detail
*/
```
动态路由 例如 `user/:id` 这种类型的路由, 需要在page文件名前加 `_` 
```javascript
/*
	pages/user/detail/_id 地址为 xxx/user/detail/:id
*/
```

### 部署到服务器
由于ssr渲染, 在打包后不能作为静态文件直接放到web服务器上 , 这样做的话也就和普通的SPA没什么区别了.<br />部署到服务器有两种方式, 一种是源代码直接放在服务器上, 通过nuxt自己的script来start.<br />另外就是在本地进行build打包后, 将必要的文件 ( `.nuxt` `package.json` `nuxt.config.js`  )放到服务器上, 再安装依赖后使用 nuxt - script 或者使用 `pm2` 进行服务启动.

#### 使用PM2启动的坑点
在使用PM2启动服务时, 老是出现启动后无法 ip + port 访问到页面. 又是看了ECS的安全组, 又是看了防火墙, 都没得问题. 一波 google 后发现在 `package.json` 中有个config
```javascript
//...
"config": {
	"nuxt": {
  	"host": "0.0.0.0",
  	"port": "3000"  
  }
}
//...
```
这个设置过后就OJBK了.<br />∵这个不进行指定host的话会直接到 localhost , 启动后并不是用私有IP启动的, 外部访问不到. 指定 0.0.0.0 后, 就启动在私网ip上了.

### 异步数据
nuxt 特有的一个方法, `asycnData` . 在组件初始化前进行异步的一个数据的操作. 比如请求啥的.<br />需要注意的是在这个方法里面不能使用 this 拿到 vm 实例. (都说了是在 **组件初始化前** )
```javascript
async asyncData (content) {
  const data = await get(...)
	return {...data}  // 这里处理好的数据就直接返回到实例中的data去了
}
```
此外, 对于使用 `vuex` 的情况下需要异步处理, Nuxt 也提供了一个 `fetch` 方法. 与 `asyncData` 方法一样, 都是在组件初始化前执行, 但是 `fetch` 方法不参与组件内数据的变更, 是针对 `Vuex` 状态异步变更的.
```javascript
async fetch ({store, params}) {
	const data = await request(...)
	store.commit('xxx', data)
}
```

### Nuxt.js中的数据持久化存储
由于我们采用了SSR渲染, 所以在使用 localStorage 之类的浏览器API时, 在组件初始化的过程中会出现 `undefined` 的错误.<br />所以解决办法有:

1. 不用SSR (爬)
2. 使用第三方插件 (vue-persistedstate / js-cookie 等)
3. 在 mounted 钩子中能够使用

### 状态管理机Vuex的使用
和Router一样的骚操作, 直接在 `store` 文件夹下创建对应名称的js文件就好了, Nuxt将为你创建对应名称的store的module (index.js为默认module)
```javascript
// store/index.js
/* state */
export const state = () => ({
	counter: 0
})

/* mutation */
export const mutation = {
	setCounter (state, counter) {
		state.counter = counter
  }
}

/* getters */
export const getters = {
	counterStr (state) {
  	return `第${state.counter}次`
  }
}

/* actions */
export const actions = {
	async setCounterAsync (state) {
  	const delta = await doSomething()
    state.counter += delta
  }
}

// 使用
vm.$store.state.counter
vm.$store.commit('setCounter', 12)
// ...
```
[其他module]
```javascript
// store/user.js

/* 几个内容同上 */

// 使用
vm.$store.user.state.counter
vm.$store.user.commit('xxx')
// 当然也可以使用 vuex 的辅助函数 mapGetters mapMutations 来方便确定命名空间

computed: {
	...mapGetters('user', ['name', ...])
}

methods: {
	...mapMutations['user', ['userMutation']]
}
```

### 全局组件的注册
由于我在使用 vuetify 时, 并不像 elementui 一样提供了全局消息提示的方法, 所以还是需要自己封装.<br />在 vue 项目中, 可以直接在 main.js 中进行引入. nuxt 由于自己在打包过程中全部帮你做了依赖引入之类的工作, 所以在开发代码中是没有main.js 之类的文件的. 那么我们可以按照官方文档中描述的 `plugins` 插件开发来进行注入
```javascript
// ~/plugins/msg.js
import Vue from 'vue'
import vueMsg from 'vue-msg'

Vue.use(vueMsg) // like this

Vue.prototype.$msg = vueMsg // inject to prototype

// ~/nuxt.config.js
// ...
plugins: [
  '~/plugins/msg.js'
]
```

