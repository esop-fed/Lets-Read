---
order: 2
title: 无搜索
---

## zh-CN

禁用搜索。

```jsx
import { Tree } from 'components';

const treeData = [
  { "id": 1, "code": "001", "name": "宽拓科技", "pId": 1, "describe": "北京总公司", "lev": 1, "lcode": 1, "rcode": 6 },
  { "id": 3, "code": "002", "name": "嘉实基金", "pId": 1, "describe": "北京公司", "lev": 2, "lcode": 2, "rcode": 3 },
  { "id": 5, "code": "00010", "name": "嘉实国际", "pId": 1, "describe": null, "lev": 2, "lcode": 4, "rcode": 5 },
  { "id": 4, "code": "quantex", "name": "宽拓北京", "pId": 4, "describe": null, "lev": 1, "lcode": 7, "rcode": 10 },
  { "id": 2, "code": "c1", "name": "嘉实基金", "pId": 4, "describe": "conmapny", "lev": 2, "lcode": 8, "rcode": 9 }
];
    
ReactDOM.render(
  <Tree treeData={treeData} showSearch={false} showFrame={false}/>
, mountNode);
```
