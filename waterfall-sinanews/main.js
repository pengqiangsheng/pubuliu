var isFirst = true,
    $target = $('#load'),
    isDataArrive = true,
    perPageCount = 10,
    curPage = 1,
    colHeight = []

start()

$(window).on('scroll',function(){
  if(!isDataArrive){
    return
  }
  if(isVisible($target)){  //判断 'id = load' 是否进入视野
    start()
  }
})


// 懒加载
function isVisible($el){
  var scrollH = $(window).scrollTop(),
      winH = $(window).height(),
      top = $el.offset().top

    if(top < winH + scrollH){  //判断元素是否进入视野
      return true
    }else{
      return false
    }
}


// 主流程函数
function start(){
  getData(function(newList){    // 执行 getData 使用 ajax 获取数据
    console.log("newList" + newList)
    isDataArrive = true
    $.each(newList,function(index,news){
      var $node = getNode(news)   // 拿到的数据进行 DOM 拼接
      $node.find('img').on('load',function(){
        $('.picture').append($node)
        console.log($node,'loaded...')
        waterFall($node)   // 进行瀑布流布局
      })
    })
  })
  isDataArrive = false   // 即获取并添加之后，修改数据状态
}

//当窗口大小重置之后，重新执行
$(window).on('resize',function(){
  start()
})

// ajax 获取数据
function getData(callback){
  $.ajax({
    type: "GET",
    dataType: "json",
    url:"static/img.json"
  }).done(function(ret){
    console.log('ret:' + ret.data)
    //if(ret && ret.status && ret.status.code === "0"){
      callback(ret.data)  //如果数据没问题，那么生成节点并摆放好位置
      curPage++
    //}else{
    //  console.log('get error data')
    //}
  })
}


// DOM 拼接
function getNode(item){
  var tpl = ''
		tpl += '<li class="item">';
		tpl += ' <img src="' + item.url + '" alt="">';
		tpl += ' <h4 class="title">'+ item.short_name +'</h4>';
		tpl += '<p class="info">'+item.short_intro+'</p>';
		tpl += '</li>';
	return $(tpl)
}

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
  // console.log(Math.max.apply(null,colHeight))
  // console.log($('.picture'))
  $('.picture').height(Math.max.apply(null,colHeight))
}
