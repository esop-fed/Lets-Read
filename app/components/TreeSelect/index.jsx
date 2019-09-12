import React from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import { PropTypes as MobxPropTypes } from "mobx-react";
import _ from 'lodash';
import Util from 'utils/util';

require('./index.scss');

class TreeSelectComponent extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.api = new API(props.treeSite);
    // }

    state = {
        inputValue: '', // 搜索文字受控
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
        // 判断如果存在 value 属性, 且当 value 从有到无时(视为清空)清空 inputValue 值
        if ('value' in nextProps && nextProps.multiple) {
            if (_.isUndefined(nextProps.value) && !_.isEqual(this.props.value, nextProps.value)) {
                this.setState({ inputValue: '' });
            }
        }
        // 一旦 treeSite 有变化，重新赋值 this.api
        // if (nextProps.treeSite && this.props.treeSite !== nextProps.treeSite) {
        //     this.api = new API(nextProps.treeSite);
        // }
        if (nextProps.forceUpdateTree
            || this.shouldUpdateWhenMainPropsChange(nextProps)) {
            this.updateWhenMainPropsChange = true;
            // 如果判断到 notFoundContent 属性有变化, 则进行一次强制刷新, 防止请求数据后前后数据仍然一致导致无法重新 render 的 bug
            if (!_.isEqual(this.props.notFoundContent, nextProps.notFoundContent)) {
                this.forceUpdate();
            }
            this.initTreeData(nextProps);
        } else {
            this.updateWhenMainPropsChange = false;
        }
    }

    /**
     * 如果是 props 的改变造成的更新则不进行重新的 render
     * 因为 componentWillReceiveProps 里已经进行了 setState 操作
     * 如果 forceUpdateTree 属性为 true 则会强制重新渲染组件
     * @param nextProps
     * @param nextState
     * @returns {boolean}
     */
    // TODO 应该移除此判断
    // 此处存在 bug ,当既有 main props 变化也有非 main props 的变化时, 在 main props 请求数据返回一样的情况下(比如均为空数组), 不会造成重新 render, 这个时候非 main props 的变化会被忽略
    shouldComponentUpdate(nextProps, nextState) {
        return this.shouldUpdateWhenStateChange(nextState) || !this.updateWhenMainPropsChange;
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
    onChange = (value, label, extra) => {
        logger.log("value:", value);
        this.props.onChange(value, label, extra);
    };
    onSearch = (inputValue) => {
        logger.log("search value:", inputValue);
        this.setState({ inputValue });
    };
    handleTreeData = (treeData) => {
        const config = {
            expand: true,
            extProp: {
                value: (item) => {
                    return item.id;
                },
                label: (item) => {
                    return item.name;
                },
                key: (item) => {
                    return item.id;
                },
            }
        };

        let { disabledValues, hiddenValues, shouldDisableCheckbox } = this.props;
        disabledValues = Util.valuesToStrings(disabledValues);
        hiddenValues = Util.valuesToStrings(hiddenValues);

        if (hiddenValues.length) {
            treeData = treeData.filter((item) => {
                return !hiddenValues.includes(`${item.id}`);
            });
        }

        treeData.forEach((item) => {
            if (disabledValues.includes(`${item.id}`)) {
                item.disabled = true;
            }
            _.isFunction(shouldDisableCheckbox) && (item.disableCheckbox = shouldDisableCheckbox(item));
        });

        return Util.toTreeData(treeData, config);
    };

    render() {
        let { treeData, inputValue } = this.state;
        let { defaultValue, value, treeDefaultExpandedKeys, preHandleTreeData, notFoundContent } = this.props;
        const treeDataLength = treeData.length;

        defaultValue = Util.valuesToStrings(defaultValue);
        value = Util.valuesToStrings(value);
        treeDefaultExpandedKeys = Util.valuesToStrings(treeDefaultExpandedKeys);

        treeData && (treeData = preHandleTreeData(treeData));
        treeData && (treeData = this.handleTreeData(treeData));

        const props = {
            size: 'small',
            defaultValue,
            inputValue,
            treeDefaultExpandedKeys,
            treeData,
            onChange: this.onChange,
            onSearch: this.onSearch,
            style: { width: '100%' }
        };

        // 当 this.props.value 不为空时才能传入 value 这个字段到 Select 组件, 不然会导致默认显示出 bug
        !_.isUndefined(value) && (props.value = value);

        return (
            treeDataLength ? <TreeSelect {...this.props} {...props}/> :
                <TreeSelect size="small" key="empty-tree-select" notFoundContent={notFoundContent}
                            style={{ width: "100%" }}/>
        );
    }
}

TreeSelectComponent.propTypes = {
    treeData: PropTypes.oneOfType([
        PropTypes.array,
        MobxPropTypes.observableArray
    ]),
    treeUrl: PropTypes.string,
    treeParams: PropTypes.object,
    treeSite: PropTypes.string,
    forceUpdateTree: PropTypes.bool,
    preHandleData: PropTypes.func,
    disabledValues: PropTypes.array,
    hiddenValues: PropTypes.array,
    shouldDisableCheckbox: PropTypes.func
};
TreeSelectComponent.defaultProps = {
    treeData: [],
    treeParams: {}, // 获取数据过滤参数
    treeSite: 'auth', // 将从指定site获取数据
    preHandleTreeData: (treeData) => {
        return treeData;
    }, // 预处理数据
    disabledValues: [], // 禁用节点id列表
    hiddenValues: [], // 隐藏节点id列表
    // ================= Ant-TreeSelect =================
    showSearch: true,
    notFoundContent: "暂无数据",
    onChange: () => {
    },
    showCheckedStrategy: TreeSelect.SHOW_ALL,
    filterTreeNode: (input, treeNode) => {
        return treeNode.props.title.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0;
    },
    optionFilterProp: "label", // 默认搜索label值
};

export default TreeSelectComponent;
