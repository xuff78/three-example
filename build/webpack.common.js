const path = require('path')
const srcPath = path.join(__dirname, '..', 'src')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
module.exports = {
    entry: {
        index: path.join(srcPath, 'index.js'),
        city: path.join(srcPath, 'city.js'),
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
            chunks: ['index', 'vendor', 'common']  // 考虑代码分割
        }),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'city.html'),
            filename: 'city.html',
            chunks: ['city', 'vendor', 'common']  // 考虑代码分割
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
