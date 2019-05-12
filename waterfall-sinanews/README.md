# waterfall-sinanews 瀑布流布局 新闻站
瀑布流布局实现新浪新闻站

预览地址：https://evenyao.github.io/waterfall-sinanews/
## 相关
### 懒加载原理

```JavaScript
$node.offset().top <= $(window).height() + $(window).scrollTop()
```
[具体参考 lazyload README](https://github.com/evenyao/lazyload-demo)


### 瀑布流原理
- 设置图片宽度一致
- 根据浏览器宽度以及每列宽度计算出列表个数，列表默认0
- 当图片加载完成，所有图片依次放置在最小的列数下面
- 父容器高度取列表数组的最大值
```JavaScript
function waterFall($node){
  var nodeWidth = $('.item').outerWidth(true)
  if(isFirst){    // 首次调用的时候
    var colNum = parseInt($('.container').width()/$('.item').outerWidth(true))
    for(var i = 0; i < colNum ; i++){
      colHeight[i] = 0
    }
    isFirst = false
  }
  var index = 0,
      minSumHeight = colHeight[0]

  for(var i = 0; i < colHeight.length ; i++){
    if(colHeight[i] < minSumHeight){
      index = i
      minSumHeight = colHeight[i]
    }
  }

  $node.css({   //节点的位置
    left: nodeWidth * index,
    top: minSumHeight,
    opacity: 1
  })

  colHeight[index] = $node.outerHeight(true) + colHeight[index]
  $('.picture').height(Math.max.apply(null,colHeight))
}
```
[具体参考 waterfall README](https://github.com/evenyao/waterfall-demo)

### 总体逻辑
1. 执行主流程 `start()` ，通过 `ajax` 获取后端数据。并使用 `isDataArrive` 标记数据是否获取到。
2. 将拿到的数据进行 `DOM` 拼接，并执行瀑布流 `waterFall()`。
3. 检测窗口滚动的时候，如果数据已经是获取过的，则跳过；否则只要 `#load` 标记元素(已隐藏在 DOM节点 中)进入视野( 即 `懒加载特性` )，执行 `start()`。
4. 瀑布流 `waterFall()` 的最后必须添加容器父元素的高度为最高列高度，即瀑布流布局原理中的 `父容器高度取列表数组的最大值`。否则布局会塌陷。
```JavaScript
colHeight[index] = $node.outerHeight(true) + colHeight[index]
$('.picture').height(Math.max.apply(null,colHeight))
```
