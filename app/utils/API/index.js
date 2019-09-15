const ApiConfig = require('./api');

class API {
    constructor(props) { // 例如 {site: 'auth'}
        if (props !== undefined) {
            if (typeof props === 'string') {
                this._config = { site: props };
            } else {
                this._config = Object.assign({}, props);
            }
        } else {
            this._config = {};
        }
    }

    setBase(base) {
        this._config.base = base;
        return this;
    }

    setSite(site) {
        this._config.site = site;
        return this;
    }

    setUrlPrefix(prefix) {
        this._config.urlPrefix = prefix;
        return this;
    }

    /**
     * 解析所有带{},用正则解析,替换成正确的值
     * @param url
     * @param params
     * @private
     * @return url
     */
    _replaceUrl(url, params) {
        // 1. 解析所有带{},用正则解析
        // 2. 取出{}中的值，然后去params找对应的值（没有则console.error报错）
        // 然后值替换，并删除params对应属性
        let matchList = url.match(/\{[a-zA-Z]+\}/g) || [];
        matchList.forEach((p) => {
            let key = p.replace('{', '')
                .replace('}', '');
            if (key in params) {
                url = url.replace(p, params[key]);
                delete params[key]; // 替换完成删除 params 中对应变量
            } else {
                console.error('require param "' + key + '"not found');
            }
        });

        return url;
    }

    /**
     * 构造请求URL
     * @param url    请求部分的url
     * @param params 请求参数
     * @param method 请求方法 {GET/POST/...}
     * @returns {*}
     * @private
     */
    _makeURL(url, params, method) {
        // 深拷贝会被函数修改到的参数
        let paramsCopy = JSON.parse(JSON.stringify(params));
        if (url.includes('http')) { // 已经是绝对路径了，则无需处理
            return {
                url,
                params
            };
        }
        let { site, urlPrefix } = this._config;
        let returnUrl = '';
        if (site) {
            if (site in ApiConfig.domain) {
                returnUrl += ApiConfig.domain[site];
            } else {
                returnUrl += ApiConfig.base + '/' + site;
            }
        } else {
            returnUrl += ApiConfig.base;
        }
        if (urlPrefix) {
            returnUrl += '/' + urlPrefix;
        }
        // 拼接接口具体url  // https://10.0.74.200/auth/api/v2/menus/{id}
        returnUrl += url;

        // https://10.0.74.200/auth/api/v2/menus/1
        returnUrl = this._replaceUrl(returnUrl, paramsCopy);

        // https://10.0.74.200/auth/api/v2/menus/1?a=123
        if (method === 'GET') {
            // 来拼接剩余请求参数
            let searchParams = new URLSearchParams();
            for (let p in paramsCopy) {
                const value = paramsCopy[p];
                const paramStr = typeof value === 'string' ? value : JSON.stringify(value);
                searchParams.append(p, paramStr);
            }
            // 判断searchParams是否包含字符串信息
            if (searchParams.toString().length > 0) {
                if (returnUrl.includes('?')) {
                    returnUrl += '&' + searchParams;
                } else {
                    returnUrl += '?' + searchParams;
                }
            }
        }
        return {
            url: returnUrl,
            params: paramsCopy
        };
    }

    /**
     * 远程接口调用，增加jwt-user-info参数
     * @param url
     * @param userInfo
     * @returns returnUrl
     * 如果类型为对象，则增加jwt-user-info属性，
     * 如果类型为字符串（目前需要传入URL），拼接jwt-user-info到URL参数
     */
    // _handleURL(url) {
    //   let returnUrl = url;
    //   if (ApiConfig.isDebug) {
    //     const searchParams = new URLSearchParams();
    //     const userInfo = JSON.stringify(userLocalStore.getItem('userInfo'));
    //     searchParams.append('userInfo', userInfo);
    //     if (returnUrl.indexOf('?') > -1) {
    //       returnUrl += "&" + searchParams;
    //     } else {
    //       returnUrl += "?" + searchParams;
    //     }
    //   }
    //   return returnUrl;
    // }
    /**
     * 增加token请求验证头,在debug模式下,增加jwt-user-info属性
     * @returns {*}
     * @private
     */
    _handleHeader() {
        // if (ApiConfig.isDebug) {
        //     const userInfo = JSON.stringify(userLocalStore.getItem('userInfo'));
        //     return {
        //         'Authorization': token,
        //         'Jwt-User-Info': userInfo,
        //     };
        // } else {
        //     return {
        //         'Authorization': token,
        //     };
        // }
    }

    /**
     * 调用请求
     * @param url    请求部分url
     * @param params 请求参数
     * @param method 请求方法 {GET/POST/...}
     * @param config
     * @returns {Promise}
     * @private
     */
    _request(url, params, method, config) {
        // if (config.loading) {
        //     // 开启 Loading 效果
        //     this.spin.showLoading();
        // }
        let request = null;
        let urlInfo = this._makeURL(url, params, method);
        let reqUrl = urlInfo.url;
        const timeout = config.timeout || this._config.timeout;
        const restParams = urlInfo.params; // 传递处理剩下的 restParams 给除了 GET 请求外的其他请求作为 body 的内容对象
        const headers = new Headers();

        console.info(method, urlInfo.url);
        // headers.append("Accept", "application/json,*/*");
        if (!config.multipart) {
            headers.append('Content-Type', 'application/json');
        }

        if (method === 'GET') {
            request = new Request(reqUrl, {
                headers: headers,
                method: method
            });
        } else {
            request = new Request(reqUrl, {
                headers: headers,
                body: config.multipart === true ? params : JSON.stringify(restParams),
                method: method
            });
        }

        let st = null;
        let promise = new Promise((resolve) => {
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then((json) => {
                    console.info(url, params, json);
                    st && clearTimeout(st); // 成功时取消超时返回

                    resolve(json);
                })
                .catch((error) => {
                    console.error('Request failed', url, params, error);
                });
        });

        if (timeout !== -1) {
            // 以下代码处理请求超时
            // 实现原理是通过 Promise.race 来比较超时 Promise 与 原始 Promise 哪个最快返回
            // 最快返回的将清除另一个未返回的 Promise, 达到请求超时的效果
            let abortFn = null;
            const abortDelay = timeout || 60 * 1000;

            // 通过 Alert.wrappedAlert 函数预先将 alertContainer 保存起来
            // 让超时请求弹出框在初始化超时请求的页面弹出
            // const alertFn = Alert.wrappedAlert(Alert.error);
            let abortPromise = new Promise((resolve, reject) => {
                abortFn = () => {
                    // 手动调起 promise reject 方法
                    reject({
                        code: 500,
                        msg: `请求超时,请重试(${abortDelay}ms)`
                    });
                };
            }).then(() => {
            })
                .catch((res) => {
                    // alertFn(res);
                });
            // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
            const abortablePromise = Promise.race([promise, abortPromise]);
            st = setTimeout(abortFn, abortDelay); // 默认一分钟超时
            return abortablePromise;
        } else {
            return promise;
        }
    }

    /**
     * @url URL
     * @params 参数，可选
     */
    get(url, params, config = { loading: false, delayLoading: false }) {
        return this._request(url, params || {}, 'GET', config);
    }

    post(url, params, config = { loading: true }) {
        return this._request(url, params || {}, 'POST', config);
    }

    put(url, params, config = { loading: true }) {
        return this._request(url, params || {}, 'PUT', config);
    }

    delete(url, params, config = { loading: true }) {
        return this._request(url, params || {}, 'DELETE', config);
    }
}

export default API;
