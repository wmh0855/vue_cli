import toastComponent from "./toast.vue";

const Toast = {};
Toast.install = function (Vue) {
  const ToastConstructor = Vue.extend(toastComponent);

  const instance = new ToastConstructor();

  instance.$mount(
    document.createElement("div").setAttribute("id", "toastFlag")
  );
  document.body.appendChild(instance.$el);

  Vue.prototype.$ltToast = (text, duration = 3000) => {
    instance.text = text;
    instance.theToast = true;
    clearTimeout(window["toastTimer"]);
    window["toastTimer"] = setTimeout(() => {
      instance.theToast = false;
    }, duration);
  };
};

export default Toast;
