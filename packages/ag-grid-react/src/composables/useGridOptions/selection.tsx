// https://www.ag-grid.com/react-data-grid/selection-overview/
import type { GridOptions } from 'ag-grid-community'

/**
 * @title selectAll、deselectAll、selectAllFiltered、deselectAllFiltered
 */
export const rowSelection: GridOptions = {
  /** Type of Row Selection: `single`, `multiple`. */
  rowSelection: 'multiple',

  /** If `true`, 单击行时不会发生行选择，此时只能勾选复选框时选择行 */
  suppressRowClickSelection: false,
  /** If `true`, 'Ctrl+单击行' 或 '按空格'，不会取消已选择行 */
  suppressRowDeselection: false,
  /** If `true`, 允许使用单击行选择多行 (多用于优化触摸设备操作) */
  rowMultiSelectWithClick: true,

  /**
   * 回调用于确定哪些行是可选的 (不能使用 全选 或 对选中按空格 选中被禁止的行)
   * @notice 注意与colDef.checkboxSelection做区分
   */
  // isRowSelectable?: IsRowSelectable<TData>;

  /** If `true`, 如果您选择一个组，则该组的子项也将被选中 */
  groupSelectsChildren: true,
  /** If `true` and using `groupSelectsChildren`, 只有通过当前过滤器的child才会被选中 */
  groupSelectsFiltered: true,
}

/**
 * @title Range selection allows Excel-like range selection of cells
 *
 * @notice 默认不开启enableFillHandle, 可在业务中和editable属性自行处理
 * @desc 以下属性仅在enableRangeSelection=true时有效：GridOptions.rangeSelectionChanged、api.getCellRanges、api.addCellRange、api.clearRangeSelection
 * @desc 以下属性仅在enableFillHandle=true时有效, 方便对填充行为进行自定义: colDef.suppressFillHandle 和 GridOptions.fillOperation
 */
export const rangeSelection: GridOptions = {
  /**
   * @title {Default: false} If `true`, 能够选择单元格内的文本。
   * @notice 当此项设置为“true”时，grid内部剪贴板服务将被禁用。因为会直接使用操作系统复制文字功能。
   * @level 优先级低于enableRangeSelection
   */
  enableCellTextSelection: false,
  // {Default: false} If `true`, DOM 中行和列的顺序与屏幕上的顺序一致。
  ensureDomOrder: false,

  // {Default: false} 是否启用范围选择
  enableRangeSelection: true,
  // {Default: false} 是否启用范围句柄 (句柄就是范围区域右下角有一个 `小方块即div.ag-cell.ag-range-handle`)
  enableRangeHandle: true,
  // {Default: false} If `true`, 按住ctrl和鼠标框选可启用多范围选择
  suppressMultiRangeSelection: true,

  // NOTICE: enableFillHandle 优先级高于 enableRangeHandle
  // NOTICE: 不可编辑的单元格不会被填充句柄更改，因此不需要添加自定义逻辑来跳过不可编辑列。
  // {Default: false} 是否启用填充句柄 <类似Excel，当按住Alt或Option键时拖动range>
  enableFillHandle: false,
  // {Default: false} 防止在填充手柄缩小范围选择时清除单元格值
  suppressClearOnFillReduction: false,
  // {Default: xy} 填充手柄方向[xy, x, y]
  fillHandleDirection: 'xy',
}
