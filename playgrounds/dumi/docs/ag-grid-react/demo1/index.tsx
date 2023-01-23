/**
 * title: ag-grid-react
 * description:
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AgGridReact, SerialCellRenderer, createSerialColDef } from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'

import type { IAgGridRef } from '@odinlin/ag-grid-react'
// ag-grid 所需的核心结构 CSS
import 'ag-grid-community/styles/ag-grid.css'
// Grid Theme: https://www.ag-grid.com/react-data-grid/themes/
import 'ag-grid-community/styles/ag-theme-alpine.css'
// import 'ag-grid-community/styles/ag-theme-balham.css'

LicenseManager.setLicenseKey('your license key')

const columns = [
  {
    field: 'firstName',
    filter: true,
    cellStyle: { color: 'darkred' },
  },
  {
    field: 'lastName',
  },
]

const rowDatas = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '2',
    firstName: 'Mary',
    lastName: 'Moe',
  },
]

export default function Index() {
  const gridRef = useRef<IAgGridRef<any> | null>(null)

  const [rowData, setRowData] = useState<any[]>([])
  const [columnDefs, setColumnDefs] = useState<any[]>([])

  const changeColDef = useCallback((serial = false) => {
    if (serial) {
      setColumnDefs([createSerialColDef({
        width: 100,
        cellRenderer: SerialCellRenderer,
      }), ...columns])
    }
    else {
      setColumnDefs(columns)
    }
  }, [])

  const changeRowData = useCallback((add = false) => {
    if (add) {
      setRowData([{
        id: '11',
        firstName: 'Jack',
        lastName: 'Foe',
      }, ...rowDatas])
    }
    else {
      setRowData(rowDatas)
    }
  }, [])

  useEffect(() => {
    changeColDef()
    changeRowData()
  }, [])

  return (
    <div>
      <p>
        <button onClick={() => console.log(gridRef.current?.getPureRowData())}>pureRowData</button>
        <button onClick={() => changeColDef(columnDefs.length <= 2)}>toggleColDef</button>
        <button onClick={() => changeRowData(rowData.length <= 2)}>toggleRowData</button>
      </p>
      <AgGridReact
        ref={gridRef}
        rowKey="id"
        wrapperStyle={{ width: '100%', height: 400 }}
        columnDefs={columnDefs}
        rowData={rowData}
      />
    </div>
  )
}
