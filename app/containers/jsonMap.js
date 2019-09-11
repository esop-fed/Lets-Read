import jsonListArr from './path.json';

const json = [];
jsonListArr.map((item) => {
    let content = require(`containers/markdownJsonList/${item}`);
    json.push(content);
});

export default json;