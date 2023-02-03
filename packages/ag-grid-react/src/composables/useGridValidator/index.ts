import { useCallback, useState } from 'react'
import Schema from 'async-validator'

import type { ColDef } from 'ag-grid-community'
import type { RefObject } from 'react'
import type { AgGridReact } from 'ag-grid-react'
import type {
  // Rule,
  // RuleItem,
  Rules,
  ValidateError,
  ValidateOption,
  // Values,
} from 'async-validator'
import type { ValidateFunc, useGridValidatorReturn } from '../../type'

export default function useGridValidator(gridRef: RefObject<AgGridReact<any>>): useGridValidatorReturn {
  const [validateError, setValidateError] = useState<Record<string, ValidateError[]>>({})

  const clearValidateError = useCallback(() => {
    setValidateError({})
  }, [])

  const getValidateError = useCallback((rowIdAndColId: string) => {
    return validateError[rowIdAndColId]
  }, [validateError])

  const validate: ValidateFunc = useCallback(async (
    rowData: any[],
    option: ValidateOption = {
    // 是否禁止无效值的内部警告
      suppressWarning: true,
      // 针对整个校验对象的，如果某个字段校验不通过，那么后边所有的字段就不再校验了
      first: false,
      // 同一个字段如果有多个校验规则（即规则为RuleItem[]类型时），一旦出现校验不通过的规则将停止验证数组内的其余规则
      firstFields: true,
    },
  ) => {
    // api获取columnDefs
    const columnDefs = gridRef.current?.api?.getColumnDefs()
    if (!columnDefs) { return { valid: true, result: rowData, reason: 'columnDefs' } }

    // 遍历得到所有可编辑的列的rules
    const rules = columnDefs.reduce<Rules>((prev, cur, index, arr) => {
      if (Object.prototype.hasOwnProperty.call(cur, 'children')) { return prev }
      const { colId = '', field = '', editable = false, cellEditorParams } = cur as ColDef<any>
      console.log(1111, colId, field)
      if (field && editable && cellEditorParams?.rules) { prev[field] = cellEditorParams.rules }
      return prev
    }, {})
    if (Object.keys(rules).length <= 0) { return { valid: true, result: rowData, reason: 'emptyRules' } }

    // defaultField {array/object} type为数组或对象类型时一起使用，用来验证数组或对象中包含的所有值，进行深层验证
    // fields {object} type为数组或对象类型时一起使用，分别验证array/object类型的数据中的值，实现深度验证
    const validator = new Schema({
      source: {
        type: 'array',
        defaultField: [
          {
            type: 'object',
            fields: rules,
          },
        ],
      },
    })

    try {
      const result = await validator.validate({ source: rowData }, option)
      return { valid: true, result, reason: 'success' }
    }
    catch (error: any) {
      const oFields: Record<string, ValidateError[]> = {}
      const errors = error?.errors ?? []
      const fields = error?.fields ?? []

      for (const key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
          const element: ValidateError[] = fields[key]
          const [_source, index, field] = key.split('.')
          console.log(222, 'key: ', key)

          // getRowNode(id)
          const rowNode = gridRef.current?.api?.getDisplayedRowAtIndex(parseInt(index, 10))

          if (rowNode?.id && rowNode?.data) {
            const key = `${rowNode.id}.${field}`
            oFields[key] = element.map(item => ({ ...item, field: key, fieldValue: rowNode.data[field] }))
          }
        }
      }

      setValidateError(oFields)
      return {
        valid: false,
        result: { errors, fields: oFields },
        reason: 'failed',
      }
    }
  }, [])

  return {
    // validateError,
    validate,
    getValidateError,
    clearValidateError,
  }
}
