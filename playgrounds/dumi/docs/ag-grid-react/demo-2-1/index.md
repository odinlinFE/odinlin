---
nav:
  title: agGridReact
  order: 2
group:
  title: Editing
  order: 3
title: 1. Overview
order: 1
---

# Cell Editors Overview


## 1. 常用配置项

1.1 <b style="color: #666;">列定义 (ValidateColumnDef)</b>
  - editable: `{boolean | function}` - 当前cell是否可编辑

1.2 <b style="color: #666;">列定义 (ValidateColumnDef)</b> - <span style="color: #999;">编辑器主要配置项</span>
  - <span style="color: #eb2f96;">cellEditor</span>: `{string | ReactComponent}` - 单元格编辑器
  - <span style="color: #eb2f96;">cellEditorParams</span>: `{object | [function]()}` - 单元格编辑器参数 【其中静态对象直接merge到组件props中; 其中function是[动态参数](https://www.ag-grid.com/react-data-grid/cell-editors/#dynamic-parameters)，会将返回值注入】
  - <span style="color: #eb2f96;">cellEditorPopup</span>: `{boolean}` - 是否以弹窗形式展示编辑器
  - <span style="color: #eb2f96;">cellEditorPopupPosition</span>: `{'over' | 'under'}` - 设置弹出单元格编辑器的位置
  - cellEditorSelector: `() => CellEditorSelectorResult['component'、'params'、'popup'、'popupPosition']` - [同一列可设置多个编辑器](https://www.ag-grid.com/react-data-grid/cell-editors/#many-editors-one-column)

1.3 <b style="color: #666;">列定义 (ValidateColumnDef)</b> - <span style="color: #999;">继承ColDef代表可以复用，减少重复的列定义</span>
  - rules: `{async-validator.Rule}` - 校验规则 （[同一列可设置多种规则 - 通过函数自定义实现](https://github.com/yiminghe/async-validator#rules)）
  - type: 设置 [GridOptions.columnTypes](https://www.ag-grid.com/react-data-grid/column-definitions/#custom-column-types) 和 ColDef.type，则这个特定列会继承该columnTypes的所有配置项
    - defaultColDef：包含所有列都将继承的属性。
    - defaultColGroupDef：包含所有列组都将继承的属性。
    - columnTypes：包含列定义可以继承的属性的特定列类型。
