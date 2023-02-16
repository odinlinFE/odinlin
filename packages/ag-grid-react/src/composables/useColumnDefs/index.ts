import * as React from 'react'

import { modifyColumnEditableProperty } from '../../utils'

import type { GridOptions } from 'ag-grid-community'

/**
 * @title Array of Column / Column Group definitions.
 * @desc 改变ColDef.editable属性，便于切换编辑模式
 */
export function useColumnDefs(columnDefs: GridOptions['columnDefs'], editable?: boolean) {
  return React.useMemo<GridOptions['columnDefs']>(() => {
    // 直接返回: undefined 或 null
    if (columnDefs === null || columnDefs === undefined) { return columnDefs }

    // 直接返回: 可编辑模式
    if (editable) { return columnDefs }

    // 修改ColDef.editable为false: 不可编辑模式
    return modifyColumnEditableProperty(columnDefs)
  }, [columnDefs, editable])
}

export default useColumnDefs
