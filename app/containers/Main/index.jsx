import React from 'react';
import { Row, Col, Spin, Empty, Icon } from 'antd';

import Editor from 'for-editor';
import { Tree } from 'components';
import { readList } from './readList';

import styles from './index.scss';

const toolbar = {
    h1: false, // h1
    h2: false, // h2
    h3: false, // h3
    h4: false, // h4
    img: false, // 图片
    link: false, // 链接
    code: false, // 代码块
    preview: false, // 预览
    expand: true, // 全屏
    /* v0.0.9 */
    undo: false, // 撤销
    redo: false, // 重做
    save: false, // 保存
    /* v0.2.3 */
    subfield: false, // 单双栏模式
};

export default class Main extends React.Component {
    // api = new API('auth');
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

    handleSelect = (selectData) => {
        this.setState({
            selectData
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

    // handleSaveAll = () => {
    //     this.setState({ spinning: true });
    //
    //     dbUtil.queryData().then(async (data) => {
    //         const allData = {};
    //         data && data.forEach((item) => {
    //             allData[item.id] = item;
    //         });
    //
    //         try {
    //             await this.api.post("/api/message", allData)
    //         } catch (e) {
    //             message.error(e.toString());
    //         }
    //
    //         message.success("保存成功");
    //         this.setState({ spinning: false });
    //
    //     })
    // };

    // handleSave = async (value) => {
    //     this.setState({ spinning: true });
    //     const { id, pId } = this.state.selectData;
    //     if (!id || id === pId) {
    //         message.error('选择一篇文章呦');
    //         return;
    //     }
    //
    //     let newData = {
    //         id,
    //         value,
    //         date: +new Date()
    //     };
    //
    //     try {
    //         await this.api.post("/api/message", { [id]: newData });
    //     } catch (e) {
    //         message.error(e.toString());
    //     }
    //
    //     this.setState({ spinning: false });
    //
    //     dbUtil.queryData().then((data) => {
    //         let currentData = _.find(data, ['id', id]);
    //
    //         if (currentData) {
    //             dbUtil.updateData(newData).then(() => {
    //                 message.success('保存成功');
    //                 this.editNode.setState({ preview: true});
    //             });
    //         } else {
    //             dbUtil.insertData(newData).then(() => {
    //                 message.success('保存成功');
    //                 this.editNode.setState({ preview: true});
    //             });
    //         }
    //     });
    // };

    // produceJson = () => {
    //     dbUtil.queryData().then((data) => {
    //         let file = new File([JSON.stringify(data)], `read.json`, {type: "text/plain;charset=utf-8"});
    //
    //         saveAs(file);
    //     });
    // };

    handleShrink = () => {
        this.setState({ expand: false });
    };
    handleExpand = () => {
        this.setState({ expand: true });
    };

    render() {
        const { selectData, expand, spinning } = this.state;
        const { link, md } = selectData;

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
                            !link ? null : <Editor preview toolbar={toolbar} value={require(`containers/markdownList/${md}`).default} className="editor"/>
                        }
                    </Col>
                </Row>
            </Spin>
        );
    }
}
