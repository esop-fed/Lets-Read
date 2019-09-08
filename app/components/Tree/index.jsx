import React from 'react';
import PropTypes from 'prop-types';
import { Icon, message } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';
import Util from 'utils/util';
import SearchTree from './SearchTree';

const styles = require('./index.scss');

class TreeComponent extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.api = new API(props.treeSite);
    // }

    // TODO 可优化初始化render,现在初始化至少有两次render
    state = {
        treeData: []
    };

    componentDidMount() {
        this.initTreeData(this.props);
    }

    /**
     * 判断 props 的更改是否达到了更新组件的条件
     * props 的更新操作不直接造成组件的更新, 而是通过 iniTreeData 中去触发 setState 方法重新渲染组件
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.shouldUpdateWhenMainPropsChange(nextProps)) {
            this.updateWhenMainPropsChange = true;
            this.initTreeData(nextProps);
        } else {
            this.updateWhenMainPropsChange = false;
        }
    }

    /**
     * 如果是 state 的改变引起的更新操作, 则一定会重新渲染组件
     * 如果是 props 的改变造成的更新则不进行重新的 render
     * 因为 componentWillReceiveProps 里已经进行了 setState 操作
     * props 的变化引起的更新行为最终会体现为 state 的更新操作
     * 所以这里只允许 state 的变化引起组件的重新渲染
     * @param nextProps
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.shouldUpdateWhenStateChange(nextState)
            || !this.updateWhenMainPropsChange;
    }

    /**
     * 以下属性有变化即视为 props 的更改会造成组件重新渲染
     * @param nextProps
     * @returns {*|boolean}
     */
    shouldUpdateWhenMainPropsChange = (nextProps) => {
        const { treeData, treeUrl, treeParams } = this.props;
        return (
            !Util.isArrayEqual(treeData, nextProps.treeData)
            || !_.isEqual(treeParams, nextProps.treeParams)
            || treeUrl !== nextProps.treeUrl
        );
    };
    /**
     * 判断是 state 的变化是否会影响组件重新渲染
     * @param nextState
     * @returns {boolean}
     */
    shouldUpdateWhenStateChange = (nextState) => {
        const { treeData } = this.state;
        return !Util.isArrayEqual(treeData, nextState.treeData);
    };
    initTreeData = (props) => {
        const { treeData, treeUrl } = props;
        if (treeData.length) {
            this.setTreeData(treeData);
        } else if (treeUrl) {
            // const params = this.getUrlParams(props);
            // this.api.get(treeUrl, params)
            //     .then((res) => {
            //         if (res.code == 200) {
            //             this.setTreeData(res.data.list);
            //         } else {
            //             message.error(res);
            //         }
            //     });
        }
    };
    setTreeData = (treeData = []) => {
        this.setState({
            treeData
        });
    };
    getUrlParams = (props) => {
        return {
            query: Util.buildFilterParams(props.treeParams)
        };
    };
    handleRefresh = () => {
        const { treeData, onRefresh } = this.props;
        // 如果 treeData 由外部组件传入,则调用外部传入的刷新函数进行刷新
        if (treeData.length) {
            onRefresh();
        } else {
            this.initTreeData(this.props);
        }
    };

    // 获取treeData
    getTreeData = () => {
        return this.state.treeData;
    };

    render() {
        let { treeData } = this.state;
        let {
            showFrame, hiddenValues, disabledValues, disableCheckboxValues,
            title, preHandleTreeData, defaultCheckedKeys, checkedKeys,
            defaultExpandedKeys, expandedKeys, defaultSelectedKeys, selectedKeys
        } = this.props;

        // 将以下数组转成字符串数据以支持外部组件直接传入 int 类型数组
        hiddenValues = Util.valuesToStrings(hiddenValues);
        disabledValues = Util.valuesToStrings(disabledValues);
        disableCheckboxValues = Util.valuesToStrings(disableCheckboxValues);
        defaultCheckedKeys = Util.valuesToStrings(defaultCheckedKeys);
        checkedKeys = Util.valuesToStrings(checkedKeys);
        defaultExpandedKeys = Util.valuesToStrings(defaultExpandedKeys);
        expandedKeys = Util.valuesToStrings(expandedKeys);
        defaultSelectedKeys = Util.valuesToStrings(defaultSelectedKeys);
        selectedKeys = Util.valuesToStrings(selectedKeys);

        const treeFrameClass = classNames({
            [`${styles.tree}`]: true,
            [`${styles['simple-tree']}`]: !showFrame,
            'tree-container': true,
        });

        // 预处理树节点数据,如果外部有传入处理函数的话
        treeData.forEach((item) => {
            item.hidden = hiddenValues.includes(`${item.id}`);
            item.disabled = disabledValues.includes(`${item.id}`);
            item.disableCheckbox = disableCheckboxValues.includes(`${item.id}`);
        });
        treeData = preHandleTreeData(treeData);

        const props = {
            defaultCheckedKeys,
            defaultExpandedKeys,
            defaultSelectedKeys,
            treeData
        };

        // 当 this.props.value 不为空时才能传入 value 这个字段到 Select 组件, 不然会导致默认显示出 bug
        !_.isUndefined(checkedKeys) && (props.checkedKeys = checkedKeys);
        !_.isUndefined(expandedKeys) && (props.expandedKeys = expandedKeys);
        !_.isUndefined(selectedKeys) && (props.selectedKeys = selectedKeys);

        return (
            <div className={treeFrameClass}>
                {showFrame && (
                    <div className={styles.header + ' tree-header'}>
                        <div>
                            {title}
                        </div>
                        <Icon type="reload" onClick={this.handleRefresh} className="btn-reload"/>
                    </div>
                )}
                {treeData.length ? <SearchTree {...this.props} {...props}/> : null}
            </div>
        );
    }
}

TreeComponent.propTypes = {
    showFrame: PropTypes.bool,
    treeData: PropTypes.array,
    treeUrl: PropTypes.string,
    treeParams: PropTypes.object,
    treeSite: PropTypes.string,
    preHandleData: PropTypes.func,
    hiddenValues: PropTypes.array,
    disabledValues: PropTypes.array,
    disableCheckboxValues: PropTypes.array,
};

TreeComponent.defaultProps = {
    showFrame: true, // 是否显示树组件外框(包含标题bar和border)
    treeData: [],
    treeParams: {}, // 获取数据过滤参数
    treeSite: 'auth', // 将从指定site获取数据
    onRefresh: () => {
    },
    preHandleTreeData: (treeData) => {
        return treeData;
    }, // 预处理数据
    hiddenValues: [], // 隐藏树节点列表
    disabledValues: [], // 禁用(不隐藏)树节点列表
    disableCheckboxValues: [] // 禁用checkbox树节点列表
};

export default TreeComponent;
