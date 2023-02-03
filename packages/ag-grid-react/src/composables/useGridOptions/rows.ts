// https://www.ag-grid.com/react-data-grid/row-sorting/
import type { GridOptions } from 'ag-grid-community'

/**
 * @title Sorting Order: ascending -> descending -> none.
 */
export const rowSorting: GridOptions = {
  // ColDef.sortable
  // ColDef.comparator
  // ColDef.unSortIcon

  // 定义排序发生顺序的数组（如果启用排序）
  sortingOrder: [null, 'asc', 'desc'],
  // 禁止多列排序
  suppressMultiSort: false,
  // 在用户单击列标题时始终进行多重排序，而不管是否按下按键
  alwaysMultiSort: false,
  // 按下ctrl键启用多列排序
  multiSortKey: 'ctrl',
  // 是否考虑重音字符(比如aáàä)。如果打开此功能，排序会变慢
  accentedSort: false,
  // 如果需要对已排序行进行额外控制，也可以执行一些后期排序。(比如对排序结果进行调整)
  // postSortRows
}

/**
 * @title 此功能类似于Excel中的“单元格合并”或HTML表中的“行跨越”
 */
export const rowSpanning: GridOptions = {
  // 设置suppressRowTransform为true 会停止使用 `CSS.transform` 定位行，而使用 `CSS.top`。
  // 不使用转换的缺点是性能问题: 行动画（排序或过滤后）将变慢。
  // ColDef.suppressRowTransform={true}

  // 允许单元格跨越行数
  // ColDef.rowSpan
  // ColDef.colSpan
}

/**
 * @title Pinned rows appear either above or below the normal rows of a table. This feature in other grids is also known as Frozen Rows or Floating Rows.
 * @notice 在ColDef.cellRendererSelector通过params.node.rowPinned区分是否为固定行
 *
 * @notice 单元格编辑可以在固定行上正常进行。
 * @notice Non Supported Items: Sorting、Filtering、Row Grouping、Row Selection
 */
export const rowPinning: GridOptions = {
  // 顶部 <pinnedTopRowData | setPinnedTopRowData>
  // 底部 <pinnedBottomRowData | setPinnedBottomRowData>
}

/**
 * @title 默认情况下，网格将显示高度为25px的行。您可以单独更改每行的高度，以赋予每行不同的高度。
 */
export const rowHeight: GridOptions = {
  // rowHeight Property
  // getRowHeight Callback

  // Changing Row Height: api.resetRowHeights(), rowNode.setRowHeight(height) and api.onRowHeightChanged().
  // 自动行高和文本换行: ColDef.wrapText 和 ColDef.autoHeight
}

/**
 * @title 全宽行最初被引入到AGGrid中以支持 Master/Detail。现在直接支持了 Master/Detail，全宽度的实用性降低了。
 */
export const fullWidthRows: GridOptions = {
  // isFullWidthRow={isFullWidthRow}
  // fullWidthCellRenderer={fullWidthCellRenderer}
}

/**
 * @title 行拖拽
 */
export const rowDragging: GridOptions = {
  // TODO
}
