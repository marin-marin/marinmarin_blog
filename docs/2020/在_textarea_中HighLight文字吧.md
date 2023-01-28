最近在做公司的一个活动页的时候有一个校验的交互, 在后端验证后需要在前端提交的textarea中高亮没有通过的文字. 于是在自己有方案的情况下再查了查(google)资(stack)料(overflow), 其他的实现方式还是挺有意思的.


## 原生的解决方案


#### 1.使用HTML5的特性 contenteditable
H5的 `contenteditable` 属性可以使一个dom元素变为可编辑的元素, 那么我们就可以直接将 `div` 来作为 `textarea` 的替代, 在里面用内嵌 `span` 来实现部分文字的高亮.
```html
<body>
  <div contenteditable id="#edit">
  	This demo shows how to highlight bits of text within a textarea. Alright, that's a lie. You can't actually render markup inside a textarea. However, you can fake it by carefully positioning a div behind the textarea and adding your highlight markup there. JavaScript takes care of syncing the content and scroll position from the textarea to the div, so everything lines up nicely. Hit the toggle button to peek behind the curtain. And feel free to edit this text. All capitalized words will be highlighted.
  </div>
  <script>
    let div = document.getElementById('edit')
    requestCallback = (texts) => {
      texts.forEach(t => {
      	div.innerHTML.replace(t, `<span class="text-red">${t}</span>`) // 按class替换颜色或者直接使用style进行替换
      })
    }
  </script>
</body>
```
那么这里肯定就有要问了, 如果我们要进行重新submit了, 里面含有 `<span>` 标签这些不必要的内容该怎么办啊?<br />直接拿div的 `innerText` 就OK了.  其实 `textContent` 也可以. 具体根据情况选择
```typescript
type doSubmit = (text: string) => void

let div = document.getElementById('edit')
doSubmit(div.innerText)
doSubmit(div.textContent)

```
> MDN里面对于 `textContent` 和 `innerText` 的区别解释如下
> ![image.png](https://cdn.nlark.com/yuque/0/2020/png/122315/1598854666798-c0205d5c-c71c-4ec0-a279-15d686e75aa9.png#align=left&display=inline&height=392&margin=%5Bobject%20Object%5D&name=image.png&originHeight=392&originWidth=694&size=51331&status=done&style=none&width=694)
> --[MDN](https://wiki.developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent#%E4%B8%8E_innerText_%E7%9A%84%E5%8C%BA%E5%88%AB)


#### 2.套娃的方式曲线救国
在Codepen上看到了一个实现方式, 就是放置一个蒙版, 把要高亮的文字位置高亮, 然后叠放在textarea下方.<br />![highlightInTextarea.gif](https://cdn.nlark.com/yuque/0/2020/gif/122315/1598856151913-1c3fa056-fa3d-4a63-af03-8eb22707e89a.gif#align=left&display=inline&height=323&margin=%5Bobject%20Object%5D&name=highlightInTextarea.gif&originHeight=323&originWidth=719&size=391523&status=done&style=stroke&width=719)
> 动图出处: [CodePen](https://codepen.io/lonekorean/pen/gaLEMR)

此方法的蒙版有两种实现

   1. 蒙版内容和textarea的内容 `实现同步` , 设置 `color: transpant` , 再将需要高亮的文字replace成上面带class或style的标签, 设置他的背景颜色.
   2. 蒙版没内容, 但是根据需要高亮的文字的位置, 添加等量的标签, 并用绝对定位来进行定位.

从实现难度和准确性上来说, 肯定是选择 `第一种方案` . 对于不同的语言, 不同的字体, 计算定位繁琐, 出现错位的可能性太大.
```html
<body>
  <div class="mark-wrap">
    	This demo shows how to highlight bits of text within a textarea. Alright, that's a lie. You can't actually render markup inside a textarea. However, you can fake it by carefully positioning a div behind the textarea and adding your highlight markup there. JavaScript takes care of syncing the content and scroll position from the textarea to the div, so everything lines up nicely. Hit the toggle button to peek behind the curtain. And feel free to edit this text. All capitalized words will be highlighted.
  </div>
  <textarea>
    	This demo shows how to highlight bits of text within a textarea. Alright, that's a lie. You can't actually render markup inside a textarea. However, you can fake it by carefully positioning a div behind the textarea and adding your highlight markup there. JavaScript takes care of syncing the content and scroll position from the textarea to the div, so everything lines up nicely. Hit the toggle button to peek behind the curtain. And feel free to edit this text. All capitalized words will be highlighted.
  </textarea>
</body>
```
```javascript
requestCallback = (texts) => {
	texts.forEach(t => {
  	div.innerHTML = div.innerHTML.replace(t, `<span class="mark">${t}</span>`)
  })
}
// 这里有需要注意的地方, 一个是业务上面是否需要注意大小写的, 如果是不区分大小写, 那么replace函数需要改进一下
// 需要原样返回, 否则可能直接把大写字母修正成小写字母. 造成 1.字体不同出现位置偏差 2. 内容错误
div.innerHTML = div.innerHTML.relace(t, $0 => `<span class="mark">${$0}</span>`)
```
这样, 提交的时候也就不需要 `innerText` 或者 `textContent` 了. 并且也能使用原生 `textarea` 的特性, 比较前一种方法来说, 仅仅多了一些css的操作.

#### 3. 使用setSelectionRange
`Selection` 是指用户用鼠标或者其他设备在文本中选择高亮的一段文字的对象.<br />那么即是说, `Selection` 只能有一段选择的文本, 和我们的需求不太适配. 但是我们也可以稍微降低一点需求要求, 总是高亮选中校验结果的第一个文本. 这样处理的问题即是, 无法同一时间展示出所有的结果, 每次只能更改一处内容.
```javascript
// idx: innerText.indexOf(t)
textarea.setSelectionRange(idx, idx + t.length)
textarea.focus()
```

## 插件
这种需求肯定在远古时期都有了, 所以第三方插件肯定也是数不胜数的.<br />推荐的比较多的是 `jQuery`  的 [jquery-highlighttextarea](http://garysieling.github.io/jquery-highlighttextarea/index.html)

#### [jquery-highlighttextarea](http://garysieling.github.io/jquery-highlighttextarea/index.html)
这个插件的原理也是蒙版, 在 `textarea` 下方放置了一个 `div` 

以上.

