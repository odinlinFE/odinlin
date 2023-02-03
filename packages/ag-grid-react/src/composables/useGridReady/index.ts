import { useCallback, useRef } from 'react'

import type { MutableRefObject } from 'react'
import type { GridOptions, GridReadyEvent } from 'ag-grid-community'
import type { IAgGridReadyRef } from '../../type'

/**
 * @title 方便业务代码获取AgGridReact实例的public属性
 * @desc 在onGridReady回调中对GridReadyEvent中api和columnApi赋值
 */
export default function useGridReady(
  onGridReady?: GridOptions['onGridReady'],
): [MutableRefObject<IAgGridReadyRef>, GridOptions['onGridReady']] {
  const gridReadyRef = useRef<IAgGridReadyRef>({ api: null, columnApi: null })

  const _onGridReady = useCallback((event: GridReadyEvent<any>) => {
    // @ts-expect-error type in GridReadyEvent
    const { api, columnApi, type } = event
    // type: "gridReady"
    gridReadyRef.current.api = api
    gridReadyRef.current.columnApi = columnApi

    onGridReady?.(event)
  }, [onGridReady])

  return [
    gridReadyRef,
    _onGridReady,
  ]
}
