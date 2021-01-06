import { AxiosPromise, AxiosRequestConfig, Method } from '../types'
import dispatchRequest from './dispatchRequest'

interface Axios {
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterface extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export default class {
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithoutData(url, 'get', config)
  }
  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this._requestMthodWithoutData(url, 'post', data, config)
  }
  private _requestMthodWithoutData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return dispatchRequest(
      Object.assign(config || {}, {
        url,
        method,
        data
      })
    )
  }
}
