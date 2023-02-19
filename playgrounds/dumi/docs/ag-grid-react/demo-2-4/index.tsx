import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from 'antd'
import {
  AgGridReact,
  // AntdInputCellEditor,
  AntdInputNumberCellEditor,
  // AntdPickerDateCellEditor,
  // AntdPickerRangeCellEditor,
  AntdSelectCellEditor,
  useGridReady,
} from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'

import '@odinlin/ag-grid-react/dist/index.css'

import type { ColDef } from 'ag-grid-enterprise'
import type {
  IAgGridRef,
  ValidateColumnDef,
} from '@odinlin/ag-grid-react'

LicenseManager.setLicenseKey('your license key')

interface IRow {
  value: string | number
  type: 'age' | 'gender' | 'week'
  columnTypes_type: string
}

const aWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const aWeekShort = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

function getData(): IRow[] {
  return [
    { value: 14, type: 'age', columnTypes_type: '1' },
    { value: 'Female', type: 'gender', columnTypes_type: '1' },
    { value: aWeekShort[1], type: 'week', columnTypes_type: '1' },
    { value: 21, type: 'age', columnTypes_type: '1' },
    { value: 'Male', type: 'gender', columnTypes_type: '1' },
    { value: aWeekShort[3], type: 'week', columnTypes_type: '1' },
  ]
}

export default function Index() {
  const gridRef = useRef<IAgGridRef<any> | null>(null)
  const [_gridReadyRef, onGridReady] = useGridReady()

  const [themeName, setThemeName] = useState('ag-theme-alpine')
  const [rowData, setRowData] = useState<IRow[]>(getData())
  const [columnDefs, setColumnDefs] = useState<ValidateColumnDef[]>([
    {
      field: 'type',
      width: 300,
      valueFormatter: (params) => {
        const { type } = params.data
        if (type === 'age') {
          return `${type} 年龄 (InputNumber)`
        }
        if (type === 'gender') {
          return `${type} 性别 (agRichSelectCellEditor)`
        }
        if (type === 'week') {
          return `${type} 星期 (AntdSelectCellEditor)`
        }
        return type
      },
    },
    {
      field: 'value',
      editable: true,
      cellEditorSelector: (params) => {
        if (params.data.type === 'age') {
          return {
            component: AntdInputNumberCellEditor,
          }
        }

        if (params.data.type === 'gender') {
          return {
            component: 'agRichSelectCellEditor',
            params: {
              values: ['Male', 'Female'],
            },
            popup: true,
          }
        }

        if (params.data.type === 'week') {
          return {
            component: AntdSelectCellEditor,
            params: {
              props: {
                options: aWeekShort.map(item => ({ value: item, label: item })),
              },
            },
            popup: true,
            popupPosition: 'under',
          }
        }
        return undefined
      },
    },
    {
      field: 'columnTypes_type',
      headerName: 'columnTypes & type',
      type: 'editableColumn',
    },
  ])

  const isCellEditable = useCallback((params: any) => {
    return true
  }, [])
  const columnTypes = useMemo<{
    [key: string]: ColDef
  }>(() => {
    return {
      editableColumn: {
        editable: (params) => {
          return isCellEditable(params)
        },
        cellStyle: (params) => {
          if (isCellEditable(params)) {
            return { backgroundColor: 'lightBlue' }
          }
        },
      },
    }
  }, [])

  return (
      <div>
      <div style={{ display: 'flex' }}>
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

        <Button type="primary" size="small" style={{ marginLeft: 5 }}>测试token是否局部主题影响</Button>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 5 }}
          onClick={() => {
            setThemeName(themeName => themeName === 'ag-theme-alpine' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine')
          }}
        >切换主题</Button>
      </div>
      <AgGridReact
        ref={gridRef}
        rowKey={'id'}
        onGridReady={onGridReady}
        className={themeName}
        wrapperStyle={{ width: '100%', height: 400 }}

        rowData={rowData}
        columnDefs={columnDefs}
        columnTypes={columnTypes}

        // rowHeight={50}
        getRowHeight={(params) => {
          return params.data.rowHeight
        }}

        // rowStyle={{ height: 50 }}
        getRowStyle={(params) => {
          // console.log('params: ', params)
          return { '--ag-line-height': `${params.node.rowHeight}px` }
        }}

        editable={true}
        // suppressClickEdit
        // singleClickEdit
        stopEditingWhenCellsLoseFocus={false}
      />
    </div>
  )
}
