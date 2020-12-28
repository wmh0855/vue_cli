//复制
const copy = {
    bind(el, { value }) {
      el.$value = value
      el.handler = () => {
        if (!el.$value) {
          // 值为空的时候，给出提示。可根据项目UI仔细设计
          console.log('无复制内容')
          return
        }
        // 动态创建 textarea 标签
        const textarea = document.createElement('textarea')
        // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
        textarea.readOnly = 'readonly'
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        // 将要 copy 的值赋给 textarea 标签的 value 属性
        textarea.value = el.$value
        // 将 textarea 插入到 body 中
        document.body.appendChild(textarea)
        // 选中值并复制
        textarea.select()
        const result = document.execCommand('Copy')
        if (result) {
          console.log('复制成功') // 可根据项目UI仔细设计
        }
        document.body.removeChild(textarea)
      }
      // 绑定点击事件，就是所谓的一键 copy 啦
      el.addEventListener('click', el.handler)
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
      el.$value = value
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {
      el.removeEventListener('click', el.handler)
    },
  }
//长按
  const longpress = {
    bind: function (el, binding, vNode) {
      if (typeof binding.value !== 'function') {
        throw 'callback must be a function'
      }
      // 定义变量
      let pressTimer = null
      // 创建计时器（ 2秒后执行函数 ）
      let start = (e) => {
        if (e.type === 'click' && e.button !== 0) {
          return
        }
        if (pressTimer === null) {
          pressTimer = setTimeout(() => {
            handler()
          }, 2000)
        }
      }
      // 取消计时器
      let cancel = (e) => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer)
          pressTimer = null
        }
      }
      // 运行函数
      const handler = (e) => {
        binding.value(e)
      }
      // 添加事件监听器
      el.addEventListener('mousedown', start)
      el.addEventListener('touchstart', start)
      // 取消计时器
      el.addEventListener('click', cancel)
      el.addEventListener('mouseout', cancel)
      el.addEventListener('touchend', cancel)
      el.addEventListener('touchcancel', cancel)
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
      el.$value = value
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {
      el.removeEventListener('click', el.handler)
    },
  }
  //防抖
  const debounce = {
    inserted: function (el, binding) {
      let timer
      el.addEventListener('keyup', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 1000)
      })
    },
  }
//过滤特殊字符
  let findEle = (parent, type) => {
    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
  }
  
  const trigger = (el, type) => {
    const e = document.createEvent('HTMLEvents')
    e.initEvent(type, true, true)
    el.dispatchEvent(e)
  }
  
  const emoji = {
    bind: function (el, binding, vnode) {
      // 正则规则可根据需求自定义
      var regRule = /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
      let $inp = findEle(el, 'input')
      el.$inp = $inp
      $inp.handle = function () {
        let val = $inp.value
        $inp.value = val.replace(regRule, '')
  
        trigger($inp, 'input')
      }
      $inp.addEventListener('keyup', $inp.handle)
    },
    unbind: function (el) {
      el.$inp.removeEventListener('keyup', el.$inp.handle)
    },
  }
  //图片懒加载
  const LazyLoad = {
    // install方法
    install(Vue, options) {
      const defaultSrc = options.default
      Vue.directive('lazy', {
        bind(el, binding) {
          LazyLoad.init(el, binding.value, defaultSrc)
        },
        inserted(el) {
          if (IntersectionObserver) {
            LazyLoad.observe(el)
          } else {
            LazyLoad.listenerScroll(el)
          }
        },
      })
    },
    // 初始化
    init(el, val, def) {
      el.setAttribute('data-src', val)
      el.setAttribute('src', def)
    },
    // 利用IntersectionObserver监听el
    observe(el) {
      var io = new IntersectionObserver((entries) => {
        const realSrc = el.dataset.src
        if (entries[0].isIntersecting) {
          if (realSrc) {
            el.src = realSrc
            el.removeAttribute('data-src')
          }
        }
      })
      io.observe(el)
    },
    // 监听scroll事件
    listenerScroll(el) {
      const handler = LazyLoad.throttle(LazyLoad.load, 300)
      LazyLoad.load(el)
      window.addEventListener('scroll', () => {
        handler(el)
      })
    },
    // 加载真实图片
    load(el) {
      const windowHeight = document.documentElement.clientHeight
      const elTop = el.getBoundingClientRect().top
      const elBtm = el.getBoundingClientRect().bottom
      const realSrc = el.dataset.src
      if (elTop - windowHeight < 0 && elBtm > 0) {
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    },
    // 节流
    throttle(fn, delay) {
      let timer
      let prevTime
      return function (...args) {
        const currTime = Date.now()
        const context = this
        if (!prevTime) prevTime = currTime
        clearTimeout(timer)
  
        if (currTime - prevTime > delay) {
          prevTime = currTime
          fn.apply(context, args)
          clearTimeout(timer)
          return
        }
  
        timer = setTimeout(function () {
          prevTime = Date.now()
          timer = null
          fn.apply(context, args)
        }, delay)
      }
    },
  }
//权限判断
  function checkArray(key) {
    let arr = ['1', '2', '3', '4']
    let index = arr.indexOf(key)
    if (index > -1) {
      return true // 有权限
    } else {
      return false // 无权限
    }
  }
  
  const permission = {
    inserted: function (el, binding) {
      let permission = binding.value // 获取到 v-permission的值
      if (permission) {
        let hasPermission = checkArray(permission)
        if (!hasPermission) {
          // 没有权限 移除Dom元素
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    },
  }
  //网页加水印
  function addWaterMarker(str, parentNode, font, textColor) {
    // 水印文字，父元素，字体，文字颜色
    var can = document.createElement('canvas')
    parentNode.appendChild(can)
    can.width = 200
    can.height = 150
    can.style.display = 'none'
    var cans = can.getContext('2d')
    cans.rotate((-20 * Math.PI) / 180)
    cans.font = font || '16px Microsoft JhengHei'
    cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 10, can.height / 2)
    parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
  }
  
  const waterMarker = {
    bind: function (el, binding) {
      addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
    },
  }
  //拖拽移动
  const draggable = {
    inserted: function (el) {
      el.style.cursor = 'move'
      el.onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          let x = e.pageX - disx
          let y = e.pageY - disy
          let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
          let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)
          if (x < 0) {
            x = 0
          } else if (x > maxX) {
            x = maxX
          }
  
          if (y < 0) {
            y = 0
          } else if (y > maxY) {
            y = maxY
          }
  
          el.style.left = x + 'px'
          el.style.top = y + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
      }
    },
  }
  export {copy,longpress,debounce,emoji,LazyLoad,permission,waterMarker,draggable} 