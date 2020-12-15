
import { SessionStorage } from 'quasar'
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
  console.log(error.slice(error.indexOf(';') + 2))
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
  return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1)
}
/**
 * Assign data to each selects
 * @param {Array} currentDataConfig
 * @param {String} propTag
 * @param {String} propData
 * @param {Array} list
 */
function assignRelationalData (currentDataConfig, propTag, propData, list) {
  currentDataConfig.forEach(config => {
    config.children.forEach(child => {
      // if (child.edition.propTag === propTag) {
      //   child.edition.component.props[propData] = list[0].data
      // }
      if (child.actionable.propTag === propTag) {
        child.actionable.component.props[propData] = list
      }
    })
  })
}
/**
 * Set variable select
 * @param {Object} dataConfig config variable
 */
function setVariables (dataConfig) {
  if (dataConfig.varStorage) {
    switch (dataConfig.nameQuery) {
      case 'cajas':
        if (SessionStorage.has('sucursalSelected')) {
          dataConfig.variables.sucursal_id = Number(SessionStorage.getItem('sucursalSelected').id)
        }
        break
      default:
        break
    }
  }
  return dataConfig.variables
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
      vueInstance.$apollo.query(
        {
          query: dataConfig.query,
          variables: setVariables(dataConfig),
          fetchPolicy: 'no-cache'
        }
      )
        .then(({ data }) => {
          toRelationalData = []
          toRelationalData = toRelationalData.concat(data[dataConfig.nameQuery])
          assignRelationalData(
            entityConfig.config,
            dataConfig.targetPropTag,
            dataConfig.propData,
            toRelationalData
          )
          callback(data, toRelationalData)
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

export const notify = (self, message, color, icon, position = 'top') => {
  self.$q.notify({
    message: ucwords(self.$t(message)),
    color: color,
    position: position,
    icon: icon
  })
}

export const methods = {
  translateEntity,
  translateLabel,
  setRelationalData,
  ucwords,
  can,
  notify,
  errorRequest
}
