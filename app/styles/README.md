

### 文件目录

```json
 |__ styles 
   |__ themes - 主题样式，仅包含跟主题相关的样式，例如背景色、背景图片
     |__ default.scss 
     |__ jsfund.scss
   |__ _reset.scss - 重置基础的样式（包含normalize：http://necolas.github.io/normalize.css/)
   |__ _variables.scss - 除颜色外基本变量
   |__ _motions.scss - 动画相关样式类
   |__ core - 核心文件夹
     |__ tools - 工具类集
       |__ _clearfix.scss - 清空浮动
       |__ _flex.scss - flex 布局相关
       |__ _colors.scss - 颜色变量
       |__ _mixins.scss - 需要include及extend引入的都放在这里(如字数过多做省略处理的ellipsis(@mixin, %)), 负责功能方面的文件
       |__ _utilities.scss - 辅助类，单一用途样式类
       |__ _index.scss
       |__ iconfont - 文字图标
         |__ antfont - 蚂蚁组件 iconfont
         |__ font 
         |__ index.css 
   |__ ext - 扩展文件夹
      |__ overwrite - 覆盖组件样式类
        |__ _antd.scss - 蚂蚁组件
        |__ _other.scss - 其他组件
      |__ _common.scss - 业务共用样式类
      |__ _form.scss - form 相关
      |__ _table.scss - table 相关
      |__ index.scss
      |__ layout.scss - 布局相关
   |__ index.scss 
  
```

### 特别注意

1. 编写单一用途类可不用加空间名（即放在 utilities 文件内），其他属于框架全局样式类，需要添加空间名。