/**
 * 工具库，专用于处理数据转化
 */
import MobX from 'mobx';
import { Form } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import cryptoSha256 from 'crypto-js/sha256';
import cryptoUtf8 from 'crypto-js/enc-utf8';
import cryptoBase64 from 'crypto-js/enc-base64';

const toTreeData = (dataList = [], config = {}) => {
    const _extendTreeDataProp = (items, extProp = {}) => {
        items.forEach((item) => {
            const children = config.expand ? item.children : item.items;
            for (let p in extProp) {
                const val = extProp[p];
                if (typeof val === 'function') {
                    item[p] = val(item);
                } else {
                    item[p] = val;
                }
                if (children instanceof Array) {
                    _extendTreeDataProp(children, extProp);
                }
            }
        });
    };
    let items = [];
    let item = null;
    let idMap = {}; // key:id,value:item
    const { expand = false } = config; // 标记是否在处理时将数据平铺
    // 将所有的菜单保存到idMap,如果是一级菜单，还要存放到items数组
    for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i];
        item = {};
        if (expand) { // 支持对象属性平铺，也即不要将剩余的属性放到data数量里面
            Object.assign(item, row);
            item.id = `${row.id}`;
        } else {
            item.id = `${row.id}`;
            item.name = row.name;
            item.data = Object.assign({}, row);
        }

        if (row.id == row.pId || !row.pId || row.pId == "0") {
            items.push(item);
        }
        idMap[row.id] = item;
    }
    // 遍历所有的非一级菜单，找到它们的父节点，并存放到父节点的items属性下
    for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i];
        if (row.id == row.pId || !row.pId || row.pId == "0") {
            continue;
        }
        let pitem = idMap[row.pId];
        item = idMap[row.id];
        if (pitem) {
            if (expand) {
                if (!pitem.children) {
                    pitem.children = [];
                }
                pitem.children.push(item);
            } else {
                if (!pitem.items) {
                    pitem.items = [];
                }
                pitem.items.push(item);
            }
        }
    }
    // 根据配置增加属性
    if (config.extProp) {
        _extendTreeDataProp(items, config.extProp);
    }

    return items;
};

/**
 * 解析url的search，返回kv对
 */
const analysisUrlSearch = (search) => {
    let pathParams = search.split('?')[1];
    if (!pathParams) return new Map();

    let pathParamsArr = pathParams.split('&');
    let result = pathParamsArr.map((item) => {
        return item.split('=');
    });

    return new Map(result);
};

/**
 * 使用 lodash 对比两个真实数组是否相同
 * 由于 ims 系统当中引用了 mobx 的观察者开发模式
 * 所以在使用被观察数组数据时要将其转为正常数组再进行其他操作
 * @param arr1
 * @param arr2
 * @returns {boolean}
 */
const isArrayEqual = (arr1, arr2) => {
    const _toRealArray = (convertArray = []) => {
        if (MobX.isObservableArray(convertArray)) {
            return convertArray.slice();
        } else {
            return convertArray;
        }
    };
    return _.isEqual(_toRealArray(arr1), _toRealArray(arr2));
};

/**
 * 将单个值或某个数组内的所有值转成字符串
 * 主要是为了兼容外部传入 value/defaultValue 等值时可以直接传数字类型
 * @param values
 * @returns {*}
 */
const valuesToStrings = (values) => {
    // 如果是空，则返回
    if (values === null) {
        return values;
    }
    if (!_.isUndefined(values)) {
        if (_.isInteger(values)) { // 数字类型直接转成字符类型
            values += '';
        } else if (!_.isString(values)) { // 非数字非字符类型, 剩下的类型视为数组类型 Array | ObservableArray
            values = values.map((value) => { // 将数组内所有值转成字符类型
                if (typeof value === 'object') {
                    return value; // 如果项为对象则直接返回
                }
                return value + '';
            });
        }
    }
    return values;
};

/**
 * 用于生成 input 的值对应的唯一哈希值
 * @param input
 * @return {string}
 */
const generateHash = (input) => {
    let I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    let hash = 5381;
    let i = input.length - 1;

    if (typeof input === 'string') {
        for (input.length - 1; i > -1; i--) {
            hash += (hash << 5) + input.charCodeAt(i);
        }
    } else {
        for (; i > -1; i--) {
            hash += (hash << 5) + input[i];
        }
    }

    let value = hash & 0x7FFFFFFF;
    let retValue = '';

    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
};

