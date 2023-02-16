import * as React from 'react'
import { Select } from 'antd'
import cls from 'classnames'

import { useCellEditorSize } from '../../composables'

// import type { ForwardRefRenderFunction } from 'react'
import type { ICellEditorComp, ICellEditorParams } from 'ag-grid-community'
import type { SelectProps } from 'antd'
import type { BaseSelectRef } from 'rc-select'
import type { ICellEditorStyle } from '../../type'

// ⭐️ 额外参数
export interface SelectParams {
  cellEditorStyle?: ICellEditorStyle
  props?: SelectProps
}

/**
 * @title InternalSelectCellEditor
 * @param {ICellEditorParams} props
 * @param {export declare class CellEditorComp extends PopupComponent implements ICellEditorComp {}} ref
 *
 * @notice // NOTICE: AntdInputNumber的ref不能获取最新值 (自定义受控逻辑);
 * @notice // NOTICE: 有autoFocus和defaultOpen属性，无需手动focus;
 * @notice // NOTICE: 按下Enter键不可保存最新值 (只支持下拉列表收起后，下拉列表打开无法通过方向键和回车键实现选中);
 */
const InternalSelectCellEditor: React.ForwardRefRenderFunction<ICellEditorComp, ICellEditorParams & SelectParams> = (props, ref) => {
  const {
    /** 当前cell的值 */
    value: initialvalue,

    /**
     * ⭐️ 额外参数: AntdSelect.SelectProps
     * 开启 autoFocus和defaultOpen: 可进入编辑时focus
     * 开启 labelInValue:
     *   <默认情况下 onChange 里只能拿到 value，如果需要拿到选中的节点文本 label，可以使用 labelInValue 属性。>
     *   // NOTICE: 如果业务中需要同时用到value和label（包括但不限于联动）的情况，最好开启 labelInValue，当前cell的值也需满足`{ value: string | number, label?: ReactNode }`格式
     * 开启 mode: combobox 为单选；multiple 可多选； tags 可多选且可输入
     * 开启 maxTagCount: 多选下通过响应式布局让选项自动收缩。该功能对性能有所消耗，不推荐在大表单场景下使用。
     * 开启 virtual: 默认开启虚拟滚动，设置 false 时关闭虚拟滚动
     * 开启 fieldNames: 自定义节点 label、value、options 的字段
     */
    props: selectProps = {},
    /** ⭐️ 额外参数: 行内和弹窗编辑器的额外样式 */
    // cellEditorStyle = [{ verticalAlign: 'top' }, { minHeight: 35 }],
  } = props

  /** @title [解构赋值] 去除value属性 */
  const { value: _, onChange, className, ...restSelectProps } = selectProps

  /** @title AntdRcSelect.BaseSelectRef */
  const selectRef = React.useRef<BaseSelectRef>(null)

  /** @title 受控组件的state */
  const [value, setValue] = React.useState<any>(initialvalue)

  /** @title 组件改变回调 */
  const handleChange = React.useCallback((value: any, option: any) => {
    setValue(value)
    onChange?.(value, option)
  }, [onChange])

  /** @title Element Size */
  const oStyle = useCellEditorSize(
    props,
    [{ verticalAlign: 'top' }, { minHeight: 35 }],
  )

  // @ts-expect-error 缺少getGui
  React.useImperativeHandle(ref, () => {
    return {
      ...selectRef.current,
      // getGui: () => document.createElement('a'),
      getValue: () => {
        return value
      },
    }
  }, [value])

  return (
    <Select
      ref={selectRef}
      value={value}
      onChange={handleChange}
      className={cls(className, 'antd-select-cell-editor')}
      style={oStyle}
      {...restSelectProps}
    />
  )
}

export const AntdSelectCellEditor = React.forwardRef<ICellEditorComp, ICellEditorParams & SelectParams>(InternalSelectCellEditor)

export default AntdSelectCellEditor
