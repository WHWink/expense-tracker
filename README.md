# 简易记账（expense-tracker）

一个只为你自己服务的单机记账 H5：**无后端、无登录、无追踪**，数据全部存在浏览器
localStorage 里。手机浏览器「添加到主屏幕」后就是一个全屏记账 App，首次打开后
断网也能用。

| 明细 | 导出 |
| --- | --- |
| ![明细页](docs/screenshot-home.png) | ![导出](docs/screenshot-export.png) |

## 功能

- **记一笔**：金额（自动调起数字键盘）、收入/支出、分类（18 个预设 + 自定义增删）、日期、备注
- **记录列表**：时间倒序，点行编辑、点垃圾桶删除
- **统计卡片**：当前结余 / 总收入 / 总支出，正数绿、负数红，跟随筛选条件联动
- **筛选**：按月份、按收支类型、按分类，三个条件任意组合
- **分类管理**：预设餐饮、交通、工资等常用分类，支持增删（删除不影响已有记录）
- **导出账单**：
  - 格式：CSV（UTF-8 带 BOM，Excel 打开不乱码）/ Excel .xlsx / PDF（表格 + 汇总）
  - 范围：全部 / 当前筛选结果 / 自定义时间区间
  - 金额约定为收入正、支出负，拿到表格里可以直接求和
- **PWA**：manifest + Service Worker 离线缓存，发新版联网打开一次即自动更新

## 技术栈

React 19 · TypeScript · Vite · Tailwind CSS v4 · papaparse · SheetJS · jsPDF

## 快速开始

```bash
git clone https://github.com/WHWink/expense-tracker.git
cd expense-tracker
npm install
npm run dev
```

## 在手机上使用

方式一（本地）：

```bash
npm run dev -- --host
```

手机连同一个 Wi-Fi，浏览器打开终端里的 Network 地址。

方式二（推荐）：部署到任意静态托管（见下文），得到一个 https 地址，
手机打开一次 → 浏览器菜单「添加到主屏幕」→ 从桌面图标全屏使用。

## 部署

纯静态 SPA：`npm run build` 后把 `dist/` 目录扔到任意静态托管即可，
Vercel / Netlify / Cloudflare Pages / GitHub Pages 都可以，无需任何服务端配置。

本仓库自带 GitHub Pages 自动部署（`.github/workflows/deploy.yml`）：
在仓库 Settings → Pages 把 Source 设为 **GitHub Actions** 后，
推送到 main 即自动发布到 `https://<用户名>.github.io/expense-tracker/`。

## 目录结构

```
src/
  components/     通用组件（按钮、底部弹窗、悬浮按钮、底部导航、空状态）
  features/
    transactions/ 记账表单、记录列表、筛选逻辑
    filter/       筛选栏 + 月份/分类选择弹层
    stats/        统计卡片
    categories/   分类（预设数据 + 管理页）
    export/       导出：ExportSheet UI + exportService + exporters/（csv/xlsx/pdf 各一个文件）
  hooks/          业务逻辑（记账、分类、筛选）
  store/          localStorage 读写封装（组件不直接碰 localStorage）
  types/          TS 类型定义
  utils/          金额/日期格式化、下载、id 生成
scripts/          make-icons.ps1 重新生成 PWA 图标
```

## License

[MIT](LICENSE)
