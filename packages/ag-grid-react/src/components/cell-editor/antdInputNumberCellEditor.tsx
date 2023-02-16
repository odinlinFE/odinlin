import * as React from 'react'
import { InputNumber } from 'antd'
import cls from 'classnames'

import { useCellEditorSize } from '../../composables'

// import type { ForwardRefRenderFunction } from 'react'
import type { ICellEditorComp, ICellEditorParams } from 'ag-grid-community'
import type { InputNumberProps } from 'antd'
import type { ICellEditorStyle } from '../../type'

// ⭐️ 额外参数
export interface InputNumberParams {
  cellEditorStyle?: ICellEditorStyle
  props?: InputNumberProps
  valueInitter?: (value: any) => any
  valueReturner?: (value: any) => any
}

/**
 * @title InternalInputNumberCellEditor
 * @param {ICellEditorParams} props
 * @param {export declare class CellEditorComp extends PopupComponent implements ICellEditorComp {}} ref
 *
 * @notice // NOTICE: AntdInputNumber的ref能获取最新值;
 * @notice // NOTICE: 有autoFocus属性，无需手动focus;
 * @notice // NOTICE: 按下Enter键不可保存最新值 (需在getgetValue提前调用blur辅助实现);
 */
const InternalInputNumberCellEditor: React.ForwardRefRenderFunction<ICellEditorComp, ICellEditorParams & InputNumberParams> = (props, ref) => {
  const {
    /** 当前cell的值: 无需在此判断是否为number类型，直接传入由InputNumber去处理 */
    value: initialvalue,
    /** 对value初始化，便于传入DatePicker */
    valueInitter,
    /** 对返回值进行自定义格式化 */
    valueReturner,

    /** ⭐️ 额外参数: AntdInputNumber.InputNumberProps */
    props: inputNumberProps = {},
    /** ⭐️ 额外参数: 行内和弹窗编辑器的额外样式 */
    // cellEditorStyle = [{ height: '100%', verticalAlign: 'top' }, { minHeight: 35 }],
  } = props

  /** @title [解构赋值] 去除value和defaultValue属性 */
  const { value: _, defaultValue: __, className, ...restInputNumberProps } = inputNumberProps

  /** @title AntdInputNumber.HTMLInputElement */
  const inputNumberRef = React.useRef<HTMLInputElement>(null)

  /** @title 是否对value做前置处理 */
  const value = React.useMemo<any>(() => {
    return valueInitter ? valueInitter(initialvalue) : initialvalue
  }, [initialvalue, valueInitter])

  /** @title Element Size */
  const oStyle = useCellEditorSize(
    props,
    [{ height: '100%', verticalAlign: 'top' }, { minHeight: 35 }],
  )

  React.useImperativeHandle(ref, () => {
    // console.log('依赖发生变化会重新执行该createHandle函数')
    return {
      ...inputNumberRef.current,
      getGui: () => inputNumberRef.current as HTMLElement,
      getValue: () => {
        // 提前调用blur，可在获取值之前做一层前置校验
        inputNumberRef.current?.blur()

        const currentValue = inputNumberRef.current?.value
        return valueReturner ? valueReturner(currentValue) : currentValue
      },
    }
  }, [valueReturner])

  /** @deprecated 无需手动获取焦点 */
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     const len = inputNumberRef.current?.value.length ?? null
  //     // preventScroll: 想要聚焦同时不发生滚动
  //     inputNumberRef.current?.focus({ preventScroll: true })
  //     inputNumberRef.current?.setSelectionRange(len, len)
  //   }, 10)
  // }, [])

  return (
    <InputNumber
      ref={inputNumberRef}
      defaultValue={value}
      className={cls(className, 'antd-input-number-cell-editor')}
      style={oStyle}
      {...restInputNumberProps}
    />
  )
}

export const AntdInputNumberCellEditor = React.forwardRef<ICellEditorComp, ICellEditorParams & InputNumberParams>(InternalInputNumberCellEditor)

export default AntdInputNumberCellEditor
