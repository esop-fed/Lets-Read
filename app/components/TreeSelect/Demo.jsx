import React from 'react';
import TreeSelect from 'components/TreeSelect';

class DemoComponent extends React.Component {
  state = {
    change: false
  }
  forceUpdate = () => {
    this.setState({
      change: true
    });
  }
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
        <code>{`<TreeSelect treeData={treeData}/>`}</code>
        <TreeSelect treeData={treeData}/>
        <h1>remote data</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list"/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list"/>
        <h1>默认会自动开启搜索功能的下拉树</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list"/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list"/>
        <h1>不带搜索功能的下拉树</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" showSearch={false}/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" showSearch={false}/>
        <h1>多选下拉树默认可以直接在input框中输入进行快速筛选/无配置项关闭</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" multiple/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" multiple/>
        <h1>多选/直接操作节点无需通过checkbox</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" multiple/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" multiple/>
        <h1>多选/只能操作checkbox</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" multiple treeCheckable/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" multiple treeCheckable/>
        <h1>defaultValue</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" defaultValue={234}/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" defaultValue={234}/>
        <h1>defaultValue/多选</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" defaultValue={234} multiple/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" defaultValue={234} multiple/>
        <h1>value</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" value={234}/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" value={234}/>
        <h1>value/多选/操作checkbox/设置了value后会要手动控制value</h1>
        <code>{`<TreeSelect treeUrl="/api/v2/menus/list" treeCheckable multiple value={[179, 233]}/>`}</code>
        <TreeSelect treeUrl="/api/v2/menus/list" treeCheckable multiple value={[179, 233]}/>
      </div>
    );
  }
}

DemoComponent.defaultProps = {
};

export default DemoComponent;
