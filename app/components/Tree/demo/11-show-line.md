---
order: 11
title: 隐藏连线
---

## zh-CN

隐藏连线。

```jsx
import { Tree } from 'components';

ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} showLine={false}/>
, mountNode);
```