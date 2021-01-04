import { isPlainObject, isDate } from './utils'

function encode(str: string): string {
  return encodeURIComponent(str)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) return url

  let parts: string[] = []
  Object.keys(params).forEach(key => {
    let _val = params[key]
    if (_val === null || _val === undefined) return

    let values = []
    if (Array.isArray(_val)) {
      values = _val
      key += '[]'
    } else {
      values = [_val]
    }
    values.forEach(_value => {
      if (isPlainObject(_value)) {
        _value = JSON.stringify(_value)
      } else if (isDate(_value)) {
        _value = _value.toISOString()
      }
      parts.push(`${encode(key)}=${encode(_value)}`)
    })
  })

  let _hash: number = url.indexOf('#')
  if (_hash !== -1) {
    url = url.slice(0, _hash)
  }

  return url + (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&')
}
