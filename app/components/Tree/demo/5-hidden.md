---
order: 5
title: 隐藏节点
---

## zh-CN

隐藏部分树节点。

```jsx
import { Tree } from 'components';

ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} hiddenValues={[3, 4]}/>
, mountNode);
```