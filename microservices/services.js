import axiosInstance, {
  updateAxiosInstance,
  setAxiosHeader
} from './AxiosIntance'
import config, {
  setConfig
} from './config'

export const getData = function (url, params) {
  return axiosInstance.get(`${url[0]}/${url[1]}`, {
    params
  }).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}

export const getOneData = function (url) {
  return axiosInstance.get(`${url[0]}/${url[1]}/${url[2]}`).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}
export const postData = function (url, params) {
  return axiosInstance.post(`${url[0]}/${url[1]}`, params).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}
export const putData = function (url, params) {
  return axiosInstance.put(`${url[0]}/${url[1]}/${url[2]}`, params).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}
export const deleteData = function (url, params) {
  return axiosInstance.delete(`${url[0]}/${url[1]}/${url[2]}`).then((res) => {
    return {
      status: true,
      res: res
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
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
