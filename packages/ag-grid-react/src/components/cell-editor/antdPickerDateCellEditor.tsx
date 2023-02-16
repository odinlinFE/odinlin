import * as React from 'react'
import {
  DatePicker,
  // TimePicker
} from 'antd'

import { useCellEditorSize } from '../../composables'

// import type { ForwardRefRenderFunction } from 'react'
import type { ICellEditorComp, ICellEditorParams } from 'ag-grid-community'
import type { DatePickerProps } from 'antd'
import type {
  // PickerRef,
  DatePickRef,
  // RangePickerRef,
} from 'antd/es/date-picker/generatePicker/interface'
import type { ICellEditorStyle } from '../../type'

// ⭐️ 额外参数
export interface DatePickerParams {
  cellEditorStyle?: ICellEditorStyle
  props?: DatePickerProps
  valueInitter?: (value: any) => any
  valueReturner?: (value: any) => any
}

/**
 * @title InternalPickerDateCellEditor
 * @param {ICellEditorParams} props
 * @param {export declare class CellEditorComp extends PopupComponent implements ICellEditorComp {}} ref
 *
 * @notice // NOTICE: DatePicker的ref不能获取最新值 (自定义受控逻辑);
 * @notice // NOTICE: 有autoFocus属性，无需手动focus (但是没有defaultOpen，不能默认展开下拉菜单);
 * @notice // NOTICE: 按下Enter键不可保存最新值 (只支持下拉列表收起后，下拉列表打开无法通过方向键和回车键实现选中);
 */
const InternalPickerDateCellEditor: React.ForwardRefRenderFunction<ICellEditorComp, ICellEditorParams & DatePickerParams> = (props, ref) => {
  const {
    /** 当前cell的值 */
    value: initialvalue,
    /** 对value初始化，便于传入DatePicker */
    valueInitter,
    /** 对返回值进行自定义格式化 */
    valueReturner,

    /**
     * ⭐️ 额外参数: AntdDatePicker.DatePickerProps
     * 没有dropdownMatchSelectWidth属性可以让下拉菜单和选择器同宽（需要css实现）
     */
    props: pickerProps = {},
    /** ⭐️ 额外参数: 行内和弹窗编辑器的额外样式 */
    // cellEditorStyle = [{ verticalAlign: 'top' }, { minHeight: 35 }],
  } = props

  /** @title [解构赋值] 去除value属性 */
  const { value: _, onChange, ...restPickerProps } = pickerProps

  /** @title AntdDatePicker.DatePickRef */
  const pickerRef: DatePickRef<any> = React.useRef<any>(null)

  /** @title 受控组件的state */
  const [value, setValue] = React.useState<any>(valueInitter ? valueInitter(initialvalue) : initialvalue)

  /** @title 组件改变回调 */
  const handleChange = React.useCallback((value: any, dateString: string) => {
    setValue(value)
    onChange?.(value, dateString)
  }, [onChange])

  /** @title Element Size */
  const oStyle = useCellEditorSize(
    props,
    [{ verticalAlign: 'top' }, { minHeight: 35 }],
  )

  // @ts-expect-error 缺少getGui
  React.useImperativeHandle(ref, () => {
    return {
      ...pickerRef.current,
      // getGui: () => document.createElement('a'),
      getValue: () => {
        return valueReturner ? valueReturner(value) : value?.format('YYYY-MM-DD HH:mm:ss')
      },
    }
  }, [value, valueReturner])

  /**
   * /// DatePicker 和 RangePicker 不同 picker 下的不同类型功能
   *
   * time    <TimePicker /> OR <DatePicker picker="time" /> 时分秒
   * date    <DatePicker /> 年月日
   * date    <DatePicker showTime={true} /> 年月日+时分秒
   * week    <DatePicker picker="week" /> 年周
   * month   <DatePicker picker="month" /> 年月
   * quarter <DatePicker picker="quarter" /> 年季度
   * year    <DatePicker picker="year" /> 年
   */
  return (
    <DatePicker
      ref={pickerRef}
      value={value}
      onChange={handleChange}
      style={oStyle}
      {...restPickerProps}
    />
  )
}

export const AntdPickerDateCellEditor = React.forwardRef<ICellEditorComp, ICellEditorParams & DatePickerParams>(InternalPickerDateCellEditor)

export default AntdPickerDateCellEditor
