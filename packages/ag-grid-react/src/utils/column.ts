import type { ColDef, ColGroupDef, EditableCallback, EditableCallbackParams, GridOptions } from 'ag-grid-community'

/**
 * @title 列定义中已设置 editable 属性的列，设置为不可编辑
 */
export function modifyColumnEditableProperty(columnDefs: GridOptions['columnDefs']) {
  return columnDefs?.map((item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'children')) {
      modifyColumnEditableProperty((item as ColGroupDef).children)
    }
    else {
      if (Object.prototype.hasOwnProperty.call(item, 'editable')) { (item as ColDef).editable = false }
    }
    return item
  })
}

/**
 * @title 不管 editable 类型，返回最终结果表明当前cell是否可编辑
 * @desc 布尔值直接返回，函数返回其运行结果
 */
export function getCellEditable<TData = any>(
  editable: boolean | EditableCallback<TData> | undefined,
  params: EditableCallbackParams<TData>,
): boolean {
  // If `function`, return 其运行结果
  if ((typeof editable === 'function')) { return editable(params) }
  // If `true` or `false` or `undefined`, return it directly
  return !!editable
}
