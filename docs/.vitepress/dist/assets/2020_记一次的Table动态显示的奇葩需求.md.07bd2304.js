import{_ as s,o as a,c as n,a as l}from"./app.95bb5be5.js";const A=JSON.parse('{"title":"记一次的Table动态显示的奇葩需求","description":"","frontmatter":{},"headers":[{"level":3,"title":"需求描述","slug":"需求描述","link":"#需求描述","children":[]},{"level":3,"title":"实现","slug":"实现","link":"#实现","children":[]}],"relativePath":"2020/记一次的Table动态显示的奇葩需求.md"}'),p={name:"2020/记一次的Table动态显示的奇葩需求.md"},o=l(`<h1 id="记一次的table动态显示的奇葩需求" tabindex="-1">记一次的Table动态显示的奇葩需求 <a class="header-anchor" href="#记一次的table动态显示的奇葩需求" aria-hidden="true">#</a></h1><blockquote><p>前序. 在需求不明确的时候千万不要直接拿着就开始码代码,很容易掉进逻辑坑里完全出不来了.</p></blockquote><h3 id="需求描述" tabindex="-1">需求描述 <a class="header-anchor" href="#需求描述" aria-hidden="true">#</a></h3><ul><li>界面内有一表格显示(使用的ElementUI框架),要求动态显示表格列.(如:有姓名,电话,住址列,根据情况隐藏住址列)</li><li>表格列要进行显示优先级分层,根据用户视窗的分辨率来限制显示优先级.优先级高的列优先显示,以外的列隐藏</li></ul><p><img src="https://cdn.nlark.com/yuque/0/2019/png/122315/1552617695116-5ef2854f-ac99-40db-bab3-1a0e49c4d76d.png#align=left&amp;display=inline&amp;height=175&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=175&amp;originWidth=641&amp;size=41978&amp;status=done&amp;style=none&amp;width=641" alt="image.png"></p><blockquote><p>(表格分布)</p></blockquote><ul><li>列中有一特殊列需要根据列的内容进行宽度适应.其中的内容有(图标+名字)和(只有图标)两种情况</li></ul><p><img src="https://cdn.nlark.com/yuque/0/2019/png/122315/1552619013704-e9ca296d-8624-4de7-86cb-cf27889b469c.png#align=left&amp;display=inline&amp;height=245&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=245&amp;originWidth=906&amp;size=8708&amp;status=done&amp;style=none&amp;width=906" alt="image.png"></p><h3 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-hidden="true">#</a></h3><blockquote><p>背景: vue2.x + element-ui2.2 + vuex</p></blockquote><blockquote><p>这次的需求说实在的,我没有做过.但是一拿到手就马不停蹄地开始做,不事先想好确实是失误,耽误了大部分时间.</p></blockquote><ol><li>首先实现动态列表.</li></ol><p>①确定一个列表数据数组</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 列表数组</span></span>
<span class="line"><span style="color:#A6ACCD;">vm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">tableColsSet </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 用于在渲染table时如果有自定内容来区分列</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">label</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">列名</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">width</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 这里宽度和最小宽度有互斥的关系</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">minWidth</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">100</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">prop</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">data</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 用于直接显示取得数据中的数据key</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">align</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">center</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 对齐方式</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">level</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 这里level用于表示该列的显示优先级, 值越小优先级越高</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 等等其他的config项</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 组件data中定义变量来限制显示优先级</span></span>
<span class="line"><span style="color:#A6ACCD;">vm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">limitLevel </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span></span>
<span class="line"></span></code></pre></div><p>②监听 <strong>window.onresize</strong> 事件,在该事件中进行对上述数组的增减处理</p><blockquote><p>目前一切工作都是在渲染前做的</p></blockquote><hr><p><strong>错误方向</strong>(直接开始走偏了)<br>**~~a) ~~**为 <strong>limitLevel</strong> 添加 <strong>watcher.</strong></p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#82AAFF;">limitLevel</span><span style="color:#A6ACCD;"> (lv) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">	</span><span style="color:#676E95;font-style:italic;">// 此处动态处理tableColsSet</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">tableColsSet</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">tableColsSet</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">filter</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;font-style:italic;">col</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">col</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">level</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">lv</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>然后,我就懵DIO了.<br>我在第N列有一个Special列,那个列需要根据里面的内容来决定宽度.<br>在宽度足够的时候,能显示Special列里的全部内容;<br>在宽度不足的时候,只显示Special列中的部分内容;<br><strong>BUT</strong><br>如果Special列中内容简化后,宽度又够了,又可以显示出隐藏的列,或者拓宽Special列的内容;<br>同样,如果拓宽后,宽度不够,又进行隐藏....<br>...<br>已经被绕昏了.只有重头再想想.<br>另外, 这里所用的 watcher 会让更改实时渲染都页面,造成页面性能下降,数据过多的时候还可能造成页面卡顿,这是很影响用户体验的一点.</p><hr><p><strong>正常的方向</strong><br>应该是在每次resize时,将列表中的列分为两类:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> otherWidth </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">200</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// table以外同页面下占据宽度的其他元素的总宽</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 固定列宽度</span></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> fixedColsTotalWidth </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">tableColsSet</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">forEach</span><span style="color:#A6ACCD;">(</span><span style="color:#A6ACCD;font-style:italic;">col</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">col</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">width</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">fixedColsTotalWidth</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">col</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">width</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 表格总宽</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> tableWidth </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">body</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">clientWidth </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> otherWidth </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 10为余量</span></span>
<span class="line"></span></code></pre></div><p>这里拿到 Special 列的允许宽度后,将其与 Special 列中内容的 <strong>具名总宽</strong> 和 <strong>去名总宽</strong> 比较</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> hasNameItemsWidth </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">items</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> (iconWidth </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> nameWidth)</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> noNameItemsWidth </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">items</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> iconWidth</span></span>
<span class="line"></span></code></pre></div><p>将比较结果进行处理 (具名优先级比去名高, 所以先处理具名的情况)</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> (fitColsAllowWidth </span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;"> hasNameItemsWidth) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">	</span><span style="color:#676E95;font-style:italic;">// 如果不够全部item展示,接下来对列表进行压缩,显示限制</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">limitLevel</span><span style="color:#89DDFF;">--</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">tableColsSet</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">tableColsSet</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">filter</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;font-style:italic;">col</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  	</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">col</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">limitLevel</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">	</span><span style="color:#676E95;font-style:italic;">// 宽度足够表示满足要求,可以进行渲染了</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>至此,一次计算完成了,接下来需要递归一直进行计算.<br>完整的代码↓</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">initTable</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">tableWidth</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 2020-05-15  全忘记了....</span></span>
<span class="line"></span></code></pre></div>`,29),e=[o];function t(c,r,y,i,D,F){return a(),n("div",null,e)}const d=s(p,[["render",t]]);export{A as __pageData,d as default};
