// loading.js
import LoadingComponent from "./Loading";

const Loading = {
    install(Vue) {
        const LoadingPlugin = Vue.extend(LoadingComponent); //创建一个Vue子类
        const initLoading = new LoadingPlugin({
            el: document.createElement("div")
        });
        document.body.appendChild(initLoading.$el);
        Vue.prototype.$ltLoading = function(config) {
            initLoading.isShow = config.isShow;
        };
    }
};
export default Loading;