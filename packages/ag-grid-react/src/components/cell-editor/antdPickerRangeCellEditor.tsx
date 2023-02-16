import * as React from 'react'
import { DatePicker, theme } from 'antd'
import cls from 'classnames'

import { toString } from '../../utils'
import { useCellEditorSize } from '../../composables'

// import type { ForwardRefRenderFunction } from 'react'
import type { ICellEditorComp, ICellEditorParams } from 'ag-grid-community'
import type {
  // PickerRef,
  // DatePickRef,
  RangePickerRef,
} from 'antd/es/date-picker/generatePicker/interface'
import type { ICellEditorStyle } from '../../type'

// ⭐️ 额外参数
export interface RangePickerParams {
  cellEditorStyle?: ICellEditorStyle
  vertical?: boolean
  props?: any
  valueInitter?: (value: any) => any
  valueReturner?: (value: any) => any
}

const { useToken } = theme

/**
 * @title InternalPickerRangeCellEditor
 * @param {ICellEditorParams} props
 * @param {export declare class CellEditorComp extends PopupComponent implements ICellEditorComp {}} ref
 *
 * @notice // NOTICE: Picker的ref不能获取最新值 (自定义受控逻辑);
 * @notice // NOTICE: 有autoFocus属性，无需手动focus (但是没有defaultOpen，不能默认展开下拉菜单);
 * @notice // NOTICE: 按下Enter键不可保存最新值 (只支持下拉列表收起后，下拉列表打开无法通过方向键和回车键实现选中);
 */
const InternalPickerRangeCellEditor: React.ForwardRefRenderFunction<ICellEditorComp, ICellEditorParams & RangePickerParams> = (props, ref) => {
  const {
    /** 当前cell的值 */
    value: initialvalue,
    /** 对value初始化，便于传入RangePicker */
    valueInitter,
    /** 对返回值进行自定义格式化 */
    valueReturner,

    /**
     * ⭐️ 额外参数: AntdRangePicker.RangePickerProps
     * 没有dropdownMatchSelectWidth属性可以让下拉菜单和选择器同宽（需要css实现）
     */
    props: pickerProps = {},
    /** ⭐️ 额外参数: 行内和弹窗编辑器的额外样式 */
    // cellEditorStyle = [{ verticalAlign: 'top' }, { minHeight: 35 }],
    /** ⭐️ 额外参数: 是否垂直排列 */
    vertical = false,
  } = props

  /** @title [解构赋值] 去除value属性 */
  const { value: _, onChange, className, popupClassName, ...restPickerProps } = pickerProps

  /** @title AntdRangePicker.RangePickRef */
  const pickerRef: RangePickerRef<any> = React.useRef<any>(null)

  /** @title 受控组件的state */
  const [value, setValue] = React.useState<any>(valueInitter ? valueInitter(initialvalue) : initialvalue)

  /** @title 组件改变回调 */
  const handleChange = React.useCallback((value: any, formatString: [string, string]) => {
    const assignValue = toString(value, 'lower') === 'array' ? value : [null, null]
    setValue(assignValue)
    onChange?.(assignValue, formatString)
  }, [onChange])

  /** @title Element Size And 传递主题的变量当作cssvar */
  const { token } = useToken()
  const oStyle = useCellEditorSize(props,
    [{ verticalAlign: 'top' }, { minHeight: 35 }],
    {
      '--antd-picker-editor-color-border': token.colorBorder,
      '--antd-picker-editor-color-primary-hover': token.colorPrimaryHover,
    },
  )

  /** @title 类名合并处理 */
  const oClassName = React.useMemo(() => {
    return {
      className: cls(className, { 'antd-picker-range-cell-editor-vertical': vertical }),
      popupClassName: cls(popupClassName, { 'antd-picker-dropdown-range-cell-editor-vertical': vertical }),
    }
  }, [className, popupClassName, vertical])

  // @ts-expect-error 缺少getGui
  React.useImperativeHandle(ref, () => {
    return {
      ...pickerRef.current,
      // getGui: () => document.createElement('a'),
      getValue: () => {
        const assignValue = toString(value, 'lower') === 'array' ? value : [null, null]
        return valueReturner
          ? valueReturner(assignValue)
          : assignValue.map((item: any) => item?.format('YYYY-MM-DD HH:mm:ss'))
      },
    }
  }, [value, valueReturner])

  return (
    <DatePicker.RangePicker
      ref={pickerRef}
      value={value}
      onChange={handleChange}
      // If false, 不仅border透明色(但仍存在) 而且背景色也是透明色。<背景透明不利于切换主题>
      bordered={true}
      // 注意: 日期范围 起始项 和 结束项 的值都为空时，不会出现 clearIcon
      allowClear={true}
      // RcRangePicker默认分隔符 ~
      separator={undefined}
      {...oClassName}
      style={oStyle}
      {...restPickerProps}
    />
  )
}

export const AntdPickerRangeCellEditor = React.forwardRef<ICellEditorComp, ICellEditorParams & RangePickerParams>(InternalPickerRangeCellEditor)

export default AntdPickerRangeCellEditor
