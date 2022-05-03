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
      throw err
    }
  })
}

export const getOneData = function (url, params = {}) {
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
export const postData = function (url, params) {
  return axiosInstance.post(url.join('/'), lowerCase(params)).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      throw err
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
      throw err
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
      throw err
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
const nodeServices = {
  install (Vue, options = {}) {
    setConfig(Object.assign(config, options))
    updateAxiosInstance(options.baseUrl)
    Vue.prototype.$nodeServices = {
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
export default nodeServices
