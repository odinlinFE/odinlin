import { useCallback } from 'react'

import { cloneDeep } from '../../utils'

import type { RefObject } from 'react'
import type { AgGridReact } from 'ag-grid-react'
import type { GetLatestRowDataFunc } from '../../type'

/**
 * @title 获取grid当前页中的最新行数据
 */
export default function useLatestRowData<TData = any>(gridRef: RefObject<AgGridReact<any>>): GetLatestRowDataFunc {
  return useCallback((): any[] => {
    const rowData: any[] = []

    // 执行 filter 和 sort 后的数据，也就是视图上的数据
    gridRef.current?.api?.forEachNodeAfterFilterAndSort((rowNode, index) => {
      rowNode.data && rowData.push(rowNode.data)
    })

    return cloneDeep(rowData)
  }, [])
}
