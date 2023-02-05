import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'

import {
  // 自定义hooks
  useColumnDefs,
  useDefaultColDef,
  useGetRowId,
  useGridOptions,
  useGridSize,
  useGridValidator,
  useLatestRowData,
  useLocale,
} from './composables'
import { cloneDeep } from './utils'

import type { ForwardRefRenderFunction } from 'react'
import type { IAgGridProps, IAgGridRef } from './type'

const InternalAgGridWrapper: ForwardRefRenderFunction<IAgGridRef, IAgGridProps> = (props, ref) => {
  const {
    // 外层容器样式
    wrapperClassName,
    wrapperStyle,
    // container样式，其中className需指定主题类名
    className = 'ag-theme-alpine',
    containerStyle,
    // 布局
    domLayout,

    rowKey,
    loading,
    editable,

    pagination,
    // paginationRenderer = PaginationRenderer,

    defaultColDef: defaultColDefProp,
    columnDefs: columnDefsProp,
    rowData: clientSideRowData,

    ...gridOptions
  } = props

  // 官方ag-grid-react组件的ref
  const gridRef = useRef<AgGridReact>(null)
  // 合并默认操作逻辑配置和传入配置
  const mergeGridOptions = useGridOptions(gridOptions)

  const calcWrapperClassName = useMemo(() => {
    return wrapperClassName ? `odin-grid-wrapper ${wrapperClassName}` : 'odin-grid-wrapper'
  }, [wrapperClassName])
  // 根据domLayout属性设置容器宽高
  const calcWrapperStyle = useGridSize(domLayout, wrapperStyle)

  /** ************ Imperative Contents *********************/

  // 获取纯净的rowData
  const getLatestRowData = useLatestRowData(gridRef)
  // 可编辑cell检验
  const { validate, getValidateError, clearValidateError } = useGridValidator(gridRef)

  /** ************ 主要属性 *********************/

  // 根据数据设置特定行节点的 ID
  const getRowId = useGetRowId(rowKey)
  // 获取某一行的客户端数据
  const getClientRowNode = useCallback((rowId?: string) => {
    if (!rowId) { return undefined }
    return clientSideRowData?.find(item => getRowId({ data: item } as any) === rowId)
  }, [getRowId, clientSideRowData])

  // 实现rowData的不可变性，不然grid会直接修改props传入的rowData
  const rowData = useMemo<any[]>(() => {
    return cloneDeep(clientSideRowData, [])
  }, [clientSideRowData])
  // 业务列定义: 根据editable属性，改变列定义是否可编辑
  const bizColumnDefs = useColumnDefs(columnDefsProp, editable)

  // 国际化
  const [localeText, getLocaleText] = useLocale()

  // 默认列定义 (主要是)
  const defaultColDef = useDefaultColDef(
    getClientRowNode,
    getValidateError,
    defaultColDefProp,
  )

  /** ************ Imperative *********************/

  /**
   * @title 通过ref暴露自定义api给父组件
   */
  useImperativeHandle(ref, () => {
    return {
      getLatestRowData,
      validate,
      getValidateError,
      clearValidateError,
    }
  }, [])

  /** ************ Effect *********************/

  useEffect(() => {
    console.log('loading: ', loading)
    loading
      ? gridRef.current?.api?.showLoadingOverlay()
      : gridRef.current?.api?.hideOverlay()
  }, [loading])

  return (
    <div className={calcWrapperClassName} style={calcWrapperStyle}>
      <AgGridReact
        ref={gridRef}
        className={className}
        containerStyle={containerStyle}
        domLayout={domLayout}

        getRowId={getRowId}
        defaultColDef={defaultColDef}
        columnDefs={bizColumnDefs}
        rowData={rowData}

        localeText={localeText}
        getLocaleText={getLocaleText}

        {...mergeGridOptions}
      />
      {/* 传递了pagination属性，表示启用分页功能 */}
      {/* {pagination && paginationRenderer(pagination)} */}
    </div>
  )
}

const AgGridWrapper = forwardRef<IAgGridRef, IAgGridProps>(InternalAgGridWrapper)

export default AgGridWrapper
