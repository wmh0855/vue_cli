import Vue from "vue";
import _ from "lodash";

const UnicomJSBrige = {
	/**
	 * 入口函数，在使用Vue.use注册时自动调用
	 */
	install: function() {
		Vue.prototype.$UnicomJSBrige = this;
	},
	/**
	 * 判断是否在联通手厅客户端内部
	 */
	isInApp: function() {
		if (navigator.userAgent.indexOf("unicom") > -1) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 判断是否是iOS手机
	 */
	isIOS: function() {
		let u = navigator.userAgent;
		let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		return isIOS;
	},
	/**
	 * 判断是否在联通手厅客户端内部
	 */
	isAndroid: function() {
		let u = navigator.userAgent;
		let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
		return isAndroid;
	},
	/**
	 * 获取客户端设备信息
	 * @param {Function} callback
	 */
	getClientInfo: function(callback) {
		if (UnicomJSBrige.isInApp()) {
			window.setClientInfo = function(info) {
				//console.log("getClientInfo-客户端返回信息：" + info);
				if (typeof callback === "function") {
					var infoOBJ = JSON.parse(info);
					var currentPhoneNumber = infoOBJ["currentPhoneNumber"];
					if (_.isNil(currentPhoneNumber)) {
						infoOBJ["currentPhoneNumber"] = "";
					} else if ("0" === currentPhoneNumber) {
						infoOBJ["currentPhoneNumber"] = "";
					} else {
						infoOBJ["currentPhoneNumber"] = _.trim(currentPhoneNumber);
					}
					callback(infoOBJ);
				}
			};

			if (UnicomJSBrige.isIOS()) {
				var config = {
					type: "getClientInfo",
				};
				window.location = encodeURI("clientAction=" + JSON.stringify(config));
			} else if (UnicomJSBrige.isAndroid()) {
				window.setClientInfo(window.js_invoke.getClientInfoByJS());
			}
		} else {
			console.log("当前不在联通手厅客户端内部,无法调用getClientInfo");
		}
	},
	/**
	 * 获取当前登录的手机号码，如果没有登录返回空字符串，如果登录了返回实际的电话号码
	 * @param {Funtion} callback
	 */
	getCurrentPhone: function(callback) {
		UnicomJSBrige.getClientInfo(function(info) {
			callback(info["currentPhoneNumber"]);
		});
	},
	/**
	 * 拉登录
	 * @param {Boolean} retainWebview 登录返回是否保留webview
	 */
	loginByClient: function(url) {
		if (this.isInApp()) {
			let config = {
				type: "login",
				msg: "",
				url: url,
			};
			if (this.isIOS()) {
				window.location = encodeURI("clientAction=" + JSON.stringify(config));
			} else if (this.isAndroid()) {
				window.js_invoke.interact(JSON.stringify(config));
			}
		}
	},
	closeWeb: function(retainWebview) {
		if (this.isInApp()) {
			let config = {
				type: "close",
			};
			if (this.isIOS()) {
				window.location = encodeURI("clientAction=" + JSON.stringify(config));
			} else if (this.isAndroid()) {
				window.js_invoke.interact(JSON.stringify(config));
			}
		}
	},
	/**
	 * 设置客户端标题栏标题
	 * @param {String} title
	 */
	setTitle: function(title) {
		if (this.isInApp()) {
			if (this.isIOS()) {
				let titleConfig = {
					type: "handJSTitle",
					msg: title,
				};
				window.location = encodeURI("clientAction=" + JSON.stringify(titleConfig));
			} else if (this.isAndroid()) {
				window.js_invoke.handleJSTitle(title);
			}
		}
		document.title = title;
		if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
			const hackIframe = document.createElement("iframe");
			hackIframe.style.display = "none";
			// hackIframe.src ="/static[表情]ml/fixIosTitle.html?r=" + Math.random();
			document.body.appendChild(hackIframe);
			setTimeout(_ => {
				document.body.removeChild(hackIframe);
			}, 300);
		}
	},
	/**
       * 注册客户端右上角更多菜单
       * {
       *  shareTitle: '标题',
          shareContent: '正文',
          shareURL: '',
          shareIconURL: ''
          shareQrcodeURL:'二维码URL地址'
       * }
       * 分享前缀：var prefixURL = "https://wap.10010.com/t/clickCountLogRecord/pageClickCount.htm?flag=new&actCode=40288&title=" + encodeURI("title") + "&actName=" + encodeURI("title") + "&application=113000010&openUrl=";
       * @param {Object} shareConfig 分享菜单配置
       */
	registerMoreMenu: function(shareConfig, callback) {
		window.getMenuConfig_Local = function() {
			if (callback) {
				callback();
			}
			//普通分享
			let shareJson1 = {
				shareType: "url",
				shareTitle: shareConfig["shareTitle"],
				shareContent: shareConfig["shareContent"],
				shareURL: shareConfig["shareURL"],
				shareIconURL: shareConfig["shareIconURL"],
			};
			//截图分享
			var shareJson2 = {
				shareType: "longScreenshot",
				shareQrcodeURL: shareConfig["shareQrcodeURL"],
				shareTitle: shareConfig["shareTitle"],
				shareContent: shareConfig["shareContent"],
				shareURL: shareConfig["shareURL"],
				shareIconURL: shareConfig["shareIconURL"],
			};
			//菜单配置
			var menuConfig = {
				config: [
					{
						code: "fenxiang",
						title: "分享",
						shareList: "wechat,wechatmoments,qq,qzone,sinaweibo,email,shortmessage,jietufenxiang",
						shareJson: shareJson1,
					},
					// {
					//     code: "jietufenxiang",
					//     title: "截图分享",
					//     shareList: "wechat,wechatmoments,qq,qzone",
					//     shareJson: shareJson2
					// },
					{ code: "tucao", title: "吐槽", desc: "吐槽" },
					{ code: "shouye", title: "首页", desc: "回到首页" },
				],
			};
			console.log("客户端右上角三个点配置信息：" + JSON.stringify(menuConfig));
			return JSON.stringify(menuConfig);
		};
	},
	registerMoreMenu1: function(shareConfig, callback) {
		window.getMenuConfig_Local = function() {
		  if (callback) {
			callback();
		  }
		  //普通分享
		  let shareJson1 = {
			shareType: "url",
			shareTitle: shareConfig["shareTitle"],
			shareContent: shareConfig["shareContent"],
			shareURL: shareConfig["shareURL"],
			shareIconURL: shareConfig["shareIconURL"]
		  };
		  //截图分享
		  var shareJson2 = {
			shareType: "longScreenshot",
			shareQrcodeURL: shareConfig["shareQrcodeURL"],
			shareTitle: shareConfig["shareTitle"],
			shareContent: shareConfig["shareContent"],
			shareURL: shareConfig["shareURL"],
			shareIconURL: shareConfig["shareIconURL"]
		  };
		  //菜单配置
		  var menuConfig = {
			config: [
			  {
				code: "fenxiang",
				title: "分享",
				shareList:
				  "wechat,wechatmoments,qq,qzone,sinaweibo,email,shortmessage,jietufenxiang",
				shareJson: shareJson1
			  },
			  {
			      code: "jietufenxiang",
			      title: "截图分享",
			      shareList: "wechat,wechatmoments,qq,qzone",
			      shareJson: shareJson2
			  },
			  { code: "tucao", title: "吐槽", desc: "吐槽" },
			  { code: "shouye", title: "首页", desc: "回到首页" }
			]
		  };
		  console.log("客户端右上角三个点配置信息：" + JSON.stringify(menuConfig));
		  return JSON.stringify(menuConfig);
		};
	  },
	/**
	 * 拨打电话，如果phoneNumber是加密过的，isEncry要传true
	 * @param {String} phoneNumber
	 * @param {Boolean} isEncry
	 */
	tel: function(phoneNumber, isEncry) {
		if (isEncry) {
			if (this.isInApp()) {
				//电话号码是加密过的
				let telConfig = {
					type: "teljiami",
					msg: {
						epLinkTelphone: phoneNumber, //加密手机号
					},
				};
				if (this.isIOS()) {
					window.location = encodeURI("clientAction=" + JSON.stringify(telConfig));
				} else if (this.isAndroid()) {
					window.js_invoke.interact(JSON.stringify(telConfig));
				}
			}
		} else {
			//TODO
		}
	},
	/**
       * 通过地图进行导航
       * {
          epWeidu: '目的地维度', 
          epJingdu: '目的地经度', 
          epName: '目的地名称',
          epCityname: '目的地城市', 
          epAddress: '目的地地址'
          }
       * @param {Object} config 
       */
	navByMap: function(config) {
		if (this.isInApp()) {
			let navConfig = {
				type: "navigation",
				msg: {
					epWeidu: config["epWeidu"], //目的地维度
					epJingdu: config["epJingdu"], //目的地经度
					epName: config["epName"], //目的地名称
					epCityname: config["epCityname"], //目的地城市
					epAddress: config["epAddress"], //目的地地址
				},
			};
			if (this.isIOS()) {
				window.location = encodeURI("clientAction=" + JSON.stringify(navConfig));
			} else if (this.isAndroid()) {
				window.js_invoke.interact(JSON.stringify(navConfig));
			}
		}
	},
	/**
	 * 打开客户端原生键盘输入框
	 * inputCallback = function(content,image){
	 *      content是输入框内容
	 *      image是base64编码的图片数据
	 * }
	 * @param {Function} inputCallback 输入内容回调
	 * @param {Function} closeCallback 键盘收起回调(只有Android会回调，iOS不会回调)
	 */
	openKeyboard: function(inputCallback, closeCallback) {
		if (this.isInApp()) {
			let config = { type: "getSystemBoard" };
			if (this.isIOS()) {
				window.location = encodeURI("clientAction=" + JSON.stringify(config));
			} else if (this.isAndroid()) {
				window.js_invoke.interact(JSON.stringify(config));
			}

			//注册回调函数，接受输入的内容和键盘收起事件
			//当点击原生键盘发送按钮时通知H5.参数是要发送的文本、表情、图片信息
			window.systemBoardCallBack = function(info) {
				//console.log('原生键盘输入内容：'+info);
				if (typeof inputCallback === "function") {
					let infoObj = JSON.parse(info);
					// 当没有图片时，iOS返回的数据格式：{content:'文本',image:'(null)',size:'0'}
					// 当没有图片时，android返回的数据格式：{content:'文本'}
					let imageData = infoObj["image"];
					if (!_.isNil(imageData) && !_.isEmpty(imageData) && !(imageData === "(null)")) {
						imageData = "data:image/jpeg;base64," + imageData;
					} else {
						imageData = "";
					}
					inputCallback(infoObj["content"], imageData);
				}
			};

			//当键盘隐藏的时候由原生通知H5，只有android会回调
			window.hideBoardCallBack = function() {
				if (typeof closeCallback === "function") {
					closeCallback();
				}
			};
		}
	},
	/**
	 * 直接打开分享菜单
	 * @param {String} shareTitle
	 * @param {String} shareContent
	 * @param {String} shareURL
	 * @param {String} shareIconURL
	 */
	share(shareTitle, shareContent, shareURL, shareIconURL, shareList) {
		// console.log('准备分享');
		var shareConfig = {
			type: "share2",
			url: "",
			shareList: shareList,
			msg: "",
			shareJson: {
				shareType: "url",
				shareTitle: shareTitle,
				shareContent: shareContent,
				shareURL: shareURL,
				shareIconURL: shareIconURL,
			},
		};
		if (this.isIOS()) {
			window.location = encodeURI("clientAction=" + JSON.stringify(shareConfig));
		} else if (this.isAndroid()) {
			window.js_invoke.interact(JSON.stringify(shareConfig));
		}
	},
	/**
	 * 开发模式
	 * @param {String} localhost 本机IP地址
	 */
	dev(localhost) {
		this.getClientInfo(function(infoObj) {
			//处理cookie信息，将登录之后的cookie信息存储到document中并将domain改为本地ip地址-----------------------
			var cookiesArr = infoObj.cookies;
			//console.log("从客户端内读取登录相关cookie信息：" + JSON.stringify(cookiesArr));
			if (Array.isArray(cookiesArr) && cookiesArr.length > 0) {
				for (var i = 0; i < cookiesArr.length; i++) {
					var cookieOBJ = cookiesArr[i];
					if (UnicomJSBrige.isAndroid()) {
						document.cookie = cookieOBJ.name + "=" + cookieOBJ.value + ";domain=" + localhost;
					} else if (UnicomJSBrige.isIOS()) {
						document.cookie = cookieOBJ.Name + "=" + cookieOBJ.Value + ";domain=" + localhost;
					}
				}
			}
			//---------------------------------------------------------------------------------------------------
		});
	},
};

export default UnicomJSBrige;
