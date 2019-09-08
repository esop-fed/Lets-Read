 /**
 * 1. 定义数据库相关的变量
 * 2. 初始化数据库 database
 * 3. 创建数据表 objectStore
 * 4. 删除数据表
 * 4. 增加记录 object
 * 5. 修改记录
 * 6. 删除记录
 * stores - objectStore - tables
 * storeName - storeNames
 */
let _db = null;
const _dbName = 'ibor_db'; // test_db数据库
const _dbVersion = 1;
const T_CUSTOM_TABLE = "read_table"; // test 表

/**
 * 相当于建表和定义表结构
 * @param {*} db 数据库
 * @param {*} storeName 表名（objectStore name)
 */
const _initStore = (db, storeName) => {
  if (db.objectStoreNames.contains(storeName)) {
    return;
  }
  let objectStore = db.createObjectStore(storeName, {
    keyPath: "id",
    autoIncrement: false
  });
  objectStore.createIndex("name", "name", {
    unique: false
  });
};

/**
 * 初始化 IndexedDB
 */
const initIndexedDB = (cb) => {
  // 获取到indexedDB实例,若为新（子）窗口，则取父窗口的 indexedDB 实例(保证只打开一次 indexedDB)
  let indexedDB = window.indexedDB;
  if (indexedDB.IBORDB) {
    return;
  }
  // 初始IndexDB
  let request = indexedDB.open(_dbName, _dbVersion);
  request.onerror = function (e) {
    console.log('error to open DB', e);
  };
  request.onsuccess = function (e) {
    console.log("success to open DB");
    _db = e.target.result;
    indexedDB.IBORDB = _db;
    cb && cb();
  };
  request.onupgradeneeded = function (e) {
    let db = e.target.result;
    _initStore(db, T_CUSTOM_TABLE); // 创建 objectStore
  };
};

/**
 * 返回 storeName 对应的 table(objectStore)
 * @param {*} storeName 表名
 * @param {*} mode 模式
 */
const _store = (storeName, mode = 'readwrite') => {
  return new Promise((resolve) => {
    let dbInstance = window.indexedDB.IBORDB || window.opener.indexedDB.IBORDB; // 在子窗口操作 indexedDB
     let objectStore = dbInstance.transaction([storeName], mode).objectStore(storeName);
    resolve(objectStore);
  });
};

/**
 * 清空数据表数据（objectStore）
 * @param {*} storeName
 */
const clearStore = (storeName) => {
  _store(storeName).then((objectStore) => {
    objectStore.clear();
  });
};

/**
 * 1. 校验
 * 2. 执行插入
 * 3. 返回 promise 格式：result = { code: 200/500, data: {}， msg: “” }
 * @param {*} storeName 表名
 * @param {*} data 插入的数据
 */
const insertData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    _store(storeName).then((objectStore) => {
      let request = objectStore.add(data);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    }).catch((e) => {
      reject(e);
    });
  });
};

/**
 * 获取表中相应数据
 * @param {*} storeName 表名
 * @param {*} key 对应数据表记录
 * 1. 校验
 * 2. 取数据
 * 3. 返回
 */
const getDataByKey = (storeName, key) => {
  return new Promise((resolve, reject) => {
    _store(storeName).then((objectStore) => {
      let request = objectStore.get(key);
      request.onsuccess = (e) => {
        resolve(e.target.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    }).catch((e) => {
      reject(e);
    });
  });
};

/**
 * 更新表数据
 * @param {*} storeName 表名
 * @param {*} data 更新数据记录
 */
const updateData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    _store(storeName).then((objectStore) => {
      let request = objectStore.put(data);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    })
    .catch((e) => {
      reject(e);
    });
  });
};

/**
 * 删除一条记录
 * @param {*} storeName
 * @param {*} key
 */
const deleteData = (storeName, key) => {
  return new Promise((resolve, reject) => {
    _store(storeName).then((objectStore) => {
      let request = objectStore.delete(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    }).catch((e) => {
      reject(e);
    });
  });
};

/**
 * 查询该 objectStore 所有数据记录
 * @param {*} storeName 表名
 */
const queryData = (storeName) => {
  return new Promise((resolve, reject) => {
    _store(storeName).then((objectStore) => {
      let request = objectStore.openCursor();
      let results = [];
      request.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = (e) => {
        reject(e);
      };
    }).catch((e) => {
      reject(e);
    });
  });
};

const wrapperTableName = (tableName) => {
  return {
    insertData: (...args) => { return insertData(tableName, ...args); }, // 插入一条数据
    getDataByKey: (...args) => { return getDataByKey(tableName, ...args); }, // 根据 key 获取一条数据
    updateData: (...args) => { return updateData(tableName, ...args); }, // 更新一条数据
    deleteData: (...args) => { return deleteData(tableName, ...args); }, // 删除一条数据
    queryData: () => { return queryData(tableName); }, // 查询表数据
    clearStore: () => { clearStore(tableName); } // 清空表数据
  };
};

export {
  initIndexedDB,
  wrapperTableName
};

export default {
  initIndexedDB,
  wrapperTableName
};
