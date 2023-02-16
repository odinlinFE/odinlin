import * as React from 'react'
import { Input } from 'antd'

import { useCellEditorSize } from '../../composables'

// import type { ForwardRefRenderFunction } from 'react'
import type { ICellEditorComp, ICellEditorParams } from 'ag-grid-community'
import type { InputProps, InputRef } from 'antd'
import type { ICellEditorStyle } from '../../type'

// ⭐️ 额外参数
export interface InputParams {
  cellEditorStyle?: ICellEditorStyle
  props?: InputProps
}

/**
 * @title InternalInputCellEditor
 * @param {ICellEditorParams} props
 * @param {export declare class CellEditorComp extends PopupComponent implements ICellEditorComp {}} ref
 *
 * @notice // NOTICE: AntdInputNumber的ref能获取最新值;
 * @notice // NOTICE: 没有autoFocus属性，需要手动focus;
 * @notice // NOTICE: 按下Enter键可保存最新值;
 */
const InternalInputCellEditor: React.ForwardRefRenderFunction<ICellEditorComp, ICellEditorParams & InputParams> = (props, ref) => {
  const {
    /** 当前cell的值 */
    value: initialvalue,

    /** ⭐️ 额外参数: AntdInput.InputProps */
    props: inputProps = {},
    /** ⭐️ 额外参数: 行内和弹窗编辑器的额外样式 */
    // cellEditorStyle = [undefined, { minHeight: 35 }],
  } = props

  /** @title [解构赋值] 去除value属性 */
  const { value: _, ...restInputProps } = inputProps

  /** @title AntdInput.InputRef */
  const inputRef = React.useRef<InputRef>(null)

  /** @title Element Size */
  const oStyle = useCellEditorSize(
    props,
    [undefined, { minHeight: 35 }],
  )

  React.useImperativeHandle(ref, () => {
    return {
      ...inputRef.current,
      getGui: () => inputRef.current?.input as HTMLElement,
      getValue: () => {
        return inputRef.current?.input?.value
      },
    }
  }, [])

  // [等价于afterGuiAttached](https://github.com/facebook/react/issues/7835#issuecomment-395504863)
  React.useEffect(() => {
    // [手动执行focus事件] focus = element.focus + element.setSelectionRange
    // https://github.com/react-component/input/blob/master/src/utils/commonUtils.ts#L72:17
    setTimeout(() => inputRef.current?.focus({ cursor: 'end' }), 10)
  }, [])

  return (

    <Input
      ref={inputRef}
      defaultValue={initialvalue}
      style={oStyle}
      {...restInputProps}
    />
  )
}

export const AntdInputCellEditor = React.forwardRef<ICellEditorComp, ICellEditorParams & InputParams>(InternalInputCellEditor)

export default AntdInputCellEditor
