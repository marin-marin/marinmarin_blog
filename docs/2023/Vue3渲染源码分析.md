1. createApp 创建app实例
   1. 确定使用的 `renderer` , 来判断是不是走自定义渲染 or 构造 `renderer`
   2. 调用 `renderer` 的 `createApp` 方法
      1. 传入的 `component` 具备 `render/template` 和 `setup` 等配置内容
      2. 挂载 `app` 的 `mount` 方法
2. 执行 `app` 的 `mount` 方法
3. 创建基于根组件的 `vnode`
   1. `createVNode` 基于传入类型判断
      1. 传入为 **string** , `createVNode('div')` [ShapeFlags.ELEMENT]
      2. 传入为 **obj<Component>**, `createVNode(component)` [ShapeFlags.STATEFUL_COMPONENT]
   2. 标准化该vnode下的 `children` - `normalizeChildren` 
      1. 根据传入的 `children` 的 `type`, 进行标准化
4. 调用 `render`
   1. 执行 `patch` (old = null, new = vnode)
      1. 按 `type` 执行 `process` 方法
         1. 无 old vnode, 执行 `mount` 
            1. 创建实例 `createComponentInstance`
            2. 处理 `props` `slots` 
            3. 处理响应式
               1. ELEMENT / FUNCTIONAL 组件不处理响应式
               2. STATEFUL_COMPONENT 处理响应式
         2. 有 old vnode, 执行 `**update**`
      2. 