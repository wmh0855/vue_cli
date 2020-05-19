const path = require("path");
const os = require("os");
const webpack = require("webpack");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin"); //把分包文件添加道Html模板中
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin"); //缓存 提升二次打包速度
const env = process.env.NODE_ENV;
const pluginFun = env => {
	let plugin = [
		new HappyPack({
			id: "happyBabel",
			//如何处理  用法和loader 的配置一样
			loaders: [
				{
					loader: "babel-loader?cacheDirectory=true",
				},
			],
			//共享进程池
			threadPool: happyThreadPool,
			//允许 HappyPack 输出日志
			verbose: true,
		}),
		new AddAssetHtmlPlugin({
			// dll文件位置
			filepath: path.resolve(__dirname, "./build/library/*.js"),
			// dll 引用路径
			publicPath: "./library",
			// dll最终输出的目录
			outputPath: "./library",
		}),
	];
	if (env === "production") {
		let dll = new webpack.DllReferencePlugin({
			context: process.cwd(),
			manifest: require("./build/library/library-manifest.json"),
		});
		plugin.push(dll);
	}
	return plugin;
};

module.exports = {
	publicPath: env === "production" ? "./" : "/",
	productionSourceMap: true,
	outputDir: "dist",
	lintOnSave: "error",
	devServer: {
		host: "localhost", //要设置当前访问的ip 否则失效
		port: 8080,
		open: true, //浏览器自动打开页面,
		proxy: {
			"/api-proxy": {
				target: "http://ecstest2018.10010.com",
				ws: true,
				changeOrigin: true,
				cookieDomainRewrite: {
					"*": "",
				},
				cookiePathRewrite: {
					"*": "",
				},
				pathRewrite: {
					"^/api-proxy": "",
				},
				bypass: function(req) {
					// req.headers.referer = "m.client.10010.com";
					// req.headers.host = "m.client.10010.com";
					req.headers.referer = "ecstest2018.10010.com";
					req.headers.host = "ecstest2018.10010.com";
				},
			},
		},
	},
	chainWebpack: config => {
		config.plugins.delete("prefetch");
		const jsRule = config.module.rule("js");
		jsRule.uses.clear();
		jsRule.use("happypack/loader?id=happyBabel").loader("happypack/loader?id=happyBabel");
	},
	configureWebpack: {
		plugins: pluginFun(env),
	},
};
