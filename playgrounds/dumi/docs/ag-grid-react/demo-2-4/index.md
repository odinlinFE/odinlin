---
nav:
  title: agGridReact
  order: 2
group:
  title: Editing
  order: 3
title: 4. cellEditorSelector
order: 4
---

:::info{title="cellEditorSelector - 同一列可设置多个编辑器"}

- cellEditorSelector `() => CellEditorSelectorResult['component'、'params'、'popup'、'popupPosition']` 的返回与ColDef中的一一对应
- columnTypes 可使用type复用这些列属性

| 属性 | 编辑器 | 编辑器参数 | 是否以弹窗形式展示编辑器 | 设置弹出单元格编辑器的位置 |
| --- | --- | --- | --- | --- |
| cellEditorSelector |CellEditorSelectorResult['component'] | CellEditorSelectorResult['params'] | CellEditorSelectorResult['popup'] | CellEditorSelectorResult['popupPosition'] |
| 列定义 |ColDef['cellEditor'] | ColDef['cellEditorParams'] | ColDef['cellEditorPopup'] | ColDef['cellEditorPopupPosition'] |

:::

<code src="./index.tsx"></code>
