'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./base');
const PORT = require('../app/_config/dev/api').port;
const { resolvePath } = require('./defaults');

const libName = require('../manifest').name;

let config = merge(common.baseConfig, {
    entry: [
        'react-hot-loader/patch', // RHL patch
        'babel-polyfill',
        'webpack-dev-server/client?http://127.0.0.1:' + PORT.devServer,
        'webpack/hot/only-dev-server',
        './app/index.js'
    ],
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    mode: "development",
    module: {
        rules: [
            common.cssRules,
            common.lessRules,
            common.scssRules
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolvePath('app/index.html')
        }),

        new CopyWebpackPlugin([
            {
                from: 'app/styles/core/themes/*.css',
                to: 'themes/[name].[ext]'
            }, {
                from: 'app/styles/core/tools/iconfont/antfont',
                to: 'antfont'
            }, {
                from: `build/${libName}.js`,
                to: ''
            }, {
                from: 'app/images/icons',
                to: 'icons'
            },
            // {
            //     from: 'charting_library',
            //     to: 'charting_library'
            // }
        ]),

        new HtmlWebpackIncludeAssetsPlugin({
            files: ['index.html'],
            assets: [`${libName}.js`],
            append: false
        }),


        // new HtmlWebpackIncludeAssetsPlugin({
        //     assets: [`assets/charting_library/charting_library.min.js`],
        //     append: false
        // }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    // 开发服务器配置
    devServer: {
        // contentBase: './app/',
        disableHostCheck: true,
        // overlay: true,
        historyApiFallback: true,
        hot: true,
        port: PORT.devServer,
        noInfo: true, // 使用进度条的方式替换打包信息
        stats: {
            // Config for minimal console.log mess.
            // Find all stats in https://webpack.js.org/configuration/stats/#stats
            timings: false,
            colors: true,
            version: false,
            hash: false,
            chunks: false,
            chunkModules: true,
            children: false
        }
    }
});

module.exports = config;
