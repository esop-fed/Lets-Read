class Store {
    constructor(opts) {
        if (opts && opts.preKey) {
            this.preKey = opts.preKey + '/';
        } else {
            this.preKey = '';
        }
    }

    // TODO 暂不可用
    clear() {
        for (let i = 0; i <= localStorage.length - 1; i++) {
            const key = localStorage.key(i);
            if (key.indexOf(this.preKey) === 0) {
                localStorage.removeItem(key);
            }
        }
    }

    /**
     * 清除当前用户(this.preKey)相关的主要信息
     */
    clearUserLocalStorage() {
        const userInfos = ['userInfo',
            'token',
            'lastLoginTime',
            'marketTradeDateMap' // 市场交易日期
        ];
        userInfos.forEach((key) => {
            localStorage.removeItem(this.preKey + key);
        });
    }

    getItem(key) {
        let newKey = this.preKey + key;
        return JSON.parse(localStorage.getItem(newKey));
    }

    setItem(key, data) {
        let newKey = this.preKey + key;
        localStorage.setItem(newKey, JSON.stringify(data));
    }

    removeItem(key) {
        localStorage.removeItem(this.preKey + key);
    }
}

export default Store;
