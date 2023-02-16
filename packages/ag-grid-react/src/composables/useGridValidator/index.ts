import * as React from 'react'
import Schema from 'async-validator'

// import type { ColDef } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import type {
  Rule,
  // RuleItem,
  Rules,
  ValidateError,
  ValidateFieldsError,
  ValidateOption,
  // Values,
} from 'async-validator'
import type { ValidateFunc, useGridValidatorReturn } from '../../type'
import type { ColDef, GridApi } from 'ag-grid-community'

export default function useGridValidator(gridRef: React.RefObject<AgGridReact<any>>): useGridValidatorReturn {
  // 内部state
  const [validateError, setValidateError] = React.useState<ValidateFieldsError>({})

  // 清空校验错误
  const clearValidateError = React.useCallback(() => {
    setValidateError({})
  }, [])

  // 根据 rowId 和 ColId 获取当前cell校验结果
  const getValidateError = React.useCallback((rowIdAndColId: string): ValidateError[] | undefined => {
    return validateError[rowIdAndColId]
  }, [validateError])

  // 执行校验 (计算rules并执行validator.validate)
  const validate: ValidateFunc = React.useCallback(async (
    rowData: any[],
    option: ValidateOption = {
      /**
       * 方式一: [避免async-validator全局警告](https://github.com/yiminghe/async-validator#how-to-avoid-global-warning)
       * 方式二: 开启suppressWarning => 禁止无效值的内部警告
       */
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

    // 获取可编辑的rules
    const rules = getEditableRules(columnDefs)
    if (Object.keys(rules).length <= 0) { return { valid: true, result: rowData, reason: 'emptyRules' } }

    /** @uri https://github.com/yiminghe/async-validator#deep-rules */
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
      const errors = error?.errors ?? []
      const fields: any[] = error?.fields ?? []

      const oFields = formatValidateError(fields, gridRef.current?.api)

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

/**
 * @title 遍历得到所有 可编辑的列(editable的值为true 或 函数) 的rules
 * @param columnDefs 列定义
 * @returns {Rules} rules
 * @uri https://github.com/yiminghe/async-validator#validate
 * // NOTICE: 当 editable 为函数时，在 RuleItem.validator 和 RuleItem.asyncValidator 中自定义，判断当前cell是否可编辑，然后是否是编辑的才校验
 */
function getEditableRules(columnDefs: any[]) {
  const rules = columnDefs.reduce<Rules>((prev, cur, index, arr) => {
    // 跳过携带 children 的 ColGroupDef，是没有真实 Cell 的
    if (Object.prototype.hasOwnProperty.call(cur, 'children')) { return prev }

    const {
      colId = '',
      // field = '',
      editable,
      rules,
    } = cur as (ColDef<any> & { rules?: Rule })
    if (colId && editable && rules) { prev[colId] = rules }

    return prev
  }, {})

  return rules
}

/**
 * @title 对校验结果进行格式化处理 <key改为id和colId的组合字符串>
 * @param error
 * @param api
 * @returns
 * // NOTICE: 不能解构g etDisplayedRowAtIndex 直接调用此方法，必须 api?.getDisplayedRowAtIndex 调用 <大概率是解构会丢失this指向>
 */
function formatValidateError(fields: any[], api?: GridApi) {
  const oFields: ValidateFieldsError = {}

  for (const key in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      const element: ValidateError[] = fields[key]
      const [_source, index, field] = key.split('.')

      // getRowNode(id) or getDisplayedRowAtIndex(index)
      const rowNode = api?.getDisplayedRowAtIndex?.(parseInt(index, 10))

      if (rowNode?.id && rowNode?.data) {
        const key = `${rowNode.id}.${field}`
        oFields[key] = element.map(item => ({ ...item, field: key, fieldValue: rowNode.data[field] }))
      }
    }
  }
  return oFields
}
