---
order: 10
title: 自定义扩展
---

## zh-CN

自定义配置树节点扩展

```jsx
import { Tree } from 'components';
import { Icon } from 'antd';

const treeNodeConfig={
  addDiyClass: () => {
    return "this-is-a-test-class";
  },
  addDiyDom: ()=> {
    return <Icon type="user" />
  }
}

ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} treeNodeConfig={treeNodeConfig}/>
, mountNode);
```