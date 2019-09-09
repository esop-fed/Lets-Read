'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');     // gzip压缩
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolvePath } = require('./defaults');
const common = require('./base');
const libName = require('../manifest').name;

const handleCSSUse = (use) => {
    use[0] = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../../'
        }
    };
    return use;
};

let config = merge(common.baseConfig, {
    entry: [
        'babel-polyfill',
        path.join(__dirname, '../app/index')
    ],
    output: {
        path: path.join(__dirname, '/../docs'),
        filename: 'assets/js/app_[chunkhash:8].js',
        chunkFilename: 'assets/js/[name]_[chunkhash:8].chunk.js'
    },
    cache: false,
    mode: "production",
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: handleCSSUse(common.cssRules.use)
            },
            {
                test: /\.less/,
                // include: /node_modules/,
                use: handleCSSUse(common.lessRules.use)
            },
            {
                test: /\.scss/,
                exclude: /node_modules/,
                use: handleCSSUse(common.scssRules.use)
            }
        ]
    },
    plugins: [
        // nginx 进行gzip压缩
        new CompressionPlugin({
            asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip',//算法
            test: /\.(js|css)$/,
            threshold: 1024//只处理比这个值大的资源。按字节计算
            // minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
        }),
        new CompressionPlugin(),
        new HtmlWebpackPlugin({
            template: resolvePath('app/index.html'),
            favicon: resolvePath('app/favicon.ico'),
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            }
        }),

        new MiniCssExtractPlugin({
            filename: "assets/css/[name]_[contenthash:8].css",
            chunkFilename: "assets/css/[id]_[contenthash:8].css"
        }),

        new CopyWebpackPlugin([
            {
                from: 'app/styles/core/themes/*.css',
                to: 'assets/css/themes/[name].[ext]'
            }, {
                from: 'app/styles/core/tools/iconfont/antfont',
                to: 'assets/css/antfont'
            }, {
                from: 'app/_config/api.js',
                to: 'assets/js/'
            }, {
                from: `build/${libName}.js`,
                to: 'assets/js/'
            }, {
                from: 'app/images/icons',
                to: 'assets/icons'
            }
        ]),

        new HtmlWebpackIncludeAssetsPlugin({
            assets: [`assets/js/${libName}.js`],
            append: false
        }),


        // new HtmlWebpackIncludeAssetsPlugin({
        //     assets: [`assets/charting_library/charting_library.min.js`],
        //     append: false
        // }),

        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    compress: {
                        // 删除所有的 `console` 语句
                        // 还可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true
                    },
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false
                    }
                },
                sourceMap: true,
                cache: true,
                parallel: true // os.cpus().length - 1
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                components: {
                    test: /app[\\/]components|app[\\/]utils/,
                    name: 'components',
                    chunks: 'all'
                }
            }
        }
    }
});
module.exports = config;
