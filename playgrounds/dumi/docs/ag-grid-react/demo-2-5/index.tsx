import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import {
  AgGridReact,
  // AntdInputCellEditor,
  // AntdInputNumberCellEditor,
  // AntdPickerDateCellEditor,
  // AntdPickerRangeCellEditor,
  AntdSelectCellEditor,
  useGridReady,
} from '@odinlin/ag-grid-react'
import { LicenseManager } from 'ag-grid-enterprise'
import '@odinlin/ag-grid-react/dist/index.css'

import type {
  IAgGridRef,
  ValidateColumnDef,
} from '@odinlin/ag-grid-react'

LicenseManager.setLicenseKey('your license key')

const options = {
  province: ['北京', '上海', '广东'],
  city: ['北京', '上海', '广州', '深圳'],
  district: ['朝阳区', '海淀区', '东城区', '西城区', '黄浦区', '徐汇区', '长宁区', '静安区', '浦东新区', '宝山区', '嘉定区', '南汇区', '奉贤区'],
}

const rowData = [
  {
    province: '北京',
    city: '北京',
    district: '朝阳区',
  },
]

export default function Index() {
  const gridRef = useRef<IAgGridRef<any> | null>(null)
  const [_gridReadyRef, onGridReady] = useGridReady()

  const [themeName, setThemeName] = useState('ag-theme-alpine')
  const [columnDefs, setColumnDefs] = useState<ValidateColumnDef[]>([
    {
      field: 'province',
      headerName: '省',
      cellEditor: AntdSelectCellEditor,
      cellEditorParams: {
        props: {
          options: options.province.map(item => ({ label: item, value: item })),
        },
      },
    },
    {
      field: 'city',
      headerName: '市',
      cellEditor: AntdSelectCellEditor,
      cellEditorParams: {
        props: {
          options: options.city.map(item => ({ label: item, value: item })),
        },
      },
    },
    {
      field: 'district',
      headerName: '区',
      cellEditor: AntdSelectCellEditor,
      cellEditorParams: {
        props: {
          options: options.district.map(item => ({ label: item, value: item })),
        },
      },
    },
  ])

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
        defaultColDef={{
          editable: true,
        }}
        columnDefs={columnDefs}

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
        stopEditingWhenCellsLoseFocus={true}

        onCellValueChanged={(e) => {
          const colId = e.column.getUniqueId()

          if (colId === 'province') {
            e.api.applyTransactionAsync(
              {
                update: [
                  {
                    ...e.data,
                    city: '',
                    district: '',
                  },
                ],
              },
              ({ add, remove, update }) => {
                console.log('applyTransactionAsync callback: ', add, remove, update)
              })
            return
          }

          if (colId === 'city') {
            e.api.applyTransactionAsync(
              {
                update: [
                  {
                    ...e.data,
                    district: '',
                  },
                ],
              },
              ({ add, remove, update }) => {
                console.log('applyTransactionAsync callback: ', add, remove, update)
              })
            return
          }

          console.log('edit is district')
        }}
      />
    </div>
  )
}
