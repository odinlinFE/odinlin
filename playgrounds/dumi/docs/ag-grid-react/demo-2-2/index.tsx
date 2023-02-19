import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import {
  AgGridReact,
  useGridReady,
} from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'
import '@odinlin/ag-grid-react/dist/index.css'

import type {
  ICellRendererParams,
  ILargeTextEditorParams,
  IRichCellEditorParams,
  ISelectCellEditorParams,
  ITextCellEditorParams,
} from 'ag-grid-community'
import type { IAgGridRef, ValidateColumnDef } from '@odinlin/ag-grid-react'

LicenseManager.setLicenseKey('your license key')

const GenderCellRenderer = (props: ICellRendererParams) => {
  const image = props.value === 'Male' ? 'male.png' : 'female.png'
  const imageSource = `https://www.ag-grid.com/example-assets/genders/${image}`
  // console.log('props?.formatValue 等价于 valueFormatter')
  return (
    <span>
      <img src={imageSource} />
      {props.formatValue ? props.formatValue(props.value) : props.value}
    </span>
  )
}

const columnDefs: ValidateColumnDef[] = [
  {
    field: 'rowHeight',
    headerName: '行高',
    editable: false,
    width: 100,
  },
  {
    field: 'agTextCellEditor',
    cellStyle: { color: 'darkred' },
    valueFormatter: params => `valueFormatter: ${params.value}`,

    editable: (params) => {
      return true
    },
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      useFormatter: false,
      maxLength: 200,
    } as ITextCellEditorParams,
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
    rules: [
      {
        required: true,
      },
      {
        validator(rule: any, value: any, callback: any, source: any, options: any) {
          return true
        },
      },
    ],
  },
  {
    field: 'agSelectCellEditor',

    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      // https://www.ag-grid.com/react-data-grid/provided-cell-editors/#select-cell-editor
      values: ['Male', 'Female'],
    } as ISelectCellEditorParams,
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
  },
  {
    field: 'agRichSelectCellEditor',
    cellRenderer: GenderCellRenderer,
    valueFormatter: params => `valueFormatter ${params.value?.toUpperCase?.()}`,

    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      // https://www.ag-grid.com/react-data-grid/provided-cell-editors/#rich-select-cell-editor
      // cellRenderer中'props?.formatValue 等价于 valueFormatter'
      // cellRenderer can override formatValue
      values: ['Male', 'Female'],
      cellHeight: 40,
      cellRenderer: GenderCellRenderer,
      searchDebounceDelay: 500,
      formatValue: (value: any) => `formatValue ${value?.toUpperCase?.()}`,
    } as IRichCellEditorParams,
    cellEditorPopup: true,
    cellEditorPopupPosition: 'over',
  },
  {
    field: 'agLargeTextCellEditor',
    minWidth: 200,

    editable: (params) => {
      return false
    },
    cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
      // https://www.ag-grid.com/react-data-grid/provided-cell-editors/#large-text-cell-editor
      maxLength: 100,
      rows: 10,
      cols: 50,
    } as ILargeTextEditorParams,
    cellEditorPopup: true,
    cellEditorPopupPosition: 'over',
    rules: [
      {
        required: true,
      },
      {
        validator(rule: any, value: any, callback: any, source: any, options: any) {
          return true
        },
      },
    ],
  },
]

const rowData = [
  {
    id: '1',
    agTextCellEditor: '1111',
    agSelectCellEditor: 'Male',
    agRichSelectCellEditor: 'Male',
    agLargeTextCellEditor: 'I\'m fine!',
    rowHeight: 20,
  },
  {
    id: '2',
    agTextCellEditor: undefined,
    agSelectCellEditor: 'Male',
    agRichSelectCellEditor: 'Male',
    agLargeTextCellEditor: undefined,
    rowHeight: 80,
  },
  {
    id: '3',
    agTextCellEditor: undefined,
    agSelectCellEditor: 'Male',
    agRichSelectCellEditor: 'Male',
    agLargeTextCellEditor: undefined,
    rowHeight: undefined,
  },
]

export default function Index() {
  const gridRef = useRef<IAgGridRef<any> | null>(null)
  const [_gridReadyRef, onGridReady] = useGridReady()

  const [themeName, setThemeName] = useState('ag-theme-alpine')

  return (
    <div>
      <div style={{ display: 'flex' }}>
        {/* <button onClick={() => {
          _gridReadyRef.current?.api?.forEachNode((rowNode) => {
            console.log('rowNode: ', rowNode)
            rowNode.setRowHeight(rowHeight)
          })
          _gridReadyRef.current?.api?.onRowHeightChanged()
        }}>setGetRowHeight</button> */}

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
        columnDefs={columnDefs}
        rowData={rowData}

        // rowHeight={50}
        getRowHeight={(params) => {
          return params.data.rowHeight
        }}

        editable={true}
        // suppressClickEdit
        // singleClickEdit
        stopEditingWhenCellsLoseFocus={false}
      />
    </div>
  )
}
