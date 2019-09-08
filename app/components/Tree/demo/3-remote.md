---
order: 3
title: 远程数据
---

## zh-CN

直接向后台获取数据。

```jsx
import { Tree } from 'components';
    
ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} />
, mountNode);
```
