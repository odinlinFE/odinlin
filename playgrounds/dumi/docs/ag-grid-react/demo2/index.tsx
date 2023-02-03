import React, { useRef } from 'react'
import { AgGridReact, useGridReady } from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'
import '@odinlin/ag-grid-react/dist/index.css'

import type { IAgGridRef } from '@odinlin/ag-grid-react'
import type { ColDef } from 'ag-grid-community'

LicenseManager.setLicenseKey('your license key')

const columnDefs: ColDef[] = [
  {
    field: 'firstName',
    filter: true,
    cellStyle: { color: 'darkred' },
    editable: true,
    cellEditorParams: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    field: 'lastName',
    editable: true,
  },
]

const rowData = [
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
  const [_gridReadyRef, onGridReady] = useGridReady()
  return (
    <div>
      <div>
        <button onClick={() => {
          console.table(gridRef.current?.getLatestRowData())
        }}>获取getLatestRowData</button>
        <button onClick={() => {
          console.table(rowData)
        }}>获取getClientRowData</button>
        <button onClick={() => {
          console.log(_gridReadyRef.current?.api?.getColumnDefs())
        }}>获取colDefs</button>
        <button onClick={async () => {
          console.log(await gridRef.current?.validate(gridRef.current?.getLatestRowData()))
        }}>检验validate</button>
        <button onClick={() => {
          console.log(_gridReadyRef.current?.api?.getModel())
        }}>获取getModel</button>
      </div>
      <AgGridReact
        ref={gridRef}
        rowKey={'id'}
        onGridReady={onGridReady}
        setGridApi={() => {
          console.log('setGridApi')
        }}
        wrapperStyle={{ width: '100%', height: 400 }}
        editable={true}
        columnDefs={columnDefs}
        rowData={rowData}
        loading
      />
    </div>
  )
}
