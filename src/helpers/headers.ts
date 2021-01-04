import { isPlainObject } from './utils'

function normailizedHeadersName(headers: any, name: string): void {
  if (!headers) return
  Object.keys(headers).forEach(item => {
    if (item !== name && name.toLowerCase() === item.toLowerCase()) {
      headers[name] = headers[item]
      delete headers[item]
    }
  })
}

export function transformHeaders(headers: any, data: any): any {
  if (!headers) return headers

  normailizedHeadersName(headers, 'Content-Type')

  if (isPlainObject(data) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return headers
}
