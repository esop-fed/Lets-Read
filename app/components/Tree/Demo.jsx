import React from 'react';
import Tree from 'components/Tree';

class DemoComponent extends React.Component {
  render() {
    const treeData = [{
      "id": 1,
      "code": "001",
      "name": "宽拓科技",
      "pId": 1,
      "describe": "北京总公司",
      "lev": 1,
      "lcode": 1,
      "rcode": 6
    }, { "id": 3, "code": "002", "name": "嘉实基金", "pId": 1, "describe": "北京公司", "lev": 2, "lcode": 2, "rcode": 3 }, {
      "id": 5,
      "code": "00010",
      "name": "嘉实国际",
      "pId": 1,
      "describe": null,
      "lev": 2,
      "lcode": 4,
      "rcode": 5
    }, {
      "id": 4,
      "code": "quantex",
      "name": "宽拓北京",
      "pId": 4,
      "describe": null,
      "lev": 1,
      "lcode": 7,
      "rcode": 10
    }, { "id": 2, "code": "c1", "name": "嘉实基金", "pId": 4, "describe": "conmapny", "lev": 2, "lcode": 8, "rcode": 9 }];
    return (
      <div className="content">
        <h1>local data</h1>
        <code>{`<Tree treeData={treeData}/>`}</code>
        <Tree treeData={treeData}/>
        <h1>local data + 简单树</h1>
        <code>{`<Tree treeData={treeData} showFrame={false}/>`}</code>
        <Tree treeData={treeData} showFrame={false}/>
        <h1>local data + 无搜索简单树</h1>
        <code>{`<Tree treeData={treeData} showSearch={false} showFrame={false}/>`}</code>
        <Tree treeData={treeData} showSearch={false} showFrame={false}/>
        <h1>remote data</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list"/>`}</code>
        <Tree treeUrl="/api/v2/menus/list"/>
        <h1>checkable + defaultCheckedKeys</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" checkable defaultCheckedKeys={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" checkable defaultCheckedKeys={[179, 233, 234]}/>
        <h1>checkable + checkedKeys(需手动控制)</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" checkable checkedKeys={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" checkable checkedKeys={[179, 233, 234]}/>
        <h1>defaultExpandedKeys</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" defaultExpandedKeys={[234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" defaultExpandedKeys={[234]}/>
        <h1>expandedKeys(需手动控制)</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" checkable expandedKeys={[179]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" checkable expandedKeys={[179]}/>
        <h1>defaultSelectedKeys</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" multiple defaultSelectedKeys={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" multiple defaultSelectedKeys={[179, 233, 234]}/>
        <h1>selectedKeys(需手动控制)</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" multiple selectedKeys={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" multiple selectedKeys={[179, 233, 234]}/>
        <h1>hiddenValues</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" hiddenValues={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" hiddenValues={[179, 233, 234]}/>
        <h1>disabledValues</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" disabledValues={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" disabledValues={[179, 233, 234]}/>
        <h1>checkable + disableCheckboxValues</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" checkable disableCheckboxValues={[179, 233, 234]}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" checkable disableCheckboxValues={[179, 233, 234]}/>
        <h1>给每个节点根据条件增加自定义样式类</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" treeNodeConfig={{ addDiyClass: (node) => {
          return node && "custom-style";
        } }}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" treeNodeConfig={{ addDiyClass: (node) => {
          return node && "custom-style";
        } }}/>
        <h1>给每个节点根据条件追加内容显示</h1>
        <code>{`<Tree treeUrl="/api/v2/menus/list" treeNodeConfig={{ addDiyDom: (node) => {
          return node && <span>≈≈≈+++</span>;
        } }}/>`}</code>
        <Tree treeUrl="/api/v2/menus/list" treeNodeConfig={{ addDiyDom: (node) => {
          return node && <span>≈≈≈+++</span>;
        } }}/>
      </div>
    );
  }
}

DemoComponent.defaultProps = {
};

export default DemoComponent;
