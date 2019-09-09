### 注意事项


1.所有列表维护在 `readList.json `里面；

```json
{
    "id": 2,
    "code": "001-1",
    "name": "xxxxxxx",
    "pId": 1,
    "disabledContext": true,   // 禁用右键菜单
    "contextMenuKeys": ["open"],  // 右键菜单配置（打开）
    "link": "https://segmentfault.com/a/1190000020305603"  // 链接
}
```

2.写完文档之后必须生成`json`文件，手动复制覆盖 `markownList.json` 文件， 并且执行`npm run dist`打包，在合并代码

