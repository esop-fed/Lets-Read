import React from 'react';
import { Row, Col, message, Button, Spin, Dropdown, Menu, Empty, Icon } from 'antd';
import _ from 'lodash';

import Editor from 'for-editor';
import { saveAs } from 'file-saver';
import { IndexedDB , msgCenter, API } from 'utils';
import { Tree } from 'components';
import { readList } from './readList';

import styles from './index.scss';

const { wrapperTableName } = IndexedDB;

const T_CUSTOM_TABLE = "read_table"; // test 表
const dbUtil = wrapperTableName(T_CUSTOM_TABLE);

export default class Main extends React.Component {
    api = new API('auth');
    state = {
        value: '',
        selectData : {},
        expand: true,
        spinning: false
    };

    handleChange = (value) => {
        this.setState({
            value
        });
    };

    componentDidMount = () => {
        msgCenter.subscribe('initialDbSuccess', () => {
            dbUtil.queryData().then( (data) => {
                this.api.get('/api/message')
                    .then((res) => {
                        if (res.data) {
                            for (let id in res.data) {
                                let currentData = _.find(data, ['id', id]);
                                if (_.isObject(res.data[id])) {
                                    if (currentData) {
                                        if (currentData.date < res.data[id].date) {   // json日期大于本地存储日期更新
                                            dbUtil.updateData(res.data[id])
                                        }
                                    } else {
                                        dbUtil.insertData(res.data[id]);
                                    }
                                }
                            }
                        }
                    });
            });
        });
    };

    componentWillUnmount() {
        msgCenter.unsubscribe('initialDbSuccess')
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
        if (!link) return <Empty image={<Icon type="smile" theme="twoTone" />} description='请选择一篇文章'/>;

        return <iframe src={link} width='100%' height='100%'/>;
    };

    handleOpen = (data) => {
        const { link } = data;
        if (link) window.open(link);
    };

    handleSaveAll = () => {
        this.setState({ spinning: true });

        dbUtil.queryData().then(async (data) => {
            const allData = {};
            data && data.forEach((item) => {
                allData[item.id] = item;
            });

            try {
                await this.api.post("/api/message", allData)
            } catch (e) {
                message.error(e.toString());
            }

            message.success("保存成功");
            this.setState({ spinning: false });

        })
    };

    handleSave = async (value) => {
        this.setState({ spinning: true });
        const { id, pId } = this.state.selectData;
        if (!id || id === pId) {
            message.error('选择一篇文章呦');
            return;
        }

        let newData = {
            id,
            value,
            date: +new Date()
        };

        try {
            await this.api.post("/api/message", { [id]: newData });
        } catch (e) {
            message.error(e.toString());
        }

        this.setState({ spinning: false });

        dbUtil.queryData().then((data) => {
            let currentData = _.find(data, ['id', id]);

            if (currentData) {
                dbUtil.updateData(newData).then(() => {
                    message.success('保存成功');
                    this.editNode.setState({ preview: true});
                });
            } else {
                dbUtil.insertData(newData).then(() => {
                    message.success('保存成功');
                    this.editNode.setState({ preview: true});
                });
            }
        });
    };

    produceJson = () => {
        dbUtil.queryData().then((data) => {
            let file = new File([JSON.stringify(data)], `read.json`, {type: "text/plain;charset=utf-8"});

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
        const { value, selectData, expand, spinning } = this.state;
        const { link } = selectData;

        return (
            <Spin spinning={spinning}>
                <Row className={styles.root}>
                    <Col span={expand ? 3 : 1}>
                        <Tree treeData={readList} rightable onOpen={this.handleOpen} onSelect={this.handleSelect}/>
                        {
                            expand ? <span className='expand' onClick={this.handleShrink}>&lt;</span> : <span className='expand' onClick={this.handleExpand}>&gt;</span>
                        }
                    </Col>
                    <Col span={expand ? 11 : 13}>
                        { this.renderIframe(selectData) }
                    </Col>
                    <Col span={10}>
                        {
                            !link ? null : <React.Fragment>
                                <Editor value={value} ref={(node) => { this.editNode = node; }} className="editor" preview onSave={this.handleSave} onChange={this.handleChange}/>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="1" disabled onClick={this.handleSaveAll}>
                                                全部保存
                                            </Menu.Item>
                                            <Menu.Item
                                                key="2"
                                                onClick={this.produceJson}
                                            >
                                                生成JSON
                                            </Menu.Item>
                                        </Menu>
                                    }>
                                    <Button className="button" type='primary'>操作</Button>
                                </Dropdown>
                            </React.Fragment>
                        }
                    </Col>
                </Row>
            </Spin>
        );
    }
}
