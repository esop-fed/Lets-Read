const http = require('http');
const httpProxy = require('http-proxy');
const request = require('request');
const chalk = require('chalk');
const fs = require('fs-extra');
const {URLSearchParams} = require('url');

/**
 * 创建代理服务
 * @param config "{ "target": "https://10.0.74.200" }"
 * @returns server
 */
const createProxyServer = (config) => {
    return httpProxy.createProxyServer({
        target: config.target,
        secure: false,
        changeOrigin: true
    });
};

/**
 * 获取url中的源 "http://10.0.74.200/"
 * @param url
 * @returns {*}
 */
const getUrlOrigin = (url = '') => {
    const reg = new RegExp(/^(http|https|ws|wss)?:\/\/[\w]+(\.[\w]+)+(:[0-9]+)?\//);
    return url.match(reg) && url.match(reg)[0];
};

// 将 dev 环境下的 api.js 拷贝到 _config 目录下启用 (同步)
fs.copySync('app/_config/dev/api.js', 'app/_config/api.js');

// 用最新的 api.js 来配置代理服务器
const config = require('./app/_config/api');
const PORT = require('./app/_config/dev/api').port;
const {domain, rap} = config;

// 获取白名单列表
let blankList = [];
request.get({
    url: rap.baseUrl + '/RAP/mock/getWhiteList.do?projectId=' + rap.projectId
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        blankList = JSON.parse(body);
    }
});

// 创建基础代理服务
const baseProxyServer = createProxyServer({target: config.base});
// 创建 RAP 代理服务
const rapProxyServer = createProxyServer({target: rap.baseUrl});
// 将请求发送至 IMS 服务后台
const imsProxyServers = {};
// 创建各个服务的代理服务
for (let site in domain) {
    const url = domain[site];
    const target = getUrlOrigin(url); // 取出 url 中 domain 部分
    if (!target) {
        console.error("cannot create", site, "proxy server without a target url!");
    } else if (!target.includes("ws://") || !target.includes("wss://")) {
        imsProxyServers[site] = createProxyServer({target});
    } else {
        // create ws server if need
    }
}

// 本地代理 Server ,所有请求都会在这里拦截并处理,完成转发
http.createServer(function (req, res) {
    // 对齐控制台打印
    let alignSpace = '';
    const methodLength = req.method.length;
    if (methodLength && methodLength < 7) {
        for (let i = 0; i < (7 - methodLength); i++) {
            alignSpace += ' ';
        }
    }
    // handle the request
    // rapUrl: /api/SysUserLoginServlet/{id}
    const rapUrl = shouldMock(req.url, req.method, blankList);
    if (rapUrl) {
        // 覆写 request.url, 定位为 rap 服务器对应的地址
        // req.url: /RAP/mockjsdata/10/api/SysUserLoginServlet/{id}
        req.url = `/RAP/mockjsdata/${rap.projectId}${rapUrl}`;
        // proxy the request to rap
        console.log(chalk.magenta.bold(req.method + alignSpace), chalk.cyan.bold(rap.baseUrl + req.url), ' \n');
        rapProxyServer.web(req, res);
    } else {
        // get site
        const searchStr = req.url.split('?')[1] || '';
        const searchParams = new URLSearchParams(searchStr);
        const site = searchParams.get('_site');
        const imsProxyServer = imsProxyServers[site] || baseProxyServer;
        const origin = site && getUrlOrigin(domain[site]) || config.base;

        // proxy the request to ims
        console.log(chalk.magenta.bold(req.method + alignSpace), chalk.cyan.bold(origin + req.url), ' \n');
        imsProxyServer.web(req, res);
    }
})
    .listen(PORT.proxyServer);

// 通过正则匹配再加方法判断,转发请求至对应 Server
const shouldMock = (url, method, blankList) => {
    // url: /auth2/api/SysUserLoginServlet/123
    // split the param after ?
    if (url.includes('?')) {
        url = url.split('?')[0];
    }

    for (let i = 0; i < blankList.length; i++) {
        let item = blankList[i];
        let rapUrl = item.url;
        let regUrl = item.url;
        let params = regUrl.match(/\{[a-zA-Z]+\}/g); // match {param} list
        if (params) {
            params.forEach((param) => {
                // replace {param} with '\w+'
                regUrl = regUrl.replace(param, '\\w+');
            });
        }
        regUrl += '$';
        // regUrl: \/api\/SysUserLoginServlet\/\w+/
        let reg = new RegExp(regUrl);
        if (reg.test(url)) {
            if (method == 'OPTIONS') {
                return rapUrl;
            } else if (method === item.method) {
                // rapUrl: /api/SysUserLoginServlet/{id}
                console.log(chalk.magenta.bold("RAP URL"), chalk.cyan.bold(rapUrl), ' \n');
                return url.match(reg)[0] || '';
            }
        }
    }
    return false;
};
