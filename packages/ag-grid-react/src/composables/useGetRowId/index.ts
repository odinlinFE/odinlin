import * as React from 'react'

import type { GetRowIdFunc } from 'ag-grid-community'
import type { RowKey } from '../../type'

/**
 * @title 设置getRowId属性会默认开启immutableData不可变
 * @notice 不可变存储: 所有网格状态（行和区域选择、筛选器、排序等）都会保留；而不是rowData不可变
 * @desc 行选择 保留行选择
 * @desc 行分组 组保持/更新，打开的组保持打开状态
 * @desc 行刷新 在 DOM 中仅更新更改的行
 * @desc 行动画 移动的行以动画形式显示到新位置
 * @desc 单元格闪烁 可以闪烁更改的值以显示更改
 *
 * @defect 目前只能获取对象第一层级路径下的值，不想引入lodash或者自己实现（增加包体积）
 */
export default function useGetRowId(rowKey: RowKey): GetRowIdFunc {
  return React.useCallback((params) => {
    const record = params.data
    if (typeof rowKey === 'string') { return record[rowKey] }
    return rowKey(record)
  }, [rowKey])
}
