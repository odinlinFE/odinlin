import * as React from 'react'

import {
  fullWidthRows,
  rowDragging,
  rowHeight,
  rowPinning,
  rowSorting,
  rowSpanning,
} from './rows'
import {
  rangeSelection,
  rowSelection,
} from './selection'

import type { GridOptions } from 'ag-grid-community'

/**
 * @title 自定义默认操作逻辑配置（可覆盖）
 * @returns
 */
export default function useGridOptions(gridOptions: GridOptions): GridOptions {
  return React.useMemo(() => {
    return Object.assign(
      {
        // {Default: false} If `true`, 禁用用于分页的默认组件。
        suppressPaginationPanel: true,
        // {Default: false} If `true`, 在网格失去焦点时停止单元格编辑。 默认情况下，网格保持编辑状态，直到焦点进入另一个单元格。
        stopEditingWhenCellsLoseFocus: true,
      },

      fullWidthRows,
      rowDragging,
      rowHeight,
      rowPinning,
      rowSorting,
      rowSpanning,

      rangeSelection,
      rowSelection,

      gridOptions,
    )
  }, [gridOptions])
}
