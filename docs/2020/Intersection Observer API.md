> 最近在做滚动/视口埋点/懒加载相关的需求, 了解到这个Intersection Observer API. 做做记录.
> 资料来自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)


`Intersection Observer API`  会注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时(或者 viewport )，或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行。这样，我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。

### 用法

1. 创建observer (配置回调函数)
```javascript
// options
let options = {
    root: document.querySelector('#scrollArea'), 
    rootMargin: '0px', 
    threshold: 1.0 // 阈值. 1.0意味着目标元素完全出现在root选项指定的元素中可见时，回调函数将会被执行。
}
// 回调
let callback =(
  entries: IntersectionObserverEntry[], 
  observer: IntersectionObserver
) => { 
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  });
};
let observer = new IntersectionObserver(callback, options)
```

2. 为每个observer配置一个target
```javascript
let target = document.querySelector('#listItem');
observer.observe(target);
```
这样一个简单的例子完成了.
