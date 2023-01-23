// https://www.ag-grid.com/react-data-grid/row-selection/

import { useMemo } from 'react'

import type { ColDef, ICellRendererParams } from 'ag-grid-community'

export const ROW_SELECTION_AND_SERIAL = 'rowSelectionAndSerialNumber'

/**
 * @title 列定义渲染组件
 */
export const SerialCellRenderer: React.FC<ICellRendererParams<any, any> & { pagination: any }> = (params) => {
  const { node: { rowIndex }, pagination } = params

  const serialNum = useMemo(() => {
    const current = pagination?.current
    const pageSize = pagination?.pageSize
    // const total = pagination?.total

    if (typeof rowIndex !== 'number') { return null }
    if (typeof current !== 'number' || typeof pageSize !== 'number') { return rowIndex + 1 }
    return (current - 1) * pageSize + rowIndex + 1
  }, [rowIndex, pagination])

  return serialNum
    ? (
      <span style={{ paddingLeft: '6px' }}>{serialNum}</span>
      )
    : null
}

/**
 * @title 创建序号列定义
 */
export function createSerialColDef(serialColDef: ColDef): ColDef<any> {
  return {
    field: ROW_SELECTION_AND_SERIAL,
    headerName: '序号',

    width: 86,
    flex: 0,
    suppressSizeToFit: true,
    suppressAutoSize: true,

    // 禁止menu: `menuTabs: []` 或 `suppressMenu: true`
    suppressMenu: true,

    // 不允许排序
    sortable: false,
    editable: false,

    /** If `true` or the callback returns `true`, 标题中会显示'全选'复选框 */
    // 如果是一个函数，则每次显示的列发生更改时都会调用该函数，以检查更改
    headerCheckboxSelection: true,
    /** If `true`, 全选复选框仅针对筛选的行 */
    headerCheckboxSelectionFilteredOnly: true,

    /**
   * 因为函数返回值需要运行时间，所以会先生成dom，再根据返回值显隐
   * colDef.checkboxSelection = false; // do not create checkbox
   * colDef.checkboxSelection = () => false; // create checkbox, make checkbox not visible
   */
    checkboxSelection: true,

    /** If `true`, 在行不可选择且复选框已启用时显示禁用的复选框。默认值：`false` */
    showDisabledCheckboxes: true,

    /** If `true`, 禁用该列出现填充手柄 */
    suppressFillHandle: true,

    lockVisible: false,
    lockPosition: 'left',
    lockPinned: true,
    pinned: 'left',

    // 当有分页需求业务代码自己配置cellRenderer
    // cellRenderer: 'SerialCellRenderer',
    // cellRendererParams: {
    //   pagination,
    // },

    // 覆盖默认配置
    ...serialColDef,
  }
}
