> 在web项目中做dropdown的时候经常会遇到一种恼人的情况：在btn上绑定了显隐事件，mouseenter触发了dropdown，但是鼠标一移出btn，dropdown就又没了

![dropdown1.gif](https://cdn.nlark.com/yuque/0/2019/gif/122315/1575517234592-e91bdfa8-083a-4ae8-9a4a-68e2366bdc7e.gif#align=left&display=inline&height=254&name=dropdown1.gif&originHeight=254&originWidth=361&size=30308&status=done&style=none&width=361)

### DOM元素相近的情况
这种情况指 btn 元素和 dropdown 元素关系比较近（例如父子关系，兄弟关系），选择器可以直接选择到的情况。<br />通常来说，直接操作 css ，为两者都添加 `hover显示`  就可以达到想要的目的。<br />![dropdown2.gif](https://cdn.nlark.com/yuque/0/2019/gif/122315/1575517667118-6d86abe4-1bde-44b8-91a0-a16035169707.gif#align=left&display=inline&height=125&name=dropdown2.gif&originHeight=125&originWidth=284&size=50472&status=done&style=none&width=284)

```css
.btn:hover ~ .dropdown { // 或者父子关系的选择器
  display: block;
}
.dropdown:hover {
  display: block;
}
```

这种方式优点是 直接操作css，没有用到js，性能比较好。缺点就是 btn 和 dropdown 必须在移动中没有空隙，否则无法无缝移动到 dropdown 上维持显示。<br />如果使用 js ，也可以直接通过操纵 dom 动态修改 style 或者动态增减 class 达到目的，这里就不再赘述。


### 通用解决办法
> 如果我的 dropdown 是通过 js 动态添加的 dom 呢？如果我的 dropdown 和 btn 在 dom 树里岔了八百里呢？

直接通过js加上延迟就一切搞定了。<br />![dropdown3.gif](https://cdn.nlark.com/yuque/0/2019/gif/122315/1575518268857-c614b813-f9b7-44f1-8778-de3fbc36ef8c.gif#align=left&display=inline&height=270&name=dropdown3.gif&originHeight=270&originWidth=294&size=44663&status=done&style=none&width=294)

```javascript
// in vue
{
	timeout: null,
	show () {
  	this.timeout && clearTimeout(this.timeout)
  	this.timeout = setTimeout(() => {
  	  this.visiable = true
	  }, 300)
	},
	hide () {
  	this.timeout && clearTimeout(this.timeout)
  	this.timeout = setTimeout(() => {
    	this.visiable = false
  	}, 300)
	}
}
```

```html
<!-- vue下，其他大同小异 -->
      <div class="btn" @mouseenter="show" @mouseleave="hide">
        按钮
      </div>
<!--  注意两个元素都要绑定好mouseenter和mouseleave事件      -->
      <div class="dropdown" :style="{display: visiable ? 'block' : 'none'}" 
           @mouseenter="show" @mouseleave="hide">
        <p v-for="item in options">{{item.label}}</p>
      </div>
```

然后再加上一点点动画和特效，就会很好康很好用了。
