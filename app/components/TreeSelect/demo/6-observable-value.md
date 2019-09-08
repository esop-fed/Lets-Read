---
order: 6
title: 监听value
---

## zh-CN

由上层组件管理`value`状态。

```jsx
import { TreeSelect } from 'components';

class App extends React.Component {
  state = {
    value: 234
  }
  handleChange = (value) => {
    this.setState({
      value
    });
  }
  render() {
    const { value } = this.state;
    return (
      <TreeSelect treeUrl="/api/v2/menus/list" value={value} onChange={this.handleChange} />
    );
  }
}

ReactDOM.render(
  <App />
, mountNode);
```
