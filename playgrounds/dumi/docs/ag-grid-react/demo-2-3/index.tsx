import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import dayjs from 'dayjs'
import {
  AgGridReact,
  AntdInputCellEditor,
  AntdInputNumberCellEditor,
  AntdPickerDateCellEditor,
  AntdPickerRangeCellEditor,
  AntdSelectCellEditor,
  useGridReady,
} from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'
import '@odinlin/ag-grid-react/dist/index.css'

import type { ICellEditorComp } from 'ag-grid-community'
import type {
  IAgGridRef, InputNumberParams, InputParams,
  SelectParams,
  ValidateColumnDef,
} from '@odinlin/ag-grid-react'

LicenseManager.setLicenseKey('your license key')

const columnDefs: ValidateColumnDef[] = [
  {
    field: 'rowHeight',
    headerName: '行高',
    editable: false,
    width: 100,
  },
  {
    field: 'AntdInputCellEditor',

    editable: true,
    cellEditor: AntdInputCellEditor,
    cellEditorParams: (params: ICellEditorComp): InputParams => {
      // https://www.ag-grid.com/react-data-grid/cell-editors/#dynamic-parameters
      return {
        props: {
          placeholder: '请输入',
        },
      }
    },
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    field: 'AntdInputNumberCellEditor',

    editable: true,
    cellEditor: AntdInputNumberCellEditor,
    cellEditorParams: {
      props: {
        autoFocus: true,
      },
    } as InputNumberParams,
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
    // rules: [],
  },
  {
    field: 'AntdSelectCellEditor',

    editable: true,
    cellEditor: AntdSelectCellEditor,
    cellEditorParams: {
      props: {
        placeholder: '请选择',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
          { value: 'd', label: 'D', disabled: true },
          { value: 'e', label: 'EEE' },
          { value: 'f', label: 'FFF' },
        ],
        autoFocus: true,
        defaultOpen: true,
        allowClear: true,
        // labelInValue: true,
        mode: ['combobox', 'multiple', 'tags'][0],
        // maxTagCount: 'responsive',
        // bordered: false,
      },
    } as SelectParams,
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
  },
  {
    field: 'AntdPickerDateCellEditor',

    editable: true,
    cellEditor: AntdPickerDateCellEditor,
    cellEditorParams: {
      valueInitter: (value: any) => dayjs(value),
      props: {
        picker: 'time',
        autoFocus: false,
      },
    },
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
  },
  {
    field: 'AntdPickerRangeCellEditor',

    editable: true,
    cellEditor: AntdPickerRangeCellEditor,
    cellEditorParams: {
      vertical: false,
      valueInitter: (value: any) => {
        return value?.map((item: any) => dayjs(item))
      },
      props: {
        allowClear: true,
        picker: 'time',
        autoFocus: false,
        disabled: false,
        bordered: false,
      },
    },
    cellEditorPopup: false,
    cellEditorPopupPosition: 'over',
  },
]

const rowData = [
  {
    id: '1',
    AntdInputCellEditor: '1111',
    AntdInputNumberCellEditor: 1221,
    AntdSelectCellEditor: 'a',
    AntdPickerDateCellEditor: '2022',
    AntdPickerRangeCellEditor: ['2022', '2023'],
    rowHeight: 21,
  },
  {
    id: '2',
    AntdInputCellEditor: undefined,
    AntdInputNumberCellEditor: undefined,
    AntdSelectCellEditor: undefined,
    AntdPickerDateCellEditor: undefined,
    AntdPickerRangeCellEditor: undefined,
    rowHeight: 100,
  },
  {
    id: '3',
    AntdInputCellEditor: undefined,
    AntdInputNumberCellEditor: undefined,
    AntdSelectCellEditor: undefined,
    AntdPickerDateCellEditor: undefined,
    AntdPickerRangeCellEditor: undefined,
    rowHeight: undefined,
  },
  {
    id: '4',
    AntdInputCellEditor: undefined,
    AntdInputNumberCellEditor: undefined,
    AntdSelectCellEditor: undefined,
    AntdPickerDateCellEditor: undefined,
    AntdPickerRangeCellEditor: undefined,
    rowHeight: 20,
  },
]

export default function Index() {
  const gridRef = useRef<IAgGridRef<any> | null>(null)
  const [_gridReadyRef, onGridReady] = useGridReady()

  const [themeName, setThemeName] = useState('ag-theme-alpine')

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
            _gridReadyRef.current?.api?.setColumnDefs(columnDefs.map(item => ({ ...item, cellEditorPopup: true })))
          }}
        >cellEditorPopup</Button>
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
