import { AxiosRequestConfig, AxiosPromise } from '../types'
import { buildUrl } from '../helpers/url'
import { transformRequestData, transformResponseData } from '../helpers/data'
import { transformHeaders, parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

function xhr(config: AxiosRequestConfig): AxiosPromise {
  const { url, method = 'get', data, headers, responseType, timeout } = config
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url!, true)

    if (responseType) xhr.responseType = responseType
    if (timeout) xhr.timeout = timeout

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4 || xhr.status === 0) return

      const response = {
        data: responseType === 'text' ? xhr.responseText : xhr.response,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders()),
        config,
        response: xhr
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${xhr.status}`, config, null, xhr, response)
        )
      }
    }

    xhr.onerror = () => {
      reject(createError(`Network Error`, config, null, xhr))
    }

    xhr.ontimeout = () => {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', xhr))
    }

    Object.keys(headers).forEach(item => {
      if (!data && item.toLowerCase() === 'content-type') {
        delete headers[item]
      } else {
        xhr.setRequestHeader(item, headers[item])
      }
    })

    xhr.send(data)
  })
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildUrl(url!, params)
}

function processConfig(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  config.url = transformUrl(config)
  config.headers = transformHeaders(headers, data)
  config.data = transformRequestData(data)
}

export default function(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    res.data = transformResponseData(res.data)
    return res
  })
}
