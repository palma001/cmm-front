import axiosInstance, {
  updateAxiosInstance,
  setAxiosHeader
} from './AxiosIntance'
import config, {
  setConfig
} from './config'

export const getData = function (url, params) {
  return axiosInstance.get(url.join('/'), {
    params
  }).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw new Error(err)
    }
  })
}

export const getOneData = function (url) {
  return axiosInstance.get(url.join('/')).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw new Error(err)
    }
  })
}
export const postData = function (url, params) {
  return axiosInstance.post(url.join('/'), lowerCase(params)).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw new Error(err)
    }
  })
}
export const putData = function (url, params) {
  lowerCase(params)
  return axiosInstance.put(url.join('/'), lowerCase(params)).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw new Error(err)
    }
  })
}
export const deleteData = function (url, params) {
  return axiosInstance.delete(url.join('/')).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw new Error(err)
    }
  })
}
const lowerCase = function (data) {
  const model = {}
  for (const param in data) {
    if (data[param] && typeof data[param] === 'string') {
      model[param] = data[param].toLowerCase()
    }
    model[param] = data[param]
  }
  return model
}
const services = {
  install (Vue, options = {}) {
    setConfig(Object.assign(config, options))
    updateAxiosInstance(options.baseUrl)
    Vue.prototype.$services = {
      getData,
      postData,
      putData,
      deleteData,
      getOneData,
      updateAxiosInstance,
      setAxiosHeader,
      config
    }
  }
}
export default services
