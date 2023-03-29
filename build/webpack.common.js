const path = require('path')
const srcPath = path.join(__dirname, '..', 'src')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
module.exports = {
    entry: {
        index: path.join(srcPath, 'index.js'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: srcPath,
                exclude: /node_modules/
            }
            // css 处理
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
        }),
        new ESLintWebpackPlugin({
            context: srcPath
        })
    ],
    resolve: {
        // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
        alias: {
            '@': srcPath
        },
        // 配置省略文件路径的后缀名
        extensions: ['.js', ".json", ".jsx", ".css"],
    },
}
