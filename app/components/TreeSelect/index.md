---
category: Components
subtitle: 树选择
title: TreeSelect
---

树型选择控件。

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

## API

### Extended TreeSelect props

| 参数                | 说明       | 类型       | 默认值                    |
| ----------------- | -------- | -------- | ---------------------- |
| treeData          | 树型结构数据   | array    | []                     |
| treeUrl          | 数据路径   | string    | -                    |
| treeParams        | 过滤参数     | object   | {}                     |
| treeSite          | 服务名称     | string   | 'auth'                 |
| forceUpdateTree          | 是否开启强制更新     | boolean   | false                |
| preHandleTreeData | 数据预处理方法  | function | (treeData) => treeData |
| disabledValues    | 禁用节点id列表 | array    | []                     |
| hiddenValues      | 隐藏节点id列表 | array    | []                     |

### 其他props请参考官网 [TreeSelect](https://ant.design/components/tree-select-cn/)
