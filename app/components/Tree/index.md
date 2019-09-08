---
category: Components
subtitle: 树
title: Tree
---

数字格式化组件。

## 何时使用

展示长数字时。

## API

### Extended TreeSelect props

| 参数             | 说明     | 类型                        | 默认值         |
| -------------- | ---------------------------------------- | ------------------------- | ----------- |
| showFrame       | 是否显示树组件外框   | boolean           | true          |
| treeData       | 节点数据   | array or object           | []          |
| treeUrl     | 数据路径   | string                    | -          |
| treeParams     | 过滤参数   | object                    | {}          |
| treeSite       | 服务名称   | string                    | 'auth'      |
| preHandleTreeData | 数据预处理 | function | (treeData) => treeData |
| hiddenValues   | 隐藏树节点列表   | array                     | []          |
| disabledValues | 禁用(不隐藏)树节点列表   | array                     | []          |
| disableCheckboxValues | 禁用checkbox树节点列表   | array  | []          |
| rightable | 是否开启右键点击事件   | boolean  | false         |
| onAddNode | 添加节点事件   | function  | () => { }         |
| onModNode | 编辑节点事件   | function  | () => { }         |
| onDelNode | 删除节点事件   | function  | () => { }         |
| onRefresh | 刷新事件   | function  | () => { }         |
| onRightClick | 右键事件   | function  | () => { }         |
| treeNodeConfig | 自定义配置树节点扩展   | object  | {addDiyClass:() => {}, addDiyDom:() => {}}         |
| showLine | 是否显示连线   | boolean  | true         |
| title | 标题   | string or element  | -         |

### 其他props请参考官网 [Tree](https://ant.design/components/tree-cn/)