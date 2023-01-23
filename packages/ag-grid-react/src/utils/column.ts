import type { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community'

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
