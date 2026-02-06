# 发布指南

## 版本信息
- **当前版本**: 1.0.1
- **扩展名称**: Auto Fill Extension
- **发布日期**: 2026-02-06

## 更新内容

### 版本 1.0.1 的改进
1. 优化了内容脚本的性能，在卡顿页面上提升了填充成功率
2. 减少了元素查找的等待时间，提高响应速度
3. 实现了更智能的元素等待机制，使用轮询查找确保元素加载后立即填充
4. 添加了填充值自动完成功能，可根据现有规则的填充值提供输入建议

## 如何打包扩展

### Chrome 扩展
1. 访问 Chrome 浏览器的 `chrome://extensions/`
2. 启用右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录 `/Users/james/Documents/code/extension/auto_pwd`
5. 验证扩展是否正确加载

### 打包为 .zip 文件
1. 从项目根目录创建压缩文件
2. 确保包含所有源代码文件和 assets
3. 排除 node_modules、.git 等无关目录

## 发布到 Chrome Web Store

1. 登录到 Chrome 开发者控制台
2. 点击"创建新项目"或选择现有项目进行更新
3. 上传新的 .zip 文件
4. 更新产品描述和截图（如有必要）
5. 提交审核

## 文件清单

- `manifest.json` - 扩展配置文件
- `src/` - 源代码目录
  - `background.js` - 后台服务工作脚本
  - `content.js` - 内容脚本（已优化）
  - `popup.html` - 扩展弹窗界面
  - `popup.css` - 弹窗样式
  - `popup.js` - 弹窗逻辑（已添加自动完成功能）
- `assets/` - 静态资源
  - `icons/` - 扩展图标
- `tests/` - 测试文件
- `tools/` - 辅助工具
- `PROJECT_STRUCTURE.md` - 项目结构说明
- `CHANGELOG.md` - 变更日志
- `RELEASE.md` - 当前发布说明