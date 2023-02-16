import * as React from 'react'

import type { ICellEditorParams } from 'ag-grid-community'
import type { ICellEditorStyle } from '../../type'

/**
 * @title Cell Editors Size
 */
export function useCellEditorSize(
  params: ICellEditorParams & { cellEditorStyle?: ICellEditorStyle },
  mergeCellEditorStyle: ICellEditorStyle,
  extraStyle?: Record<string, any>,
) {
  return React.useMemo<React.CSSProperties>(() => {
    const { column, node, eGridCell, cellEditorStyle } = params

    const oStyle = {
      width: column.getActualWidth() - 2,
      // minWidth: column.getMinWidth()!,
      // maxWidth: column.getMaxWidth()!,
      height: node.rowHeight! - 2,
    }

    // ag-cell-inline-editing OR ag-cell-popup-editing 额外样式
    const [inline, popup] = cellEditorStyle ?? mergeCellEditorStyle
    const isPopup = eGridCell.className.includes('ag-cell-popup-editing')

    return Object.assign(oStyle, isPopup ? popup : inline, extraStyle)
  }, [params, extraStyle])
}

export default useCellEditorSize
