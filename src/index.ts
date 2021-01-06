import Axios, { AxiosInterface } from './core/axios'
import { extend } from './helpers/utils'

export * from './types'

export default (function(): AxiosInterface {
  const axios = new Axios()
  const instance = Axios.prototype.request.bind(axios)
  extend(instance, axios)

  return instance as AxiosInterface
})()
