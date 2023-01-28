最近在做Input组件, 有需要做 `输入长度限制`的需求<br />通常, 我们可以直接设置 `maxlength` 属性达到要求,<br />但是如果要在 `input` 事件中来处理, 就会出现<br />![15.gif](https://cdn.nlark.com/yuque/0/2021/gif/122315/1631692130056-8711c9b1-7384-406f-bbd1-339cfb016c1e.gif#clientId=u2df7b114-cc53-4&from=ui&id=r2TKH&margin=%5Bobject%20Object%5D&name=15.gif&originHeight=281&originWidth=565&originalType=binary&ratio=1&size=58501&status=done&style=none&taskId=u6b17eda9-f2c3-410b-a3f4-d197596a3dc)<br />可以看到, 在输入文本的过程中, 会有拼音的预输入内容, 浏览器在检测内容变化的时候, 这个预输入的文本也是可以触发input事件的

此时如果要在 `input` 事件中处理输入长度限制的话, 会出现下图的情况
```javascript
const input = document.body.querySelector('#i')

input.addEventListener('input', e => {
  if (e.target.value.length > 4) {
    input.value = e.target.value.substr(0, 4)
  }
})
```
![16.gif](https://cdn.nlark.com/yuque/0/2021/gif/122315/1631692617464-2aaaa832-baf8-4e44-8869-cf63ab259bbd.gif#clientId=u2df7b114-cc53-4&from=ui&id=u1492b775&margin=%5Bobject%20Object%5D&name=16.gif&originHeight=38&originWidth=188&originalType=binary&ratio=1&size=48434&status=done&style=none&taskId=uc2cf9018-3acd-4c57-b431-abde766886a)<br />预输入和输入完成后的文本在input事件中冲突, 导致最终输入的结果不符合我们长度限制的要求, 甚至会变更之前输入的内容.

那么 `input` 事件我们就不能用了.  这个时候, 需要结合 `compositionstart`, `compositionend` (`compositionupdate`)了.<br />具体api的介绍参考  [MDN-compositionstart_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event)<br />![20.gif](https://cdn.nlark.com/yuque/0/2021/gif/122315/1639965864299-a5cde76f-b73f-49d3-be67-78ed2a6a8db4.gif#clientId=ufd592ba6-784b-4&from=ui&id=ufbd851bd&margin=%5Bobject%20Object%5D&name=20.gif&originHeight=285&originWidth=584&originalType=binary&ratio=1&size=35059&status=done&style=none&taskId=u5260573a-7352-4c6b-84cf-1843a0ef46a)<br />这个时候我们只需要去用`compositionend`监听到的值就行啦.

