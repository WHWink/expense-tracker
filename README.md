# 简易记账（expense-tracker）

个人单机记账 H5：React + TypeScript + Vite + Tailwind CSS。
数据全部存在浏览器 localStorage，无后端、无登录，支持添加到手机主屏幕全屏使用。

## 功能进度

- [x] 第一阶段：记一笔 / 记录列表（删改）/ 结余统计
- [x] 第二阶段：按月/类型/分类筛选 + 分类管理 + 底部导航
- [ ] 第三阶段：导出 CSV / Excel / PDF

## 本地运行

```bash
npm install
npm run dev
```

## 在手机上测试

```bash
npm run dev -- --host
```

手机连同一个 Wi-Fi，用浏览器打开终端里显示的 Network 地址（形如 `http://192.168.x.x:5173`）。
在浏览器菜单里选「添加到主屏幕」即可全屏使用。

注意：数据存在浏览器 localStorage 里，同一台手机浏览器上的数据才互通。

## 构建

```bash
npm run build
npm run preview   # 本地预览构建产物（含 Service Worker）
```

## 目录结构

```
src/
  components/     通用组件（按钮、底部弹窗、悬浮按钮、空状态）
  features/
    transactions/ 记账表单、记录列表
    stats/        统计卡片
    categories/   分类（预设数据，管理界面第二阶段做）
  hooks/          业务逻辑（useTransactions、useCategories）
  store/          localStorage 读写封装（组件不直接碰 localStorage）
  types/          TS 类型定义
  utils/          金额/日期格式化、id 生成
scripts/          make-icons.ps1 重新生成 PWA 图标
```
