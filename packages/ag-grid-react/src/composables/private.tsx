import { useCallback, useMemo, useRef } from 'react'

import { cloneDeep, modifyColumnEditableProperty } from '../utils'

import type { CSSProperties, MutableRefObject } from 'react'
import type { ValidateError } from 'async-validator'
import type { ColDef, ColumnApi, GetRowIdFunc, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community'
import type { GetPureRowDataFunc, IAgGridRef, RowKey, ValidateFunc } from '../type'

// function useGridApis<T extends AgGridReact>(gridRef: MutableRefObject<T | null>) {}
// import type { AgGridReact } from 'ag-grid-react'

/**
 * @title 根据domLayout设置grid容器的宽高，grid将在父元素两个方向上 100% 填充
 * @returns {CSSProperties}
 * @desc `domLayout=normal`：默认值: 垂直、水平滚动auto。
 * @desc `domLayout=autoHeight`：无垂直滚动条，水平滚动auto。 - 默认有minHeight，如需清除：`.ag-center-cols-clipper {min-height: unset !important;}`
 * @desc `domLayout=print`：无垂直、水平滚动条，网格呈现所有行和列。[打印文档](https://www.ag-grid.com/javascript-data-grid/printing/)
 */
export function useGridSize(domLayout?: 'normal' | 'autoHeight' | 'print', wrapperStyle?: CSSProperties): CSSProperties | undefined {
  return useMemo<CSSProperties | undefined>(() => {
    if (domLayout === 'autoHeight') {
      return Object.assign({}, wrapperStyle, { height: undefined })
    }

    if (domLayout === 'print') {
      return Object.assign({}, wrapperStyle, { width: undefined, height: undefined })
    }

    // 如果不是autoHeight或print模式, 则直接返回
    return wrapperStyle
  }, [domLayout, wrapperStyle])
}

/**
 * @title 设置getRowId属性会默认开启immutableData不可变
 * @notice 不可变存储: 所有网格状态（行和区域选择、筛选器、排序等）都会保留；而不是rowData不可变
 * @desc 行选择 保留行选择
 * @desc 行分组 组保持/更新，打开的组保持打开状态
 * @desc 行刷新 在 DOM 中仅更新更改的行
 * @desc 行动画 移动的行以动画形式显示到新位置
 * @desc 单元格闪烁 可以闪烁更改的值以显示更改
 */
export function useGetRowId(rowKey: RowKey): GetRowIdFunc {
  return useCallback((params) => {
    const { data } = params
    if (typeof rowKey === 'string') { return data[rowKey] }
    return rowKey(data)
  }, [rowKey])
}

/**
 * @title 在onGridReady回调中对GridReadyEvent中api和columnApi赋值
 */
export function useGridReady(
  onGridReady?: GridOptions['onGridReady'],
): [IAgGridRef['api'], IAgGridRef['columnApi'], GridOptions['onGridReady']] {
  const apiRef = useRef<GridApi<any> | null>(null)
  const columnApiRef = useRef<ColumnApi | null>(null)

  const _onGridReady = useCallback((event: GridReadyEvent<any>) => {
    // @ts-expect-error type in GridReadyEvent
    const { api, columnApi, type } = event
    // type: "gridReady"
    apiRef.current = api
    console.log('_onGridReady', apiRef.current, api)
    columnApiRef.current = columnApi

    onGridReady?.(event)
  }, [onGridReady])

  return [
    apiRef,
    columnApiRef,
    _onGridReady,
  ]
}

/**
 * @title 合并 业务传递 context 和 内部需要共享的 context
 */
export function useGridContext<TData = any>(contextProp?: any, clientSideRowData?: TData[] | null) {
  return useMemo<Record<string, any>>(() => {
    return {
      ...contextProp,
      rowData: clientSideRowData,
    }
  }, [contextProp, clientSideRowData])
}

/**
 * @title 默认列定义 (会被实际列定义覆盖)
 */
export function useDefaultColDef<TData = any>(getRowId: GetRowIdFunc, validateError: Record<string, ValidateError[]>, defaultColDefProp: ColDef<TData> | undefined) {
  return useMemo<ColDef<TData>>(() => {
    // 待合并: 默认的ColDef.cellClassRules属性
    const initialCellClassRules: ColDef['cellClassRules'] = {
      'odin-cell-value': 'true',
      'odin-cell-editable': (params) => {
        return !!params.colDef.editable
      },
      'odin-cell-modify': (params) => {
        const { colDef, column, node, data, context } = params

        if (!colDef.editable) { return false }

        // 判断 '有值与原始值是否相等' 来确定是否编辑过
        const colId = column.getUniqueId()
        const oFind = context?.rowData?.find((item: TData) => getRowId({ data: item } as any) === node.id)
        // FIXED: 过滤掉 Client-Side Data 尚未ready的情况 (防止更改rowData时modify样式闪烁)
        if (!oFind) { return false }
        // FIXED: 比较data[colId]和oFind[colId]的值是否相等，value可能被valueGetter修改
        return data[colId] !== oFind[colId]
      },
      'odin-cell-validate-failed': (params) => {
        const { colDef, column, node } = params

        if (!colDef.editable) { return false }

        const colId = column.getUniqueId()
        // 校验结果中是否存在该cell的错误信息
        const oFind = validateError[`${node.id}.${colId}`]
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
  }, [defaultColDefProp, getRowId, validateError])
}

/**
 * @title Array of Column / Column Group definitions.
 */
export function useColumnDefs(columnDefs: GridOptions['columnDefs'], editable?: boolean) {
  return useMemo<GridOptions['columnDefs']>(() => {
    // 直接返回: undefined 或 null
    if (columnDefs === null || columnDefs === undefined) { return columnDefs }

    // 直接返回: 可编辑模式
    if (editable) { return columnDefs }

    // 修改ColDef.editable为false: 非可编辑模式
    return modifyColumnEditableProperty(columnDefs)
  }, [columnDefs, editable])
}

/**
 * @title 获取实时的表格数据
 */
export function useGridRowData<TData = any>(apiRef: MutableRefObject<GridApi<TData> | null>): GetPureRowDataFunc {
  return useCallback((): any[] => {
    const rowData: any[] = []

    // 执行 filter 和 sort 后的数据，也就是视图上的数据
    apiRef.current?.forEachNodeAfterFilterAndSort((rowNode, index) => {
      rowNode.data && rowData.push(rowNode.data)
    })

    return cloneDeep(rowData)
  }, [])
}
