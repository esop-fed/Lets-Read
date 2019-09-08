---
order: 9
title: 刷新事件
---

## zh-CN

刷新树节点,如果 treeData 由外部组件传入,则调用外部传入的刷新函数进行刷新。

```jsx
import { Tree } from 'components';
import { message } from 'antd';

const treeData = [
  { "id": 1, "code": "001", "name": "宽拓科技", "pId": 1, "describe": "北京总公司", "lev": 1, "lcode": 1, "rcode": 6 },
  { "id": 3, "code": "002", "name": "嘉实基金", "pId": 1, "describe": "北京公司", "lev": 2, "lcode": 2, "rcode": 3 },
  { "id": 5, "code": "00010", "name": "嘉实国际", "pId": 1, "describe": null, "lev": 2, "lcode": 4, "rcode": 5 },
  { "id": 4, "code": "quantex", "name": "宽拓北京", "pId": 4, "describe": null, "lev": 1, "lcode": 7, "rcode": 10 },
  { "id": 2, "code": "c1", "name": "嘉实基金", "pId": 4, "describe": "conmapny", "lev": 2, "lcode": 8, "rcode": 9 }
];

function refresh() {
  message.success("刷新节点");
}
    
ReactDOM.render(
  <Tree treeData={treeData} onRefresh={refresh} />
, mountNode);
```