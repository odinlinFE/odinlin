import { useCallback, useMemo } from 'react'

import locales from '../../locales'

import type { GetLocaleTextParams, GridOptions } from 'ag-grid-community'

export default function useLocale(): [GridOptions['localeText'], GridOptions['getLocaleText']] {
  /** A map of key->value pairs for localising text within the grid. */
  const localeText = useMemo<Record<string, string>>(() => {
    return locales
  }, [])

  /** A callback for localising text within the grid. */
  const getLocaleText = useCallback((params: GetLocaleTextParams) => {
    return (locales as Record<string, string>)[`zh-CN.${params.key}`]
  }, [])

  return [localeText, getLocaleText]
}
