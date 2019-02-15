const path                = require("path");
const webpack             = require('webpack');
// 自动打包css
const ExtractTextPlugin   = require("extract-text-webpack-plugin");
// html loader
const HtmlWebpackPlugin   = require('html-webpack-plugin');
// 环境变量配置，dev / online
const WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
// uglifyjs-webpack-plugin (压缩js)
const UglifyJsPlugin      = require('uglifyjs-webpack-plugin');
// 图片压缩
var ImageminPlugin        = require('imagemin-webpack-plugin').default;
var imageminMozjpeg       = require('imagemin-mozjpeg');
// 获取html-webpack-plugin参数的方法
var getHtmlConfig         = function (name, title) {
    return {
        // 根文件
        template    : './src/view/'+name+'.html',
        // 输出文件
        filename    : 'view/'+name+'.html',
        // 是否开启注入
        inject      : true,
        // 标题
        title       : title,

        // 是否应用哈希
        hash        : true,
        minify: {
            removeComments: true,   // 去除注释,
            collapseWhitespace:true, // 去空格
            minifyCSS:true, //压缩css
        },
        // ico图标
        favicon     :'./favicon.ico',
        //注入入口模块中的对应名字模块和公共模块
        chunks      : [name,'common']
    };
};
// 生产环境配置文件
var onlineConfig    = {
    entry: {
        //定义需要注入的模块
        // 把index.js加入全局common里
        'common'            :[__dirname + '/src/page/common/index.js'],
        'index'             :[__dirname + '/src/page/index/index.js'],
        'list'              :[__dirname + '/src/page/list/index.js'],
        'detail'            :[__dirname + '/src/page/detail/index.js'],
        'user-login'        :[__dirname + '/src/page/user-login/index.js'],
        'user-pass-reset'   :[__dirname + '/src/page/user-pass-reset/index.js'],
        'user-pass-update'  :[__dirname + '/src/page/user-pass-update/index.js'],
        'result'            :[__dirname + '/src/page/result/index.js'],
        'user-register'     :[__dirname + '/src/page/user-register/index.js'],
        'user-center'       :[__dirname + '/src/page/user-center/index.js'],
        'user-center-update':[__dirname + '/src/page/user-center-update/index.js'],
        'cart'              :[__dirname + '/src/page/cart/index.js'],
        'order-confirm'     :[__dirname + '/src/page/order-confirm/index.js'],
        'order-list'        :[__dirname + '/src/page/order-list/index.js'],
        'order-detail'      :[__dirname + '/src/page/order-detail/index.js'],
        'payment'           :[__dirname + '/src/page/payment/index.js'],
        'pay-suc'           :[__dirname + '/src/page/pay-suc/index.js'],
        'about'             :[__dirname + '/src/page/about/index.js'],
        'test'              :[__dirname + '/src/page/test/index.js',]
    },
    output: {
        // path        :path.resolve(__dirname,'./dist/'),
        path        :__dirname+'/dist/',
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.qiongmaomall.top/fe_mmall/dist/',
        // publicPath  :'/dist/',
        // 关键的命名[name]
        filename    : 'js/[name].js',
    },
    resolve:{
        // 配置本地资源引用
      alias:{
          node_modules  : __dirname + '/node_modules',
          util          :__dirname + '/src/util',
          page          :__dirname + '/src/page',
          service       :__dirname + '/src/service',
          image         :__dirname + '/src/image',
          common        :__dirname + '/src/page/common',
      }
    },
    plugins: [
        // 独立通用模块(全局代码) js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 加入全局代码, 注意 全局代码的引用所有页面都要加,而且要放在其他引用前面
            name        : 'common',
            filename    : "js/base.js",
            // (给 chunk 一个不同的名字)
            // minChunks: Infinity,
            // (随着 entry chunk 越来越多，
            // 这个配置保证没其它的模  块会打包进 vendor chunk)
        }),
        // 把CSS单独打包到文件
        // new ExtractTextPlugin("css/[name].css"),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
        }),
        // uglifyjs-webpack-plugin压缩js
        new UglifyJsPlugin({
            parallel: 6
        }),
        // uglifyjs-webpack-plugin压缩js
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '60-85'
            },
            plugins: [
                imageminMozjpeg({
                    quality: 60,
                    progressive: true
                })
            ]
        }),
        // html模板的处理,将entry中的模块注入进来
        new HtmlWebpackPlugin(getHtmlConfig('index', '穷猫商城 - 你的壹号仓库')),
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '详情')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login','登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result','提示')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('test','测试页面')),
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
        new HtmlWebpackPlugin(getHtmlConfig('pay-suc','支付成功')),
        new HtmlWebpackPlugin(getHtmlConfig('about','关于Me'))
    ],
    module: {
        loaders: [
            // extract是层检测css的外壳, 自动注入工具, 但是需要页面JS用require引入
            {
                // test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader')
                test    :/\.css$/,
                use     : ExtractTextPlugin.extract({
                    fallback  : "style-loader",
                    use       : "css-loader"
                })
            },
            // css相关配置 压缩 雪碧图等
            {
                test    :/\.css$/,
                loader  : 'postcss-loader',
            },
            // 如果小于200放到css文件里, 大于200生成一个单独的文件, 单位为b 1kb = 1024, woff|svg|eot|ttf为字体文件
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader?limit=20*1024&name=resource/[name].[ext]',
                    }
                    ]
            },
            // 注意html-loader尽量不配置html文件, 不然会跟HtmlWebpackPlugin冲突, 导致ejs失效
            {
                test: /\.string$/,
                use:{
                    loader: 'html-loader'
                }
            }
        ]
    }
};
// 开发环境配置文件
var devConfig       = {
    entry: {
        //定义需要注入的模块
        // 把index.js加入全局common里
        'common'            :[__dirname + '/src/page/common/index.js'],
        'index'             :[__dirname + '/src/page/index/index.js'],
        'list'              :[__dirname + '/src/page/list/index.js'],
        'detail'            :[__dirname + '/src/page/detail/index.js'],
        'user-login'        :[__dirname + '/src/page/user-login/index.js'],
        'user-pass-reset'   :[__dirname + '/src/page/user-pass-reset/index.js'],
        'user-pass-update'  :[__dirname + '/src/page/user-pass-update/index.js'],
        'result'            :[__dirname + '/src/page/result/index.js'],
        'user-register'     :[__dirname + '/src/page/user-register/index.js'],
        'user-center'       :[__dirname + '/src/page/user-center/index.js'],
        'user-center-update':[__dirname + '/src/page/user-center-update/index.js'],
        'cart'              :[__dirname + '/src/page/cart/index.js'],
        'order-confirm'     :[__dirname + '/src/page/order-confirm/index.js'],
        'order-list'        :[__dirname + '/src/page/order-list/index.js'],
        'order-detail'      :[__dirname + '/src/page/order-detail/index.js'],
        'payment'           :[__dirname + '/src/page/payment/index.js'],
        'pay-suc'           :[__dirname + '/src/page/pay-suc/index.js'],
        'about'             :[__dirname + '/src/page/about/index.js'],
        'test'              :[__dirname + '/src/page/test/index.js',]
    },
    output: {
        // path        :path.resolve(__dirname,'./dist/'),
        path        :__dirname+'/dist/',
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.qiongmaomall.top/fe_mmall/dist/',
        // publicPath  :'/dist/',
        // 关键的命名[name]
        filename    : 'js/[name].js',
    },
    resolve:{
        // 配置本地资源引用
        alias:{
            node_modules  : __dirname + '/node_modules',
            util          :__dirname + '/src/util',
            page          :__dirname + '/src/page',
            service       :__dirname + '/src/service',
            image         :__dirname + '/src/image',
            common        :__dirname + '/src/page/common',
        }
    },
    plugins: [
        // 独立通用模块(全局代码) js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 加入全局代码, 注意 全局代码的引用所有页面都要加,而且要放在其他引用前面
            name        : 'common',
            filename    : "js/base.js",
            // (给 chunk 一个不同的名字)
            // minChunks: Infinity,
            // (随着 entry chunk 越来越多，
            // 这个配置保证没其它的模  块会打包进 vendor chunk)
        }),
        // 把CSS单独打包到文件
        // new ExtractTextPlugin("css/[name].css"),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
        }),
        // html模板的处理,将entry中的模块注入进来
        new HtmlWebpackPlugin(getHtmlConfig('index', '穷猫商城 - 物美价廉的仓库')),
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '详情')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login','登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result','提示')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('test','测试页面')),
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
        new HtmlWebpackPlugin(getHtmlConfig('pay-suc','支付成功')),
        new HtmlWebpackPlugin(getHtmlConfig('about','关于Me'))
    ],
    module: {
        loaders: [
            // extract是层检测css的外壳, 自动注入工具, 但是需要页面JS用require引入
            {
                // test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader')
                test    :/\.css$/,
                use     : ExtractTextPlugin.extract({
                    fallback  : "style-loader",
                    use       : "css-loader"
                })
            },
            // 如果小于200放到css文件里, 大于200生成一个单独的文件, 单位为b 1kb = 1024, woff|svg|eot|ttf为字体文件
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader?limit=20*1024&name=resource/[name].[ext]',
                    }
                ]
            },
            // 注意html-loader尽量不配置html文件, 不然会跟HtmlWebpackPlugin冲突, 导致ejs失效
            {
                test: /\.string$/,
                use:{
                    loader: 'html-loader'
                }
            }
        ]
    },
    //devServer
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        poll: 500,
        ignored: /node_modules/
    },
    devServer: {
        port: 8088,
        inline: true,
        proxy : {
            '**/*.do' : {
                target: 'http://test.happymmall.com',
                changeOrigin : true
            }
        }
    }
};
// 默认开发环境配置
var config          = devConfig;
// 切换到生产配置
console.log(1212121212121+'++++++++++++++'+WEBPACK_ENV)
if ('online'===WEBPACK_ENV) { 
    config = onlineConfig;
}
/// 开发环境注入dev-server端口
if ('dev'===WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports = config;