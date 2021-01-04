import { AxiosRequestConfig } from './types'
import { buildUrl } from './helpers/url'
import { transformRequestData } from './helpers/data'
import { transformHeaders } from './helpers/headers'

function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data, params, headers } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method, url, true)

  Object.keys(headers).forEach(item => {
    if (!data && item.toLowerCase() === 'content-type') {
      delete headers[item]
    } else {
      xhr.setRequestHeader(item, headers[item])
    }
  })

  xhr.send(data)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildUrl(url, params)
}

function processConfig(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  config.url = transformUrl(config)
  config.headers = transformHeaders(headers, data)
  config.data = transformRequestData(data)
}

export default function(config: AxiosRequestConfig): void {
  processConfig(config)
  return xhr(config)
}
