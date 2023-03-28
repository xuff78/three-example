const path = require('path')
const webpack = require('webpack')
const webpackCommonConf = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const distPath = path.join(__dirname, '..', 'dist')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = merge(webpackCommonConf, {
    mode: 'development',
    module: {
        rules: [
            // 直接引入图片 url
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/,
                // loader 的执行顺序是：从后往前
                use: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
            },
            {
                test: /\.less$/,
                // 增加 'less-loader' ，注意顺序
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('development')
        }),
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        // progress: true,  // 显示打包的进度条
        // contentBase: distPath,  // 根目录
        port: 8080,
        host: 'localhost',
        open: true,  // 自动打开浏览器
        compress: true,  // 启动 gzip 压缩
        hot: true,

        // 设置代理
        proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        },
        static:{
            //指定我们的public文件夹为静态资源目录
            directory: path.join(__dirname, '..', 'public'),
            //指定我们要通过/public访问到directory设置的静态资源
            //（这个很重要如果不设置默认是通过 / 访问directory设置的静态资源，会和默认访问index.html冲突）
            publicPath: '/public',
        }
    }
})
