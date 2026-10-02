# 简易记账（expense-tracker）

个人单机记账 H5：React + TypeScript + Vite + Tailwind CSS。
数据全部存在浏览器 localStorage，无后端、无登录，支持添加到手机主屏幕全屏使用。

## 功能进度

- [x] 第一阶段：记一笔 / 记录列表（删改）/ 结余统计
- [x] 第二阶段：按月/类型/分类筛选 + 分类管理 + 底部导航
- [x] 第三阶段：导出 CSV / Excel / PDF（全部 / 当前筛选 / 自定义时间范围）

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

## 导出说明

- 入口在明细页右上角「导出」，默认选「当前筛选结果」，与筛选栏联动
- CSV：UTF-8 带 BOM（Excel 打开不乱码），papaparse 负责转义
- Excel：SheetJS 生成，金额是数字类型（收入正 / 支出负），可直接求和
- PDF：jsPDF 生成，表格 + 汇总；中文用系统字体绘制，文字不可选中（后续可换字体嵌入方案）
- xlsx / jspdf 体积较大，已按格式分包，点导出时才加载
