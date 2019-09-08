const f = require('../app/utils/Store/fdsfs.txt');
const pJson = require('../package.json');

console.log(f, '555');

const fs = require('fs');

fs.readFile('../app/utils/Store/fdsfs.txt', 'utf-8', function(err, data) {
    console.log(data);
});

const T_CUSTOM_TABLE = "read_table"; // test 表
// const dbUtil = wrapperTableName(T_CUSTOM_TABLE);
//
// dbUtil.queryData().then((data) => {
//     console.log(data, '5555555555555');
// });
