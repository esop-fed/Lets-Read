const iconUrlPrePath = process.env.REACT_WEBPACK_ENV === 'dev' ? '/assets/' : '../';

module.exports = {
  'icon-url': `'${iconUrlPrePath}antfont/iconfont'`,
  'font-size-base': '12px',                   // 字体基础大小
  'border-radius-base': '2px',                // 圆角
  'primary-color': '#149AFA',                 // 主题蓝
  'info-color': '#149AFA',                    // 蓝色
  'success-color': '#00AB27',                 // 绿色
  'error-color': '#FF4848',                   // 红色
  'background-color-light': '#F5F5F5',        // 背景色 - header and selected item
  'background-color-base': '#F5F5F5',         // 背景色 - Default grey background color
  'heading-color': '#404040',                 // 标题色
  'text-color': '#666',                       // 字体色
  'text-color-secondary': '#808080',          // 字体色 - 次要字体
  'border-color-base': '#EBEBEB',             // 常用外border颜色
  'border-color-split': '#EBEBEB',            // 常用内border颜色
  'table-header-bg': '#FAFAFA',               // 表格 - 表头背景色
  'table-row-hover-bg': '#F5F8FA',            // 表格 - hover行背景色
  'input-height-sm': '28px',                  // 表单 - 小input - 高度，因为一一改太麻烦，所以直接在这改变量设置
  'input-addon-bg': '#F5F5F5',                // 表单 - input - addon背景色
  'input-disabled-bg': '#F5F5F5',             // 表单 - input - 背景色 - 不可编辑状态
  'input-border-color': '#EBEBEB',            // 表单 - input - border颜色
  'input-placeholder-color': '#DDD',          // 表单 - input - placeholder字体色
  'btn-height-sm': '28px',                    // 按钮 - 小btn - 高度，因为一一改太麻烦，所以直接在这改变量设置
  'screen-lg': '1280px',                      // TODO: antd2.0版本没有xxl，暂时调整，以后改回来。响应式 - breakpoint
  'screen-xl': '1600px',                      // TODO: antd2.0版本没有xxl，暂时调整，以后改回来。响应式 - breakpoint
};
