const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const vendors = [
    // 'antd',
    // 'lodash',
    'mobx',
    'mobx-react',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    // 'echarts',
    // 'echarts-for-react',
    // 'moment',

    // 'ag-grid-react',
    // 'ag-grid-enterprise'
    // ...其它库
];

module.exports = {
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name]_[chunkhash:8].js',
        library: '[name]_[chunkhash:8]',
    },
    entry: {
        "lib": vendors,
    },
    mode: 'production',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]_[chunkhash:8]',
            context: __dirname,
        }),
    ],
};
