---
order: 6
title: 禁用节点
---

## zh-CN

禁用部分树节点。

```jsx
import { Tree } from 'components';

ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} disabledValues={[3, 4]}/>
, mountNode);
```