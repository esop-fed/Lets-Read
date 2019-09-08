import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Input, Popconfirm, Tree, Menu, Dropdown } from 'antd';
import { PropTypes as MobxPropTypes } from "mobx-react";
import _ from 'lodash';
import classnames from 'classnames';
import Util from 'utils/util';

const TreeNode = Tree.TreeNode;
const QUICK_SEARCH_DELAY = 300;  // 快速搜索延时

class SearchTreeComponent extends React.Component {
  treeList = []; // 菜单数据 list = [{id1, name1}, {id2, name2}...]
  treeDataCopy = []; // 菜单数据，树形结构

  state = {
    inputValue: '',
    expandedKeys: [],
    autoExpandParent: true
  };
  /**
   * 模糊搜索框变化时触发
   * 1. 重新设置 expandedKeys
   * @param event
   */
  handleChange = (event) => {
    // 一旦输入框有变化,则将模糊查找的字段设为有效
    const value = event.target.value;
    this._filterExpandedKeys(value);
  }


  /**
   * 点击右键菜单节点操作按钮触发
   */
  handleItemClick = (info) => {
    const { key } = info;
    const { data } = info.item.props;
    if (key === 'add') {
      // 执行外围添加函数
      this.props.onAddNode(data);
    } else if (key === 'mod') {
      // 执行外围编辑函数
      this.props.onModNode(data);
    } else if (key === 'open') {
      this.props.onOpen(data);
    } else {
      // 非指定事件类型时统一触发事件
      this.props.onContextMenuClick(key, data);
    }
  }
  onDelNode = (data) => {
    this.props.onDelNode(data);
  }
  /**
   * 传递给rc-tree的选中节点回调方法
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    // 执行外围函数
    this.props.onSelect(info.node.props.data, selectedKeys);
  }
  /**
   * 传递给rc-tree的折叠节点时回调方法
   * @param expandedKeys
   */
  onExpand = (expandedKeys) => {
    // 执行外围函数
    this.props.onExpand(expandedKeys);

    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded chilren keys.
    // 手动折叠标签时,将自动打开父标签属性设为否,否则会造成父标签无法折叠的bug
    this.setState({
      expandedKeys: expandedKeys,
      autoExpandParent: false
    });
  }
  onRightClick = (info) => {
    const { rightable } = this.props;
    if (!rightable) return;
    this.renderRightClickMenu(info);
    window.getSelection().removeAllRanges();
  }
  /**
   * 渲染右键菜单
   */
  renderRightClickMenu(info) {
    if (this.dropdown) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      this.dropdown = null;
    }
    const item = info.node.props;
    const itemData = item.data;
    const { disabledContext } = item.data;
    if (disabledContext) return null;
    const contextMenuKeys = itemData.contextMenuKeys || ["mod", "add", "del", "open"];
    const defaultContextMenuMap = new Map([
      ["mod", <Menu.Item key="mod" data={itemData}>编辑</Menu.Item>],
      ["add", <Menu.Item key="add" data={itemData}>添加</Menu.Item>],
      ["open", <Menu.Item key="open" data={itemData}>打开</Menu.Item>],
      ["del", (
        <Menu.Item key="del" data={itemData}>
          <Popconfirm
            placement="topLeft"
            title="是否删除该节点?"
            onConfirm={() => { this.onDelNode(itemData); }}
            okText="是"
            cancelText="否"
          >
            <div>删除</div>
          </Popconfirm>
        </Menu.Item>
      )]
    ]);
    // 定义每个节点的下拉菜单
    const menu = (
      <Menu className="treenode-context-menu" onClick={this.handleItemClick}>
        {contextMenuKeys.map((iconKey) => {
          let action = iconKey;
          if (typeof iconKey === "object") {
            if (!defaultContextMenuMap.has(iconKey.action)) {
              // 自定义渲染菜单项
              return <Menu.Item key={iconKey.action} data={itemData}>{iconKey.name}</Menu.Item>;
            }
            action = iconKey.action;
          }
          // 从默认的右键菜单项数组中生成 MenuItem
          return defaultContextMenuMap.get(action);
        })}
      </Menu>
    );
    this.dropdown = (
      <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']} defaultVisible >
        <span></span>
      </Dropdown>
    );

    const container = this.getContainer();
    Object.assign(this.cmContainer.style, {
      position: 'absolute',
      left: `${info.event.pageX}px`,
      top: `${info.event.pageY}px`,
    });

