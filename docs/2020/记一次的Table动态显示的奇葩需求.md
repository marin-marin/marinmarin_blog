---

---

# 记一次的Table动态显示的奇葩需求

> 前序. 在需求不明确的时候千万不要直接拿着就开始码代码,很容易掉进逻辑坑里完全出不来了.



### 需求描述

- 界面内有一表格显示(使用的ElementUI框架),要求动态显示表格列.(如:有姓名,电话,住址列,根据情况隐藏住址列)
- 表格列要进行显示优先级分层,根据用户视窗的分辨率来限制显示优先级.优先级高的列优先显示,以外的列隐藏

![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1552617695116-5ef2854f-ac99-40db-bab3-1a0e49c4d76d.png#align=left&display=inline&height=175&margin=%5Bobject%20Object%5D&name=image.png&originHeight=175&originWidth=641&size=41978&status=done&style=none&width=641)
>                                                  (表格分布)

- 列中有一特殊列需要根据列的内容进行宽度适应.其中的内容有(图标+名字)和(只有图标)两种情况


![image.png](https://cdn.nlark.com/yuque/0/2019/png/122315/1552619013704-e9ca296d-8624-4de7-86cb-cf27889b469c.png#align=left&display=inline&height=245&margin=%5Bobject%20Object%5D&name=image.png&originHeight=245&originWidth=906&size=8708&status=done&style=none&width=906)



### 实现

> 背景: vue2.x + element-ui2.2 + vuex

> 这次的需求说实在的,我没有做过.但是一拿到手就马不停蹄地开始做,不事先想好确实是失误,耽误了大部分时间.

1. 首先实现动态列表.

①确定一个列表数据数组

```javascript
// 列表数组
vm.tableColsSet = [
  {
    name: 'name', // 用于在渲染table时如果有自定内容来区分列
    label: '列名',
    width: 100, // 这里宽度和最小宽度有互斥的关系
    minWidth: 100,
    prop: 'data', // 用于直接显示取得数据中的数据key
    align: 'center', // 对齐方式
    level: 1, // 这里level用于表示该列的显示优先级, 值越小优先级越高
    ... // 等等其他的config项
  },
  ...
]
// 组件data中定义变量来限制显示优先级
vm.limitLevel = 5
```
②监听 **window.onresize** 事件,在该事件中进行对上述数组的增减处理
> 目前一切工作都是在渲染前做的
> 


---


**错误方向**(直接开始走偏了)<br />**~~a) ~~**为 **limitLevel** 添加 **watcher.**

```javascript
limitLevel (lv) {
	// 此处动态处理tableColsSet
  tableColsSet = tableColsSet.filter(col => col.level <= lv)
}
```
然后,我就懵DIO了.<br />我在第N列有一个Special列,那个列需要根据里面的内容来决定宽度.<br />在宽度足够的时候,能显示Special列里的全部内容;<br />在宽度不足的时候,只显示Special列中的部分内容;<br />**BUT**<br />如果Special列中内容简化后,宽度又够了,又可以显示出隐藏的列,或者拓宽Special列的内容;<br />同样,如果拓宽后,宽度不够,又进行隐藏....<br />...<br />已经被绕昏了.只有重头再想想.<br />另外, 这里所用的 watcher 会让更改实时渲染都页面,造成页面性能下降,数据过多的时候还可能造成页面卡顿,这是很影响用户体验的一点.

---

**正常的方向**<br />应该是在每次resize时,将列表中的列分为两类:

```javascript
const otherWidth = 200 // table以外同页面下占据宽度的其他元素的总宽
// 固定列宽度
let fixedColsTotalWidth = 0
this.tableColsSet.forEach(col => {
	col.width && (fixedColsTotalWidth += col.width)
})
// 表格总宽
const tableWidth = document.body.clientWidth - otherWidth - 10 // 10为余量
```
这里拿到 Special 列的允许宽度后,将其与 Special 列中内容的 **具名总宽** 和 **去名总宽** 比较

```javascript
const hasNameItemsWidth = this.items.length * (iconWidth + nameWidth)
const noNameItemsWidth = this.items.length * iconWidth
```
将比较结果进行处理 (具名优先级比去名高, 所以先处理具名的情况)

```javascript
if (fitColsAllowWidth < hasNameItemsWidth) {
	// 如果不够全部item展示,接下来对列表进行压缩,显示限制
  this.limitLevel--
  this.tableColsSet = this.tableColsSet.filter(col => {
  	return col <= this.limitLevel
  })
} else {
	// 宽度足够表示满足要求,可以进行渲染了
}
```

至此,一次计算完成了,接下来需要递归一直进行计算.<br />完整的代码↓

```javascript
function initTable () {
	const tableWidth = 

}
  
  // 2020-05-15  全忘记了....
```


