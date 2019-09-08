---
order: 8
title: 开启右键
---

## zh-CN

开启右键菜单。

```jsx
import { Tree } from 'components';
import { message } from 'antd';

function addNode(list) {
  message.success("新建节点");
}

function modNode(list) {
  message.success("编辑节点");
}

function delNode(list) {
  message.success("删除节点");
}
    
ReactDOM.render(
  <Tree treeUrl="/api/v2/companies/list" showFrame={false} rightable onAddNode={addNode} onModNode={modNode} onDelNode={delNode}/>
, mountNode);
```