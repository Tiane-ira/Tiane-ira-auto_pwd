# 项目结构说明

## 目录结构

```
auto_pwd/
├── manifest.json              # Chrome扩展程序清单文件
│
├── src/                       # 源代码目录
│   ├── popup.html             # 弹出窗口HTML结构
│   ├── popup.css              # 弹出窗口样式文件
│   ├── popup.js               # 弹出窗口业务逻辑（规则管理）
│   ├── content.js             # 内容脚本（页面元素操作）
│   └── background.js          # 后台服务工作者
│
├── assets/                    # 静态资源目录
│   └── icons/                 # 图标文件
│       ├── icon16.png         # 16x16 图标
│       ├── icon48.png         # 48x48 图标
│       └── icon128.png        # 128x128 图标
│
├── docs/                      # 文档目录
│   ├── README.md              # 项目说明文档
│   └── ICONS.md               # 图标相关说明
│
├── tests/                     # 测试文件目录
│   └── test-page.html         # 插件功能测试页面
│
├── tools/                     # 工具脚本目录
│   └── generate-icons.html    # 图标生成工具（HTML）
│
├── .gitignore                 # Git忽略文件配置
└── PROJECT_STRUCTURE.md       # 本文件（项目结构说明）
```

## 目录说明

### `src/` - 源代码
包含所有插件的核心代码文件：
- **popup.*** - 弹出窗口相关文件，用于规则管理界面
- **content.js** - 内容脚本，注入到网页中执行元素操作
- **background.js** - 后台脚本，处理扩展程序生命周期事件

### `assets/` - 静态资源
存放插件所需的静态资源文件：
- **icons/** - 插件图标文件，不同尺寸用于不同场景

### `docs/` - 文档
项目文档和说明文件：
- **README.md** - 项目主要说明文档
- **ICONS.md** - 图标相关说明

### `tests/` - 测试
测试相关文件：
- **test-page.html** - 用于测试插件功能的HTML页面

### `tools/` - 工具
开发和维护工具：
- **generate-icons.html** - 图标生成工具，可在浏览器中打开生成图标

## 文件路径引用

在 `manifest.json` 中，所有文件路径都是相对于项目根目录的：

- 弹出窗口：`src/popup.html`
- 内容脚本：`src/content.js`
- 后台脚本：`src/background.js`
- 图标文件：`assets/icons/icon*.png`

## 开发建议

1. **源代码修改**：所有业务逻辑代码都在 `src/` 目录下
2. **资源更新**：图标等资源文件放在 `assets/` 目录
3. **文档维护**：文档更新在 `docs/` 目录
4. **测试**：使用 `tests/test-page.html` 进行功能测试

