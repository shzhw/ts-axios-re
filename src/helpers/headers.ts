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

export function parseHeaders(headers: string): any {
  if (!headers) return headers
  let _temp: any = {}
  headers.split('\r\n').forEach(item => {
    item = item.trim()
    if (!item) return
    let [key, val] = item.split(':')
    key = key.trim()
    if (!key) return
    if (val) val = val.trim()
    _temp[key] = val
  })
  return _temp
}
