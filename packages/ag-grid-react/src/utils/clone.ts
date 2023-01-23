/**
 * @title 简单深拷贝
 * @desc 后端数据一般是基础数据类型，深拷贝不需要额外使用第三方库；能够接受stringify的缺陷
 * @notice <NaN> JSON.stringify({a:NaN}) => '{"a":null}'
 * @notice <函数> JSON.stringify({a:isNaN}) => '{}'
 * @notice <undefined> JSON.stringify({a:undefined}) => '{}'
 */
export function cloneDeep(value: unknown, defaultValue?: any): any {
  let target
  try {
    target = JSON.parse(JSON.stringify(value))
  }
  catch (error) {
    target = defaultValue
  }
  return target
}
