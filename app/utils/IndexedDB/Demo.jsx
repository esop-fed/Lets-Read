import React, { Component } from 'react';
import { Button } from 'antd';
import { wrapperTableName } from 'utils/IndexedDB';

const T_CUSTOM_TABLE = "custom_table"; // test 表
const dbUtil = wrapperTableName(T_CUSTOM_TABLE);

class IndexedDBComponent extends Component {
  constructor() {
    super();
    this.count = 22; // id
  }

  handleInsertData = () => {
    // 登录成功后插入一条数据
    ++this.count;
    dbUtil.insertData({
      id: this.count, // 表格id
      name: '指令表', // 表格名称，暂时为null
      config: {
        defaultTpl: 0,
        tpls: [
          {
            name: '自定义表格1',
            columns: [ // 这里只配置那些需要显示的列
              {
                title: 'ID', // 列的名称
                width: 70, // 以像素作为单位  or auto
                order: false, // 是否支持排序  true/false
              }
            ]
          }
        ]
      }
    });
  }
  handleUpdateData = () => {
    logger.log("更新记录的ID====: ", this.count);
    dbUtil.updateData({
      id: this.count, // 表格id
      name: '询价需求表', // 表格名称，暂时为null
      config: {
        defaultTpl: 12,
        tpls: [
          {
            name: '自定义表格1',
            columns: [ // 这里只配置那些需要显示的列
              {
                title: 'ID', // 列的名称
                width: 70, // 以像素作为单位  or auto
                order: false, // 是否支持排序  true/false
              }
            ]
          }
        ]
      }
    });
  }
  handleDeleteData = () => {
    logger.log("删除记录的id: ", this.count - 1);
    dbUtil.deleteData(this.count - 1);
  }

  handleQueryData = () => {
    dbUtil.queryData().then((results) => {
      logger.log("目前数据库中有的所有数据=====：", results);
    });
  }

  handleGetDataByKey = () => {
    dbUtil.getDataByKey(this.count).then((results) => {
      logger.log("根据 key 值查询记录=====：", results);
    });
  }
  handleClearStore =() => {
    dbUtil.clearStore();
  }

  render() {
    return (
      <div className="content p-t-18">
        <Button type="primary" className="m-r-12" onClick={this.handleInsertData}>InsertData</Button>
        <Button type="primary" className="m-r-12" onClick={this.handleDeleteData}>DeleteData</Button>
        <Button type="primary" className="m-r-12" onClick={this.handleUpdateData}>updateData</Button>
        <Button type="primary" className="m-r-12" onClick={this.handleQueryData}>queryData</Button>
        <Button type="primary" className="m-r-12" onClick={this.handleGetDataByKey}>GetDataByKey</Button>
        <Button type="primary" className="m-r-12" onClick={this.handleClearStore}>ClearStore</Button>
      </div>
    );
  }
}

export default IndexedDBComponent;
