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

/**
 * @title Determines whether an object has a property with the specified name
 * @see https://eslint.org/docs/rules/no-prototype-builtins
 */
export function hasOwnProperty<T = any>(obj: T, property: PropertyKey): boolean {
  if (!obj) { return false }
  return Object.prototype.hasOwnProperty.call(obj, property)
}

/**
 * @title 是否是普通对象
 */
export function isPlainObject(obj: unknown): boolean {
  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString(obj) !== '[object Object]') {
    return false
  }

  const proto = Object.getPrototypeOf(obj)

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  const Ctor = hasOwnProperty(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && toString(Ctor) === '[object Function]'
}