// 解析参数
const _parseItemValue = (value, dataType) => {
    const dateStart = "start";
    const dateEnd = "end";
    const formatDate = (date, format) => {
        try {
            return date.format(format);
        } catch (e) {
            logger.error('parse value error', date, dataType);
            return date && date.toString();
        }
    };

    const getDateStamp = (date, stampType) => {
        try {
            switch (stampType) {
                case dateStart:
                    return date.set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 })
                        .valueOf();
                case dateEnd:
                    return date.set({ 'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999 })
                        .valueOf();
                default:
                    return date.valueOf();
            }
        } catch (e) {
            logger.error('parse value error', date, dataType);
            return date && date.toString();
        }
    };

    let format = null;
    let isRange = false;
    switch (dataType) {
        case 'array':
            if (!(value instanceof Array)) {
                value = [value];
            }
            return value;
        case 'boolean':
            return value ? 1 : 0;
        case 'daterange':
            isRange = true;
        case 'date':
            format = 'YYYY-MM-DD';
            break;
        case 'datetimerange':
            isRange = true;
        case 'datetime':
            format = "YYYY-MM-DD HH:mm:ss";
        case 'timerange':
            isRange = true;
        case 'time':
            // 日期类型格式化
            format = "HH:mm:ss";
        case 'timestamprange':
            isRange = true;
            break;
        case 'timestamp':
            return getDateStamp(value);
        case 's_timestamp':
            return getDateStamp(value, dateStart);
        case 'e_timestamp':
            return getDateStamp(value, dateEnd);
        case 'datestamp':
            return getDateStamp(value);
        default:
            logger.error('not support this type ', dataType);
            return value;
    }

    // 如果是范围格式的
    if (isRange) {
        if (value instanceof Array) {
            if (!format) {
                return value.map((item) => {
                    return getDateStamp(item);
                });
            } else {
                return value.map((item) => {
                    return formatDate(item, format);
                });
            }
        } else {
            logger.error('parse value error', value, dataType);
            return value;
        }
    } else {
        return formatDate(value, format);
    }
};

// 对象变参，每一个都是一个key-valule形式的对象
const buildFilterParams = (...args) => {
    const buildFieldRule = (key, value) => {
        const fields = key.split("-");
        const vals = [];
        if (fields.length === 1) {
            vals.push(value);
        } else {
            vals.push(...value);
        }
        return fields.map((field, i) => {
            let $$index = field.indexOf('$$');
            if ($$index > -1) {
                // 需再次解析的字段，例如 startTime$lte$$timestamp@date
                // 根据@后面的数据类型解析
                let dateType = field.substring($$index + 2); // timestamp@date
                value = _parseItemValue(vals[i], dateType);
                field = field.substring(0, $$index); // startTime$lte
            } else {
                value = vals[i];
            }
            let $index = field.indexOf('$');
            let op = 'eq';
            if ($index > -1) {
                op = field.substring($index + 1); // lte
                if (op.endsWith('Ex')) { // status$inEx => status$in
                    op = op.substring(0, op.length - 2);
                }
                field = field.substring(0, $index); // startTime
            }
            return { field: field, op: op, value: value };
        });
    };

    const _params = _.assign({}, ...args);
    const filterGroup = { op: 'and', groups: [{ op: 'and', rules: [] }] };
    const searchRule = {};
    for (let key in _params) {
        switch (key) {
            case 'page':
            case 'pageSize':
            case 'orderBy':
            case 'distinct':
                // 分页或者排序字段
                searchRule[key] = _params[key];
                break;
            case '$$or':
                const orGroups = { op: 'or', groups: [] };
                filterGroup.groups.push(orGroups);
                const orParams = _.isArray(_params[key]) ? _params[key] : [_params[key]]; // convert to Array
                orParams.forEach((orParamsItem) => {
                    const newGroupItem = { op: 'and', rules: [] };
                    orGroups.groups.push(newGroupItem);
                    for (let orKey in orParamsItem) {
                        newGroupItem.rules.push(...buildFieldRule(orKey, orParamsItem[orKey]));
                    }
                });
                break;
            default:
                const value = _params[key];
                if (value != null) {
                    filterGroup.groups[0].rules.push(...buildFieldRule(key, value));
                }
        }
    }

    return { filterGroup, searchRule };
};

