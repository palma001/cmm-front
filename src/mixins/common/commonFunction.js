
/**
 * Translates the tags in Entities
 * @param {String} message tag to translate
 * @param {String} Entity to translate
 */
export const translateEntity = function (entity, message) {
  return this.$i18n.t(`template.${entity}.${message}.label`)
}
/**
 * translate text
 * @param  {String} value text translate
 * @return {String}       text translated
 */
export const translateLabel = function (value) {
  return this.$i18n.t(`template.${value}.label`)
}

/**
 * translate text
 * @param  {String} value text translate
 * @return {String}       text translated
 */
export const errorRequest = function (error) {
  switch (error.slice(error.indexOf(';') + 2)) {
    case 'Expected non-nullable type Int! not to be null at value.caja_id.' :
      return 'boxIsrequired'
    default:
      return ''
  }
}
/**
 * ucwords text
 * @param  {String} value text ucwords
 * @return {String}       text ucwords
 */
export const ucwords = function (value) {
  if (typeof value === 'string') {
    return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1)
  }
  return value
}
/**
 * Assign data to each selects
 * @param {Array} currentDataConfig
 * @param {String} propTag
 * @param {String} propData
 * @param {Array} list
 */
function assignRelationalData (currentDataConfig, propTag, propData, list, dataConfig) {
  currentDataConfig.forEach(config => {
    config.children.forEach(child => {
      if (child.actionable && child.actionable.propTag === propTag) {
        if (!dataConfig.sync) {
          child.actionable.component.props[propData] = list
        } else {
          if (child.actionable.component.props.queryParams && dataConfig.petitionParams) {
            const params = Object.assign(child.actionable.component.props.queryParams, dataConfig.petitionParams)
            child.actionable.component.props.queryParams = params
          }
        }
      }
    })
  })
}
/**
 * Gets relational data of the entity
 * @param {{relationalData: Array<Object>, config: Array<Object>}} entityConfig
 * @param {Array} toRelationalData
 * @param {Object} vueInstance
 * @param {(validApiResponse) => void} [callback = () => void]
 */
export const setRelationalData = (
  entityConfig,
  toRelationalData,
  vueInstance,
  callback = () => {}
) => {
  if (entityConfig) {
    entityConfig.relationalData.forEach(dataConfig => {
      vueInstance.$services.getData(dataConfig.services, dataConfig.petitionParams)
        .then(({ res }) => {
          const data = res.data.data ?? res.data
          assignRelationalData(
            entityConfig.config,
            dataConfig.targetPropTag,
            dataConfig.propData,
            data,
            dataConfig
          )
          callback(res.data, toRelationalData)
        })
    })
  }
}

export const can = (self, module, permission) => {
  self.$mockData.getData('authorizations')
    .then(({ response }) => {
      self.permissions = response.data.content.filter(permission => {
        return permission.name === module
      })[0]
    })

  if (self.permissions.permissions) {
    return self.permissions.permissions[permission]
  }
}

export const notify = (self, message, color, icon, position = 'top', traduction = true) => {
  self.$q.notify({
    message: traduction ? ucwords(self.$t(message)) : ucwords(message),
    color: color,
    position: position,
    icon: icon
  })
}

export const catchError = (self, errors) => {
  for (const key in errors) {
    if (Object.hasOwnProperty.call(errors, key)) {
      errors[key].forEach(error => {
        self.notify(self, error, 'negative', 'warning', 'top', false)
      })
    }
  }
}

export const methods = {
  translateEntity,
  translateLabel,
  setRelationalData,
  ucwords,
  can,
  notify,
  errorRequest,
  catchError
}
