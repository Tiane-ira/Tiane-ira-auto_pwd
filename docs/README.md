# 自动填充浏览器插件

一个功能强大的浏览器插件，支持使用CSS Selector和XPath进行元素选择和填充，可以保存和管理无限制数量的填充规则。

## 功能特性

- ✅ 支持CSS Selector和XPath两种元素选择方式
- ✅ 规则绑定到网址列表，自动匹配当前页面URL
- ✅ 进入匹配的网址时自动执行填充规则
- ✅ 编辑规则时自动识别并添加当前网址
- ✅ 无限制数量的规则管理
- ✅ 规则ID自动生成（UUID）
- ✅ 直观的规则管理界面
- ✅ 规则持久化存储

## 安装方法

1. 下载或克隆此项目
2. 打开Chrome/Edge浏览器，进入扩展程序管理页面（chrome://extensions/ 或 edge://extensions/）
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 使用方法

### 添加规则

1. 点击浏览器工具栏中的插件图标
2. 点击"添加规则"按钮
3. 系统会自动识别当前页面网址并添加到网址列表中
4. 填写规则信息：
   - **绑定网址列表**：可以添加多个网址，规则会在这些网址上自动执行
     - 点击"添加当前网址"按钮可以快速添加当前页面网址
     - 也可以手动输入网址后点击"添加"
   - **填充方式**：选择CSS Selector或XPath
   - **选择器**：输入CSS选择器或XPath表达式
   - **填充值**：要填充的文本内容
5. 点击"保存"

### 规则执行

- 当访问规则中绑定的网址时，插件会自动匹配并执行填充
- 支持URL精确匹配和通配符匹配（以*结尾）
- 支持路径匹配（以/开头的路径）

### 编辑和删除规则

- 点击规则卡片上的"编辑"按钮可以修改规则
- 编辑时会自动识别当前网址（如果规则中没有网址）
- 点击"删除"按钮可以删除规则

## 选择器示例

### CSS Selector示例

```css
/* 通过ID选择 */
#username

/* 通过类名选择 */
.login-input

/* 通过属性选择 */
input[type="email"]

/* 组合选择器 */
form.login-form input[name="password"]
```

### XPath示例

```xpath
// 通过ID选择
//*[@id="username"]

// 通过文本内容选择
//button[text()="登录"]

// 通过属性选择
//input[@type="email"]

// 通过位置选择
//div[@class="form-group"][1]/input
```

## 文件结构

```
auto_pwd/
├── manifest.json           # 插件配置文件
├── src/                    # 源代码目录
│   ├── popup.html          # 弹出窗口HTML
│   ├── popup.css           # 弹出窗口样式
│   ├── popup.js            # 弹出窗口逻辑
│   ├── content.js          # 内容脚本（页面交互）
│   └── background.js       # 后台脚本
├── assets/                 # 资源文件目录
│   └── icons/              # 图标文件
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── docs/                   # 文档目录
│   ├── README.md           # 说明文档
│   └── ICONS.md            # 图标说明
├── tests/                  # 测试文件目录
│   └── test-page.html      # 测试页面
└── tools/                  # 工具目录
    └── generate-icons.html # 图标生成工具
```

## 规则数据结构

每个规则包含以下字段：
- **id**: 规则唯一标识（UUID，自动生成）
- **urls**: 绑定的网址列表（数组）
- **selectorType**: 填充方式（"css" 或 "xpath"）
- **selector**: 选择器表达式
- **fillValue**: 填充的文本值
- **createdAt**: 创建时间

## URL匹配规则

- **精确匹配**：完全匹配的URL
- **通配符匹配**：以`*`结尾的URL（例如：`https://example.com/*`）
- **路径匹配**：以`/`开头的路径（例如：`/login`）

## 注意事项

1. 图标文件已包含在 `assets/icons/` 目录中
2. 某些网站可能有内容安全策略（CSP）限制，可能影响插件功能
3. XPath选择器在某些复杂页面中可能性能较慢
4. 建议在使用前先在开发者工具中测试选择器是否正确
5. 如需自定义图标，可以使用 `tools/generate-icons.html` 工具生成
6. 规则会自动在匹配的网址上执行，无需手动触发

## 技术栈

- Manifest V3
- Chrome Extension API
- Vanilla JavaScript（无依赖）

## 许可证

MIT License

