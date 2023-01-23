import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'

import {
  // 自定义hooks
  useColumnDefs,
  useDefaultColDef,
  useGetRowId,
  useGridContext,
  useGridReady,
  useGridRowData,
  useGridSize,
} from './composables/private'
import { cloneDeep } from './utils'

import type { ForwardRefRenderFunction } from 'react'
import type { IAgGridProps, IAgGridRef } from './type'

const InternalAgGridWrapper: ForwardRefRenderFunction<IAgGridRef, IAgGridProps> = (props, ref) => {
  const {
    wrapperClassName,
    wrapperStyle,
    // 默认主题样式
    className = 'ag-theme-alpine',

    rowKey,
    loading,
    editable,

    serialColDef,
    pagination,
    // paginationRenderer = PaginationRenderer,

    context: contextProp,
    defaultColDef: defaultColDefProp,
    columnDefs: columnDefsProp,
    rowData: clientSideRowData,
    onGridReady: onGridReadyProp,

    ...gridOptions
  } = props
  const { domLayout } = gridOptions

  // 根据domLayout属性设置容器宽高
  const calcWrapperStyle = useGridSize(domLayout, wrapperStyle)
  // 根据数据设置特定行节点的 ID
  const getRowId = useGetRowId(rowKey)
  // 实现rowData的不可变性，不然grid会直接修改props传入的rowData
  const rowData = useMemo<any[]>(() => {
    return cloneDeep(clientSideRowData, [])
  }, [clientSideRowData])
  // 用于获取AgGridReact实例的public属性
  const [apiRef, columnApiRef, onGridReady] = useGridReady(onGridReadyProp)

  // merge context
  const context = useGridContext(contextProp, clientSideRowData)
  // 默认列定义
  const defaultColDef = useDefaultColDef(getRowId, {}, defaultColDefProp)
  // 业务列定义: 根据editable属性，改变列定义是否可编辑
  const bizColumnDefs = useColumnDefs(columnDefsProp, editable)
  // 获取纯净的rowData
  const getPureRowData = useGridRowData(apiRef)

  // 如果返回React.MutableRefObject不需要监听，但是返回ref.current需要监听current
  useImperativeHandle(ref, () => {
    console.log('apiRef.current: ', apiRef.current)
    return {
      api: apiRef,
      columnApi: columnApiRef,
      getPureRowData,
      // validate,
    }
  }, [])

  return (
    <div className={wrapperClassName} style={calcWrapperStyle}>
      <AgGridReact
        className={className}

        // 使用 浏览器的默认提示(title属性) 而不是使用网格的工具提示组件
        enableBrowserTooltips={false}
        // 提示在显示后跟随光标
        tooltipMouseTrack={true}
        // 显示所需的延迟毫秒数
        tooltipShowDelay={0}
        // 在显示后隐藏所需的延迟毫秒数
        tooltipHideDelay={10000}

        suppressPaginationPanel={true}
        stopEditingWhenCellsLoseFocus

        getRowId={getRowId}
        context={context}
        defaultColDef={defaultColDef}
        columnDefs={bizColumnDefs}
        rowData={rowData}
        onGridReady={onGridReady}

        {...gridOptions}
      />
      {/* 传递了pagination属性，表示启用分页功能 */}
      {/* {pagination && paginationRenderer(pagination)} */}
    </div>
  )
}

const AgGridWrapper = forwardRef<IAgGridRef, IAgGridProps>(InternalAgGridWrapper)

export default AgGridWrapper
