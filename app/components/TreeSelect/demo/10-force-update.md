---
order: 10
title: 强制更新
---

## zh-CN

强制更新下拉菜单选项。

````jsx
import { TreeSelect } from 'components';
import { Button, message } from 'antd';

class App extends React.Component {
  state = {
    change: false
  }
  handleForceUpdate = () => {
    this.setState({
      change: true
    }, () => {
      message.success("更新成功");
    });
  }
  render() {
    return (
      <div>
        <Button onClick={this.handleForceUpdate} size="small" type="primary" style={{ marginBottom:10 }}>forceUpdate</Button>
        <TreeSelect treeUrl="/api/v2/menus/list" forceUpdateTree/>
      </div>
    );
  }
}

ReactDOM.render(
  <App />
, mountNode);
````
