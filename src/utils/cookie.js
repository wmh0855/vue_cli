export default class CookieManager {
    //JS操作cookies方法!
    //写cookies
    static setCookie = function (name, value, second) {
        let cookie = name + "=" + escape(value) + ";";
        if (second) {
            var exp = new Date();
            exp.setTime(exp.getTime() + second * 1000);
            cookie = cookie + "expires=" + exp.toGMTString();
        }
        document.cookie = cookie;
    };
    //读取cookies
    static getCookie = function name (name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
        else return null;
    };
    //删除cookies
    static delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = CookieManager.getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    };
}
