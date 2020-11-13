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
 * Assign data to each selects
 * @param {Array} currentDataConfig
 * @param {String} propTag
 * @param {String} propData
 * @param {Array} list
 */
const assignRelationalData = (currentDataConfig, propTag, propData, list) => {
  currentDataConfig.forEach(config => {
    config.children.forEach(child => {
      if (child.edition.propTag === propTag) {
        child.edition.component.props[propData] = list[0].data
      }
      if (child.addible.propTag === propTag) {
        child.addible.component.props[propData] = list[0].data
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
      vueInstance.$services
        .getData(
          [dataConfig.microservice, dataConfig.entity],
          dataConfig.petitionParams
        )
        .then(apiResponse => {
          toRelationalData = []
          toRelationalData = toRelationalData.concat(apiResponse.res.data)
          assignRelationalData(
            entityConfig.config,
            dataConfig.targetPropTag,
            dataConfig.propData,
            toRelationalData
          )
          callback(apiResponse, toRelationalData)
        })
    })
  }
}
export const methods = {
  translateEntity,
  translateLabel,
  setRelationalData
}
