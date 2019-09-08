/**
 * 用于生成page目录下所有 index.jsx 所在路径的数组，并写入/app/containers/page/path.json
 */

const fs = require('fs');

const pagelist = [];
const walkSync = dir => {
  const files = fs.readdirSync(dir).sort(); // windows环境下排序
  let pathlist = [];
  files.forEach(file => {
    const childPath = dir + '/' + file;
    if (fs.statSync(childPath).isDirectory()) {
      pathlist = walkSync(childPath, pathlist);
    } else {
      file.endsWith('index.jsx') &&
        pagelist.push(
          childPath.replace(/\.\/app\/containers\/page\//, '').replace(/\/index\.jsx/, '')
        );
    }
  });
  return pathlist;
};

walkSync('./app/containers/page');

fs.writeFileSync('app/containers/page/path.json', JSON.stringify(pagelist, null, '\t'));