    ReactDOM.render(this.dropdown, container);
  }
  getContainer() {
    if (!this.cmContainer) {
      this.cmContainer = document.createElement('div');
      document.body.appendChild(this.cmContainer);
    }
    return this.cmContainer;
  }
  /**
   * 拖拽树节点
   * @param info
   */
  onDrop = (info) => {
    const { node, dragNode, dropToGap, dropPosition } = info;
    const targetNodeData = node.props.data;   // 目标节点
    const dragNodeData = dragNode.props.data; // 操作节点
    let dropType = '';
    if (dropToGap) {
      if (dropPosition <= 0) {
        dropType = 'prev';
      } else {
        dropType = 'next';
      }
    } else {
      dropType = 'inner';
    }
    this.props.onDrop(dragNodeData, targetNodeData, dropType);
  }


  /**
   * 过滤包含搜索值的菜单项（获取设置展开项）
   * @param value search input 输入值
   */
  _filterExpandedKeys = _.debounce((value) => {
    let expandedKeys = [];

    if (value) {
      expandedKeys = this.treeList.map((item) => {
        if (item.name.indexOf(value) > -1) {
          return this._getParentKey(item.id, this.treeDataCopy);
        }
        return null;
      }).filter((item, i, self) => {
        return item && self.indexOf(item) === i;
      });
    }
    this.setState({
      inputValue: value,
      expandedKeys,
      autoExpandParent: true
    });
  }, QUICK_SEARCH_DELAY);

  /**
   * 获取包含搜索值的子项的父节点 id
   * @param id 当前项的 id
   * @param tree 树形结构数据
   */
  _getParentKey = (id, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.items) {
        if (node.items.some((item) => { return item.id == id; })) {
          parentKey = node.id;
        } else if (this._getParentKey(id, node.items)) {
          parentKey = this._getParentKey(id, node.items);
        }
      }
    }
    return parentKey;
  };

  renderTreeNode = (config) => {
    const { addDiyClass, addDiyDom } = this.props.treeNodeConfig;
    const { inputValue } = this.state;
    const { treeData } = config;
    return treeData.map((item) => {
      const key = `${item.id}`; // 对key的操作均为字符串类型,应转成字符串
      const name = item.name; // 指定 name 作为模糊搜索过滤字段
      const itemData = item.data;

      // 标红含有搜索值的子项
      const index = name.indexOf(inputValue);
      const beforeStr = name.substr(0, index);
      const afterStr = name.substr(index + inputValue.length);

      // 通过Dropdown组件包装使hover时自动下拉
      const title = (
        <span title={name}>
          <span className="title">
            {
              index > -1 ? <span>
                {beforeStr}
                <span className="text-danger">{inputValue}</span>
                {afterStr}
              </span> : <span>{name}</span>
            }
          </span>
          {(_.isFunction(addDiyDom) && addDiyDom(itemData)) || null}
        </span>
      );
      const treeNodeClassName = classnames({
        [(_.isFunction(addDiyClass) && addDiyClass(itemData))]: (_.isFunction(addDiyClass) && addDiyClass(itemData)),
        "tree-node-item": true,
      });

      const treeNodeProps = {
        key: key,
        searchKey: name,
        title: title,
        data: itemData,
        disabled: itemData.disabled,
        disableCheckbox: itemData.disableCheckbox,
        className: treeNodeClassName
      };
      if (item.items) {
        return (
          <TreeNode {...treeNodeProps}>
            {this.renderTreeNode(_.assign({}, config, {
              treeData: item.items
            }))}
          </TreeNode>
        );
      }
      return <TreeNode {...treeNodeProps} />;
    });
  };
  render() {
    // render TreeNode
    // 简化变量名
    let { treeData, showSearch, ...extra } = this.props;
    const { expandedKeys, autoExpandParent } = this.state;
    // 过滤掉隐藏的节点
    treeData = treeData.filter((item) => {
      if (!item.hidden) {
        this.treeList.push({ // 保存一份 tree 数据的 list(非树形结构)
          id: item.id,
          name: item.name
        });
      }
      return !item.hidden;
    });
    treeData = Util.toTreeData(treeData);
    this.treeDataCopy = treeData; // 将处理成树形结构的数据保存一份在实例上，搜索时需要用到

    const props = {
      onExpand: this.onExpand,
      expandedKeys: expandedKeys,
      autoExpandParent: autoExpandParent,
      onSelect: this.onSelect,
      onRightClick: this.onRightClick, // 如果 props 中设置了 rightable 为 true 时则传入右键事件, 默认不传入
      onDrop: this.onDrop
    };

    const treeNode = this.renderTreeNode({
      treeData
    });
    return (
      <div className={`tree-content ${!showSearch ? 'tree-content-without-search' : ''}`}>
        {showSearch && <Input placeholder="搜索节点" onChange={this.handleChange} size="small" />}
        <Tree {...extra} {...props}>
          {treeNode}
        </Tree>
      </div>
    );
  }
}

SearchTreeComponent.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  treeData: PropTypes.oneOfType([
    PropTypes.array,
    MobxPropTypes.observableArray
  ]).isRequired,
  showSearch: PropTypes.bool,
  rightable: PropTypes.bool,
  onAddNode: PropTypes.func,
  onModNode: PropTypes.func,
  onDelNode: PropTypes.func,
  onRightClick: PropTypes.func,
  onItemClick: PropTypes.func,
  treeNodeConfig: PropTypes.object,
};

SearchTreeComponent.defaultProps = {
  // ================== Custom-Tree-props ==================
  showSearch: true,
  rightable: false, // 是否开启右键点击事件
  onAddNode: () => { },
  onModNode: () => { },
  onDelNode: () => { },
  onOpen: () => { },
  // ================ Custom-TreeNode-props ================
  // 以下属性均要加到每个节点数据中,而不是直接加在Tree组件的props中
  treeNodeConfig: { // 给每个树节点扩展自定义配置
    addDiyClass: () => { }, // 给每个节点添加自定义样式类, 要求函数返回值为 string
    addDiyDom: () => { }, // 给每个节点追加自定义内容, 要求函数返回值为 ReactNode
  },
  // =================== Ant-Tree-props ====================
  // 蚂蚁提供的配置项
  treeData: [],
  showLine: true, // 默认显示连线
  onSelect: () => { },
  onExpand: () => { },
  onDrop: () => { },
  onContextMenuClick: () => { } // 右键菜单时间
};

export default SearchTreeComponent;
