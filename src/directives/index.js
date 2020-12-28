import { copy, longpress, debounce, emoji, LazyLoad, permission, waterMarker, draggable } from './util'

// 自定义指令
const directives = {
    copy, longpress, debounce, emoji, LazyLoad, permission, waterMarker, draggable
}

export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key])
        })
    },
}