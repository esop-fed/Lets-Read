---
order: 4
title: 预处理数据
---

## zh-CN

对节点数据进行预处理。

```jsx
import { Tree } from 'components';

function preHandle(list) {
  return list.map((item) => {
    item.name += "test";
    return item;
  });
}
    
ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" preHandleTreeData={preHandle} showFrame={false} />
, mountNode);
```
