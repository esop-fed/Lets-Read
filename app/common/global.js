/**
 * 定义 window 全局变量和函数
 */
import React from 'react';
import _ from 'lodash';
import { Store } from 'utils';


// 将logger通过window对象显露到全局,系统统一使用logger替换console
window.isClientMode = !!window.electron; // 声明是否为客户端模式判断条件

const documentTitle = sessionStorage.getItem('documentTitle');
const btnCodeStr = sessionStorage.getItem('btnCode');
const btnCode = btnCodeStr ? JSON.parse(btnCodeStr) : [];

// 刷新主页面时确保 userLocalStore 变量依然存在
const userId = sessionStorage.getItem('userId') || '';
// 初始化当前用户 localStorage 实例
window.userLocalStore = new Store({
    preKey: userId
});

// window.userLocalStore = new Store();

// 初始化按钮权限 Map
const btnCodeMap = new Map();
btnCode.forEach((item) => {
    btnCodeMap.set(item.code, item);
});
window.btnCodeMap = btnCodeMap;

// set title
if (documentTitle) {
    document.getElementsByTagName('title')[0].innerText = documentTitle;
}

/**
 * 弹开新窗口
 {
   url: '/page/auth/system/base/User', // 必填，支持绝对路径和相对路径
   title: '用户管理', // 可选，窗口显示的名称(document.title)
   name: '' // 可选，窗口的名称，如果指定了，那么就不允许打开两个相同名字的窗口，所以，如果允许打开多个窗口，则该参数置为null
   params: {} // 可选
 }
 返回值，为true，打开新窗口，为false，已打开该窗口
 */
window.openWindow = (config) => {
    let win = null;
    let { url, title, name, params } = config;

    if (_.isEmpty(url)) {
        throw new Error('config error');
    }

    if (title) {
        // 打开新窗口前将新窗口标题信息储存到 sessionStorage
        sessionStorage.setItem('documentTitle', title);
    }

    if (!url.startsWith('http')) {
        if (window.process) {
            if (window.process.env.REACT_WEBPACK_ENV == 'dev') {
                url = `${location.origin}/#${url}`;
            } else {
                url = `${location.pathname}#${url}`;
            }
        } else {
            url = `${location.origin}/#${url}`;
        }
    }

    if (params) {
        const paramsStr = JSON.stringify(params);
        url += `?params=${paramsStr}`;
    }

    if (name) {
        win = window.open(url, name);
        // TODO 加入 name 属性后，下次打开应该自动 focus 窗口
        // TODO 如果需要再加入 isOpen 标志位
    } else {
        win = window.open(url);
    }

    sessionStorage.removeItem('documentTitle'); // 打开新窗口成功后应该移除当前窗口的 documentTitle， 不然当前窗口刷新后会被篡改

    return win;
};

/**
 * 获取当前页面链接参数对象
 * @param url [option]
 */
window.getUrlParams = () => {
    const url = window.location.href; // 默认取当前页面链接
    const search = url.split('?')[1];
    const paramsStr = search && search.split('=')[1];
    return paramsStr && JSON.parse(paramsStr) || {};
};

// ===============绑定全局快捷键=================
/**
 * 订阅快捷键打开环境配置页面
//  */
// eventCenter.subscribe(['ctrl+e'], () => {
//     window.openWindow({
//         url: '/page/system/EnvConfig',
//         title: '环境配置',
//         name: '环境配置'
//     });
// });

