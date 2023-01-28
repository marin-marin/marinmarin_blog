import{_ as s,o as a,c as n,a as p}from"./app.95bb5be5.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"2021/Input标签中文输入法预输入问题的处理.md"}'),o={name:"2021/Input标签中文输入法预输入问题的处理.md"},e=p(`<p>最近在做Input组件, 有需要做 <code>输入长度限制</code>的需求<br>通常, 我们可以直接设置 <code>maxlength</code> 属性达到要求,<br>但是如果要在 <code>input</code> 事件中来处理, 就会出现<br><img src="https://cdn.nlark.com/yuque/0/2021/gif/122315/1631692130056-8711c9b1-7384-406f-bbd1-339cfb016c1e.gif#clientId=u2df7b114-cc53-4&amp;from=ui&amp;id=r2TKH&amp;margin=%5Bobject%20Object%5D&amp;name=15.gif&amp;originHeight=281&amp;originWidth=565&amp;originalType=binary&amp;ratio=1&amp;size=58501&amp;status=done&amp;style=none&amp;taskId=u6b17eda9-f2c3-410b-a3f4-d197596a3dc" alt="15.gif"><br>可以看到, 在输入文本的过程中, 会有拼音的预输入内容, 浏览器在检测内容变化的时候, 这个预输入的文本也是可以触发input事件的</p><p>此时如果要在 <code>input</code> 事件中处理输入长度限制的话, 会出现下图的情况</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> input </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">body</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">querySelector</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">#i</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">input</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">input</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">4</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">input</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">substr</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">4</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p><img src="https://cdn.nlark.com/yuque/0/2021/gif/122315/1631692617464-2aaaa832-baf8-4e44-8869-cf63ab259bbd.gif#clientId=u2df7b114-cc53-4&amp;from=ui&amp;id=u1492b775&amp;margin=%5Bobject%20Object%5D&amp;name=16.gif&amp;originHeight=38&amp;originWidth=188&amp;originalType=binary&amp;ratio=1&amp;size=48434&amp;status=done&amp;style=none&amp;taskId=uc2cf9018-3acd-4c57-b431-abde766886a" alt="16.gif"><br>预输入和输入完成后的文本在input事件中冲突, 导致最终输入的结果不符合我们长度限制的要求, 甚至会变更之前输入的内容.</p><p>那么 <code>input</code> 事件我们就不能用了. 这个时候, 需要结合 <code>compositionstart</code>, <code>compositionend</code> (<code>compositionupdate</code>)了.<br>具体api的介绍参考 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event" target="_blank" rel="noreferrer">MDN-compositionstart_event</a><br><img src="https://cdn.nlark.com/yuque/0/2021/gif/122315/1639965864299-a5cde76f-b73f-49d3-be67-78ed2a6a8db4.gif#clientId=ufd592ba6-784b-4&amp;from=ui&amp;id=ufbd851bd&amp;margin=%5Bobject%20Object%5D&amp;name=20.gif&amp;originHeight=285&amp;originWidth=584&amp;originalType=binary&amp;ratio=1&amp;size=35059&amp;status=done&amp;style=none&amp;taskId=u5260573a-7352-4c6b-84cf-1843a0ef46a" alt="20.gif"><br>这个时候我们只需要去用<code>compositionend</code>监听到的值就行啦.</p>`,5),t=[e];function l(c,r,i,y,d,D){return a(),n("div",null,t)}const C=s(o,[["render",l]]);export{F as __pageData,C as default};