// 表单参数解析
const mapPropsToFields = (data = {}, config = {}) => {
    const getFieldValue = (val, fieldConfig) => {
        const { dataType, format } = fieldConfig;
        switch (dataType) {
            case 'date':
            case 'datetime':
            case 'time':
            case 'timestamp':
            case 's_timestamp':
            case 'e_timestamp':
            case 'datestamp':
            case 'daterange':
            case 'datetimerange':
            case 'timerange':
            case 'timestamprange':
                try {
                    if (format) {
                        return moment(val, format);
                    } else {
                        return moment(val);
                    }
                } catch (e) {
                    logger.error('propToFieldValue error', val, fieldConfig);
                    return val;
                }
            case 'array':
            case 'arrayStr':
                return _.isEmpty(val) ? [] : val.split(",");
            case 'boolean':
                const { trueValue = 1 } = fieldConfig;
                return val === trueValue;
            default:
                logger.error('not support this type ', dataType);
                return val;
        }
    };
    // 获取参数名
    const getFieldName = (key, fieldConfig) => {
        let { field, innerField, dataType } = fieldConfig;
        if (field) {
            // field = 'def'
            // key = 'abc' => 'def'
            return field;
        }
        if (innerField) {
            // field = 'taskId'
            // key = 'id' => 'taskId'
            // key = 'tasks[0].id' => 'tasks[0].taskId'
            if (key.indexOf('.') > -1) {
                // 此处使用 replace 替换时如果出现 $$ 字符会被认为是直接量符号，因为先将匹配的字符串替换为空再加上 innerField
                return _.replace(key, key.substr(_.lastIndexOf(key, '.') + 1), '') + innerField;
            } else {
                return innerField;
            }
        }
        if (dataType) {
            return key + '$$' + dataType;
        }
        return key;
    };

    const parseFieldValue = (fieldObj, key, value, fieldConfig) => {
        // 在 fieldConfig.noExpand 属性值不为真的情况下 且 值是数组或者对象，需解析成 a[0].b = 1 或者 c.d = 1的形式
        if (!(fieldConfig && fieldConfig.noExpand) && typeof value === 'object') {
            if (value instanceof Array) { // a:[{b:1}] => a[0].b = 1
                for (let i = 0; i < value.length; i++) {
                    let newKey = key + '[' + i + ']';
                    parseFieldValue(fieldObj, newKey, value[i], fieldConfig && fieldConfig[i]);
                }
            } else { // Object a:{b:1} => a.b = 1
                for (let p in value) {
                    let newKey = key + '.' + p;
                    parseFieldValue(fieldObj, newKey, value[p], fieldConfig && fieldConfig[p]);
                }
            }
        } else { // string/number/...
            if (fieldConfig) {
                let val = getFieldValue(value, fieldConfig);
                const { field = key, rangeIndex } = fieldConfig;
                let realKey = getFieldName(key, fieldConfig);
                if (field) {
                    if (rangeIndex != null) {
                        let { [realKey]: arrValues = { value: [] } } = fieldObj;
                        arrValues.value[rangeIndex] = val;
                        fieldObj[realKey] = Form.createFormField(arrValues);
                    } else {
                        fieldObj[realKey] = Form.createFormField({ value: val });
                    }
                }
            } else {
                fieldObj[key] = Form.createFormField({ value: value });
            }
        }
    };

    let fieldObj = {};
    let entries = Object.entries(data);
    for (let entry of entries) {
        let [key, value] = entry;
        if (value != null) {
            let fieldConfig = config[key];
            parseFieldValue(fieldObj, key, value, fieldConfig);
        }
    }
    return fieldObj;
};

const buildFormData = (formData = {}) => {
    let _formData = {};
    let entries = Object.entries(formData);
    for (let entry of entries) {
        let [key, value] = entry;
        const vals = [];
        const fields = key.split('-');// startTime$$timestamp-endTime$$timestamp
        if (fields.length === 1) {
            vals.push(value);
        } else {
            value = value || [];
            vals.push(...value);
        }
        fields.forEach((field, i) => {
            let $$index = field.indexOf('$$');
            if ($$index > -1) {
                // 传给接口的字段特殊处理
                let dataType = field.substring($$index + 2);
                let tempValue = vals[i];

                // 如果当前对象类型为数组
                if (dataType === "array" && tempValue instanceof Array) {
                    vals[i] = tempValue.map((temp) => {
                        // 如果元素为对象，则进行递归编译子参数
                        if (temp instanceof Object) {
                            temp = buildFormData(temp);
                        }
                        return temp;
                    });
                } else {
                    vals[i] = _parseItemValue(tempValue, dataType);
                }
                field = field.substring(0, $$index);
            }
            _formData[field] = vals[i];
        });
    }
    return _formData;
};

const format = 'YYYY-MM-DD';

function formatYYYYMMDD(value) {
    return moment(new Date(value))
        .format(format);
}

const sha256Encode = (value) => {
    return cryptoSha256(value)
        .toString();
};

const base64Encode = (value) => {
    return cryptoBase64.stringify(cryptoUtf8.parse(value));
};

export {
    toTreeData,
    isArrayEqual,
    valuesToStrings,
    generateHash,
    buildFilterParams,
    mapPropsToFields,
    buildFormData,
    analysisUrlSearch,
    formatYYYYMMDD,
    sha256Encode,
    base64Encode
};

export default {
    toTreeData,
    isArrayEqual,
    valuesToStrings,
    generateHash,
    buildFilterParams,
    mapPropsToFields,
    buildFormData,
    analysisUrlSearch,
    formatYYYYMMDD,
    sha256Encode,
    base64Encode
};
