/**
 * @title 通过toString判断数据类型
 * @param {unknown} target 需要判断的数据
 * @param {object|OBJECT|[object Object]} mode 返回格式处理模式
 * @returns {string}
 */
export function toString(target: unknown, mode?: 'lower' | 'upper'): string {
  const result = Object.prototype.toString.call(target)
  // eg: [object Object]
  if (typeof mode === 'undefined') { return result }

  const typeStr = result.slice(8, -1)
  // eg: object
  if (mode === 'lower') { return typeStr.toLowerCase() }
  // eg: OBJECT
  return typeStr.toUpperCase()
}
