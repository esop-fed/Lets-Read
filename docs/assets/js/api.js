/**
 * 开发环境下的服务配置, 修改此文件会自动打包, 不需重启服务
 */
let port = '80';
let ip = '10.116.18.176';

const defaultDomain = {
    auth: `http://${ip}/auth2`,
    // auth: `http://10.116.19.98:9999/auth`,
    qvw: `http://${ip}/qvw2`,
    // qvw: 'http://10.116.19.121:8292/qvw',
    valuator: `http://${ip}/valuator`,
    // qvw: `http://10.116.19.135:8292/qvw`,
    pms: `http://${ip}/pms`,
    // pms: `http://10.116.19.137:8810/pms`,
    qcw: 'http://10.116.18.151:8092/qcw',
    cmsext: 'http://10.116.18.151:8097/cmsext',
    msgcenter: `ws://${ip}/msgcenter2`,
    air: 'http://10.116.18.162:7070/air',
    airweb: 'http://10.116.18.162:7070/#',
    kg: 'http://10.116.18.162:8083/KG',
    kgweb: 'http://10.116.18.162:7071/#',
    kgms: 'ws://10.116.18.162:8083/KG',

    // 开发测试
    ibor_fp: 'http://10.116.19.78:80/qvw',         // 冯盼
    ibor_qy: 'http://10.116.19.123:8089/auth',       // 庆元
    ibor_llj: 'http://10.116.19.44:8080/pms', //  李林君
    ibor_cc: 'http://10.116.19.128:7777/ibor',        // 陈畅
    ibor_jl: 'http://10.116.19.164:8080/pms', //  家龙龙龙龙龙
    ibor_cjl: 'http://10.116.19.114/qvw', //  陈健龙
    rms: 'https://demo.rms.iquantex.com/rms',
    ibor_cms: 'http://10.16.18.208:9002/t2-persist',
    pas: 'http://10.116.18.105:8080/pas2',


    zyb: 'http://10.116.19.135:8810/pms',
    pms_llj: 'http://10.116.19.34:8810/pms',
    pms_cc: 'http://10.116.19.177:8080/pms',
    yiju: 'http://10.116.18.176/pyback',

    tv: 'http://10.116.19.72:8292/qvw',
    xxl: 'http://10.116.18.176/schadmin',
    // xxl: 'http://10.116.19.24:9071/schadmin',
    imsui: 'http://10.116.18.151:880/#',
    imsQaw: 'http://10.116.18.151:880/prd-admin',
    imsQtw: 'http://10.116.18.151:880/qtw',
    imsAuth: 'http://10.116.18.151:880/auth',
    cmsAuth: 'http://10.116.18.151/auth',
    cmsui: 'http://10.116.18.151/#',
    rtv: `http://${ip}/rtv`,
    simulator: `http://${ip}:8811/simulator`,
};


const domain = new Proxy(defaultDomain, {
    get: (target, property) => {
        if (typeof window === "undefined") {
            return target[property];
        }
        if (window.customSite && window.customSite[property]) {
            return window.customSite[property];
        } else {
            return target[property];
        }
    }
});

const ApiConfig = {
    isDebug: false, // true：本地调试开发，false：线上版本x.com/qdw', */
    webSecurity: false, // 客户端安全策略控制，false 关闭客户端安全策略限制
    base: `http://${ip}:${port}/qvw`,
    domain,
    autoUpdate: 'http://10.0.74.31:1337', // 客户端自动更新服务地址
    rap: {
        baseUrl: 'http://10.116.18.101:8080', // mock服务URL
        projectId: 78, // 项目Id
    },
    port: {
        proxyServer: 8001, // 本地代理所占用端口
        devServer: 8888 // webpack dev server 所占用端口
    },
};

ApiConfig.proxyServer = `http://localhost:${ApiConfig.port.proxyServer}/`;  // 'http://{ip}:${PORT.proxyServer}/' // 设置为自己电脑 ip, 可供局域网访问
// ApiConfig.proxyServer = `http://10.116.19.54:${ApiConfig.port.proxyServer}/`;  // 'http://{ip}:${PORT.proxyServer}/' // 设置为自己电脑 ip, 可供局域网访问

module.exports = ApiConfig;
