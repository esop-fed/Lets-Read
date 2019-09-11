### 注意事项


1.所有列表维护在 `readList.js `里面；

```json
{
    "id": 2,
    "name": "xxxxxxx",
    "pId": 1,
    "disabledContext": true,   // 禁用右键菜单
    "contextMenuKeys": ["open"],  // 右键菜单配置（打开）
    "link": "https://segmentfault.com/a/1190000020305603"  // 链接
}
```

2.写完文档之后保存, 生成`json`文件，生成的json文件名称是文章的Id生产的，生成后将json文件放到`markdownJsonList`文件下(已有文件名则进行覆盖)；
将所有的json List读取在 `path.json`中；最后并且执行`npm run dist`打包，在合并代码

