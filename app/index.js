import React from 'react';
import ReactDOM from 'react-dom';

import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { initIndexedDB } from 'utils/IndexedDB';

import { useStrict } from 'mobx';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
import RootContainer from './Router';

moment.locale('zh-cn');

require('common/global'); // 引入自定义的window全局变量和函数
require('normalize.css/normalize.css');
require("styles/index.scss"); // 引入框架样式文件

// 引入自定义icon
require('styles/core/tools/iconfont/font/iconfont');
require('styles/core/tools/iconfont/index.css'); // 引入覆盖font/iconfont.less文件样式类 文件

useStrict(true); // 强制所有对mobx-store的更改都得通过action

initIndexedDB();

const render = (Component) => {
    ReactDOM.render((
        <AppContainer>
            <LocaleProvider locale={zhCN}>
                <Component/>
            </LocaleProvider>
        </AppContainer>
    ), document.getElementById('app'));
};

window.onload = function () {
    // load app
    render(RootContainer);
};


if (module.hot) {
    // when HMR is enabled. react-hot-loader will reload app.
    module.hot.accept('./Router', () => {
        const NextRootContainer = require("./Router").default;
        render(NextRootContainer);
    });
    // TODO This is a react-router bug when work with react-hot-loader
    // override the console.error, and filter the warning out.
    // It's only included when HMR is enabled.
    // disabled log error 'You cannot change <Router routes>;'
    const orgError = console.error;
    console.error = (...args) => {
        if (args && args.length === 1 && typeof args[0] === "string" && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            // Log the error as normally
            orgError.apply(console, args);
        }
    };
}
