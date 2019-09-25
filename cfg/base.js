'use strict';
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');

const marked = require("marked");
const highlight = require('highlight.js');
const renderer = new marked.Renderer();

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let { publicPath, srcPath, isDev } = require('./defaults');

const baseConfig = {
    devtool: 'eval',
    output: {
        path: path.join(__dirname, '/../dist'),
        filename: 'app.js',
        publicPath: `${publicPath}`,
        chunkFilename: '[name]_[chunkhash:8]_chunk.js'
    },
    resolve: {
        modules: [path.join(__dirname, '/../node_modules')],
        extensions: ['.js', '.jsx', ".ts", ".tsx"],
        alias: {
            'common': `${srcPath}/common/`,
            'page/common': `${srcPath}/containers/page/common/`,
            'config': `${srcPath}/_config/`,
            '_config': `${srcPath}/_config/`,
            'components': `${srcPath}/components/`,
            'containers': `${srcPath}/containers/`,
            'images': `${srcPath}/images/`,
            'styles': `${srcPath}/styles/`,
            'utils': `${srcPath}/utils/`,
            'react/lib/ReactMount': 'react-dom/lib/ReactMount'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: srcPath,
                enforce: "pre",
                loader: 'babel-loader'
            }, {
                test: /\.tsx?$/,
                include: srcPath,
                loader: "bundle-loader?lazy!ts-loader"
            }, {
                test: /\.md$/,
                use: [
                    {
                        loader: "raw-loader"
                    },
                    {
                        loader: "markdown-loader",
                        options: {
                            renderer,
                            highlight: code => highlight.highlightAuto(code).value,
                            pedantic: false,
                            gfm: true,
                            tables: true,
                            breaks: false,
                            sanitize: false,
                            smartLists: true,
                            smartypants: false,
                            xhtml: false
                        }
                    }
                ]
            },
            {
                test: /\.html/,
                loader: 'html-loader'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: isDev ? '[name].[ext]' : 'assets/css/font/[name]_[hash:7].[ext]'
                }
            }, {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
                options: {
                    name: isDev ? '[name].[ext]' : 'assets/css/font/[name]_[hash:7].[ext]'
                }
            }, {
                test: /\.(png|jpg|gif|svg|webp)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: isDev ? '[name].[ext]' : 'assets/img/[name]_[hash:7].[ext]'
                }
            }, {
                test: /\.(mp4|ogg)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [

        new ProgressBarPlugin({
            width: 50,
            format: chalk.magenta.bold('build bundle process ') + chalk.cyan.bold(':percent') + chalk.yellow.bold(' (:elapsed seconds)'),
            clear: false
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, '/../'),
            manifest: require('../manifest.json')
        }),

        // 防止moment引入多余的语言包
        // new webpack.ContextReplacementPlugin(
        //     /moment[/\\]locale$/,
        //     /zh-cn/,
        // ),

        // new BundleAnalyzerPlugin(),
    ],
    externals: {
        // 'react': 'React',
        // 'react-dom': 'ReactDOM',
        // 'react-router-dom': 'ReactRouterDOM',
        // 'lodash': '_',
        // 'moment': 'moment',
        // 'mobx': 'mobx',
        // 'mobx-react': 'mobxReact',
        // 'antd': 'antd',
        // 'echarts': 'echarts',
        // 'ag-grid-community': 'agGrid',
        // 'ag-grid-enterprise': 'agGrid',
    }
};

exports.cssRules = {
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        }
    ]
}

exports.lessRules = {
    test: /\.less/,
    // include: /node_modules/,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        },
        {
            loader: 'less-loader'
        }
    ]
}

exports.scssRules = {
    test: /\.scss/,
    exclude: /node_modules/,
    use: [
        {
            loader: 'style-loader'
        }, {
            loader: 'css-loader',
            options: {
                modules: true,
                // camelCase: true,
                localIdentName: '[local].[hash:base64:8]',
                minimize: true
            }
        }, {
            loader: 'postcss-loader'    // 自动添加css前缀
        }, {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                outputStyle: {
                    expanded: true
                },
                includePaths: [srcPath],
                data: '@import "styles/core/variables";'
            }
        }
    ]
}


exports.baseConfig = baseConfig;
