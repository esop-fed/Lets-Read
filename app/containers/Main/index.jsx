import React from 'react';
import { Row, Col, message, Button } from 'antd';
import _ from 'lodash';

import Editor from 'for-editor';
import { saveAs } from 'file-saver';
import { IndexedDB , msgCenter } from 'utils';
import { Tree } from 'components';
import treeData from './readList.json';

import styles from './index.scss';

import './markdown.scss';

const json = require('./markownList.json');

const { wrapperTableName } = IndexedDB;

const T_CUSTOM_TABLE = "read_table"; // test 表
const dbUtil = wrapperTableName(T_CUSTOM_TABLE);

export default class Main extends React.Component {
    state = {
        value: '',
        selectData : {},
        expand: true,
    };

    handleChange = (value) => {
        this.setState({
            value
        });
    };

    componentDidMount() {
        msgCenter.subscribe('initialDbSuccess', () => {
            if (json && json.length) {
                dbUtil.clearStore();
                json.forEach((item) => {
                    dbUtil.insertData({
                        id: item.id, // 表格id
                        value: item.value
                    }).then(() => {
                        this.forceUpdate();
                    });
                });
            }
        });
    }

    componentWillUnmount() {
        msgCenter.unsubscribe("initialDbSuccess");
    }

    handleSelect = (selectData) => {
        this.setState({
            selectData
        });
        dbUtil.queryData().then((data) => {
            let currentData = _.find(data, ['id', selectData.id]);
            if (currentData) this.setState({ value: currentData.value });
            else this.setState({ value: '' });
        });
    };

    renderIframe = (data) => {
        const { link } = data;
        if (!link) return null;

        return <iframe src={link} width='100%' height='100%'/>;
    };

    handleOpen = (data) => {
        const { link } = data;
        if (link) window.open(link);
    };

    handleSave = (value) => {
        const { id } = this.state.selectData;
        if (!id) return;
        dbUtil.queryData().then((data) => {
            let currentData = _.find(data, ['id', id]);
            if (currentData) {
                currentData.value = value;
                dbUtil.updateData({
                    id, // 表格id
                    value
                }).then(() => {
                    message.success('保存成功');
                    this.editNode.setState({ preview: true});
                });
            } else {
                dbUtil.insertData({
                    id, // 表格id
                    value
                }).then(() => {
                    message.success('保存成功');
                    this.editNode.setState({ preview: true});
                });
            }
        });
    };

    produceJson = () => {
        dbUtil.queryData().then((data) => {
            let file = new File([JSON.stringify(data)], "read.json", {type: "text/plain;charset=utf-8"});

            saveAs(file);
        });
    };

    handleShrink = () => {
        this.setState({ expand: false });
    };
    handleExpand = () => {
        this.setState({ expand: true });
    };

    render() {
        const { value, selectData, expand } = this.state;

        return <Row className={styles.root}>
            <Col span={expand ? 3 : 1}>
                <Tree treeData={treeData} rightable onOpen={this.handleOpen} onSelect={this.handleSelect}/>
                {
                    expand ? <span className='expand' onClick={this.handleShrink}>&lt;</span> : <span className='expand' onClick={this.handleExpand}>&gt;</span>
                }
            </Col>
            <Col span={expand ? 11 : 13}>
                { this.renderIframe(selectData) }
            </Col>
            <Col span={10}>
                <Editor value={value} ref={(node) => { this.editNode = node; }} className="editor" preview onSave={this.handleSave} onChange={this.handleChange}/>
                <Button className="button" type='primary' onClick={this.produceJson}>生成JSON</Button>
            </Col>
        </Row>;
    }
}
