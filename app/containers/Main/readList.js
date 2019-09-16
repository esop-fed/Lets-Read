import _ from 'lodash';
/**
 * 文章列表维护再次
 * ⚠️id 必须唯一性 pId指向父级
 * 分组：
 *     id: 1        js
 *     id: 2        css
 *     id: 3        性能方面
 *     id: 4        设计模式
 *     id: 5        node
 */

const list = [{
    "id": "1",
    "name": "js",
    "disabledContext": true,
    "pId": "1"
}, {
    "id": "2",
    "name": "css",
    "disabledContext": true,
    "pId": "2",
    children: [{
        "id": "2-1",
        "name": "CSS 变量教程",
        "pId": "2",
        "contextMenuKeys": ["open"],
        "link": "https://www.ruanyifeng.com/blog/2017/05/css-variables.html"
    }]
}, {
    "id": "3",
    "name": "性能方面",
    "disabledContext": true,
    "pId": "3",
    children: [{
        "id": "3-1",
        "name": "「中高级前端」高性能渲染十万条数据",
        "pId": "3",
        "contextMenuKeys": ["open"],
        "link": "https://juejin.im/post/5d76f469f265da039a28aff7"
    },{
        "id": "3-2",
        "name": "diff算法",
        "pId": "3",
        "contextMenuKeys": ["open"],
        "link": "https://www.jianshu.com/p/398e63dc1969"
    }]
}, {
    "id": "4",
    "name": "设计模式",
    "disabledContext": true,
    "pId": "4",
    children: [{
        "id": "4-1",
        "name": "函数组合",
        "pId": "4",
        "contextMenuKeys": ["open"],
        "link": "https://juejin.im/post/5d50bfebf265da03cb122b6f"
    }]
}, {
    "id": "5",
    "name": "node",
    "disabledContext": true,
    "pId": "5"
}];

const buildData = function (data, result) {
    data.forEach((item) => {
        if (item.children) {
            result.push(_.omit(item, 'children'));
            buildData(item.children, result);
        } else {
            result.push(item);
        }
    });
    return result;
};

const readList = buildData(list, []);


export {
    readList
}
