import { useMemo } from 'react'

import type { ColDef } from 'ag-grid-community'
import type { useGridValidatorReturn } from '../../type'

/**
 * @title 默认列定义 (会被实际列定义覆盖)
 */
export default function useDefaultColDef<TData = any>(
  getClientRowNode: (rowId?: string) => any,
  getValidateError: useGridValidatorReturn['getValidateError'],
  defaultColDefProp?: ColDef<TData>,
) {
  return useMemo<ColDef<TData>>(() => {
    // 待合并: 默认的ColDef.cellClassRules属性
    const initialCellClassRules: ColDef['cellClassRules'] = {
      'odin-cell-value': 'true',
      'odin-cell-editable': (params) => {
        return !!params.colDef.editable
      },
      'odin-cell-modify': (params) => {
        const { colDef, column, node, data } = params

        if (!colDef.editable) { return false }

        // 判断 '有值与原始值是否相等' 来确定是否编辑过
        const colId = column.getUniqueId()
        const oFind = getClientRowNode(node.id)

        // FIXED: 过滤掉 Client-Side Data 尚未ready的情况 (防止更改rowData时modify样式闪烁)
        if (!oFind) { return false }
        // FIXED: 比较data[colId]和oFind[colId]的值是否相等，params.value可能被valueGetter修改
        return data[colId] !== oFind[colId]
      },
      'odin-cell-validate-failed': (params) => {
        const { colDef, column, node } = params

        if (!colDef.editable) { return false }

        const colId = column.getUniqueId()
        // 校验结果中是否存在该cell的错误信息
        const oFind = getValidateError(`${node.id}.${colId}`)
        if (!oFind) { return false }
        return true
      },
    }

    return Object.assign<ColDef, ColDef | undefined, ColDef>(
      {
        // tooltipComponent: CellTooltipRenderer,
      },
      defaultColDefProp,
      {
        cellClassRules: Object.assign({}, initialCellClassRules, defaultColDefProp?.cellClassRules),
      },
    )
  }, [defaultColDefProp, getClientRowNode, getValidateError])
}
