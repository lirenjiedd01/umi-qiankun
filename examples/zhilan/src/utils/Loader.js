// 支持单个文件和多个文件加载，支持img css js文件加载，多个相同的文件只加载一次
// Load(path, cb, type)
// Load([path...], cb, type)

let loadedPath = {}

let getSourceType = (path) => {
  if (/\.css$/.test(path)) {
    return 'css'
  } else if (/\.js$/.test(path)) {
    return 'js'
  } else if (/\.jpg|\.png|\.gif$/.test(path)) {
    return 'img'
  }
}

let createNode = (sourceType) => {
  // 创建节点
  let node
  // css文件
  if (sourceType === 'css') {
    node = document.createElement('link')
    node.setAttribute('rel', 'stylesheet')
    node.setAttribute('type', 'text/css')
    // js文件
  } else if (sourceType === 'js') {
    node = document.createElement('script')
    node.setAttribute('type', 'text/javascript')
  } else if (sourceType === 'img') {
    // 图片
    node = document.createElement('img')
  }

  return node
}

let appendNode = (node) => {
  node.tagName.toLowerCase() !== 'img' && document.getElementsByTagName('head')[0].appendChild(node)
}

let load = function (sourceList, index, cb) {
  if (index >= sourceList.length) {
    typeof cb === 'function' && cb() // 在首次时index==list.length成立，但此时node是未定义的
    return
  }

  const source = sourceList[index]

  if (loadedPath[source.path]) {
    index++
    load(sourceList, index, cb)
    return
  }

  // 所有文件统一加载后才回调
  // ie8只支持onreadystatechange但不支持onload
  // 其它浏览器只支持onload
  // ie10即支持onreadystatechange也支持onload，但是使用onreadystatechange即有问题，所以ie10下要判断优先使用onload
  let node = createNode(source.type)
  if ('onload' in node) { // 用node.hasOwnProperty('onload')判断不行，用in
    node.onload = function () {
      index++
      node.onload = null
      loadedPath[source.path] = true
      load(sourceList, index, cb)
    }
  } else {
    node.onreadystatechange = function () { // 兼容ie8
      var state = this.readyState
      if (state === 'loaded') { // complate并未完全载入，故不能用
        index++
        this.onreadystatechange = null
        loadedPath[source.path] = true
        load(sourceList, index, cb)
      }
    }
  }
  if (node.tagName.toLowerCase() === 'link') {
    node.href = source.path
  } else {
    node.src = source.path
  }

  appendNode(node)
}

export default (sourceList, cb, sourceType) => {
  let list = []

  if (typeof sourceList === 'string') {
    sourceList = [sourceList]
  }

  for (let i = 0; i < sourceList.length; i++) {
    list.push({
      type: sourceType || getSourceType(sourceList[i]) || 'js',
      path: sourceList[i]
    })
  }
  sourceList = list
  load(sourceList, 0, cb)
}
