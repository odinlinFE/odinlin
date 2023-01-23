import type { CSSProperties, FC, MutableRefObject } from 'react'
import type { PaginationProps } from 'antd'
import type { ValidateOption } from 'async-validator'
import type { SharedProps } from 'ag-grid-react'
import type { ColDef, ColumnApi, GridApi } from 'ag-grid-community'

// 遍历对象的所有属性
type Simplify<T> = {
  [P in keyof T]: T[P];
}

// 选中必填，其他不变
type SetRequiredOmit<T, K extends keyof T> = Simplify<
  // 选中必填: Required Pick 必须有的键值的那部分
  // 其他不变: Pick Exclude
  Required<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>
>

// rowKey为函数时的类型声明
export type GetRowKey<RecordType = any> = (record: RecordType) => string

// rowKey类型
export type RowKey = string | GetRowKey<any>

export interface IAgGridProps<TData = any> extends Omit<SharedProps<TData>, 'getRowId' | 'pagination'> {
  // 使用双标签会报 `children: never[]` 没有声明: AgGridReact应继承SharedProps而不是GridOptions

  // 容器类名和样式
  wrapperClassName?: string
  // 容器样式(宽高样式必填)
  wrapperStyle?: SetRequiredOmit<CSSProperties, 'width' | 'height'>

  // 唯一ID: 替代getRowId
  rowKey: string | GetRowKey<any>

  // 是否为加载状态
  loading?: boolean
  // 是否为编辑状态
  editable?: boolean

  // 序号列覆盖默认配置
  serialColDef?: ColDef<TData>
  // 放弃grid自带的分页功能（因为内置的分页是rowData数量大于paginationPageSize才会出现分页）
  pagination?: PaginationProps
  paginationRenderer?: FC<PaginationProps>
}

/** *************************************************/

// 获取grid当前页中的实时数据
export type GetPureRowDataFunc = () => any[]

// async-validator校验结果
export interface ValidateResult {
  valid: boolean
  result: any
  reason: 'success' | 'failed' | 'emptyRules' | 'columnDefs' | 'initial'
}

// async-validator校验函数
export type ValidateFunc = (rowData: any[], option?: ValidateOption) => Promise<ValidateResult>

// 暴露给父组件的ref类型
export interface IAgGridRef<TData = any> {
  api: MutableRefObject<GridApi<TData> | null>
  columnApi: MutableRefObject<ColumnApi | null>
  getPureRowData: GetPureRowDataFunc
  // validate: ValidateFunc
}
