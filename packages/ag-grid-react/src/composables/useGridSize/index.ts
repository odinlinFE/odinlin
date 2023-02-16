import * as React from 'react'

/**
 * @title 根据domLayout设置grid容器的宽高，grid将在父元素两个方向上 100% 填充
 * @returns {CSSProperties}
 * @desc `domLayout=normal`：默认值: 垂直、水平滚动auto。
 * @desc `domLayout=autoHeight`：无垂直滚动条，水平滚动auto。 - 默认有minHeight，如需清除：`.ag-center-cols-clipper {min-height: unset !important;}`
 * @desc `domLayout=print`：无垂直、水平滚动条，网格呈现所有行和列。[打印文档](https://www.ag-grid.com/javascript-data-grid/printing/)
 */
export default function useGridSize(
  domLayout?: 'normal' | 'autoHeight' | 'print',
  wrapperStyle?: React.CSSProperties,
) {
  return React.useMemo(() => {
    if (domLayout === 'autoHeight') {
      return Object.assign({}, wrapperStyle, { height: undefined })
    }

    if (domLayout === 'print') {
      return Object.assign({}, wrapperStyle, { width: undefined, height: undefined })
    }

    // 如果不是autoHeight或print模式, 则直接返回
    return wrapperStyle
  }, [domLayout, wrapperStyle])
}
