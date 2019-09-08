---
order: 7
title: 禁用部分checkbox
---

## zh-CN

禁用部分checkbox。

```jsx
import { Tree } from 'components';
    
ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} checkable disableCheckboxValues={[3, 4]}/>
, mountNode);
```