
import axios from 'axios';
export const shareFun = () => {
    axios.get("https://m.client.10010.com/mobileService/api/5g/v1/1007.htm?url="+encodeURIComponent(window.location.href.split('#')[0])).then(res => {
        // console.log(res);
        let { noncestr, signature, timestamp } = res.data.data;
        wx.config({
            debug: false,
            appId: 'wx24603f132a6753ea',
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature, //朋友圈 
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        });
        wx.ready(function () {
            var data = {
                title: "", // 分享标题
                link: "",
                desc: "", // 分享描述
                imgUrl: "", // 分享图标-生产cdn
                trigger: function (res) {
                },
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            };
            //分享到朋友圈
            wx.onMenuShareTimeline(data);
            //分享给朋友
            wx.onMenuShareAppMessage(data);
            //分享到QQ
            wx.onMenuShareQQ(data);
            //分享到腾讯微博
            wx.onMenuShareWeibo(data);
            //分享到QQ空间
            wx.onMenuShareQZone(data);
        });
        wx.error(function (res) {
            console.log(res)
        });
    })
}
