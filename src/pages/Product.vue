<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-6 row text-right q-col-gutter-x-sm">
        <div class="col-xs-4 col-lg-3">
          <q-input
            type="text"
            label="C"
            v-model="brand"
            dense
            outlined
            ref="brand"
            @input="filterPrimary"
            @keyup.enter.native="nextInput('code')"
          />
        </div>
        <div class="col-xs-4 col-lg-3">
          <q-input
            type="text"
            label="P"
            dense
            v-model="code"
            outlined
            ref="code"
            @input="filterPrimary"
            @keyup.enter.native="nextInput('supsec')"
          />
        </div>
        <div class="col-xs-4 col-lg-3">
          <q-input
            type="text"
            label="D"
            dense
            ref="supsec"
            v-model="supsec"
            outlined
            @input="filterPrimary"
            @keyup.enter.native="nextInput('p', 0)"
          />
        </div>
      </div>
      <div class="col-6 text-right q-gutter-x-sm">
        <q-btn
          color="teal"
          icon="cleaning_services"
          :label="$q.screen.lt.md ? '' : $t('product.clear')"
          @click="clearFilter"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.md"
          >
            {{
              ucwords($t('product.clear'))
            }}
          </q-tooltip>
        </q-btn>
        <q-btn
          :color="filter ? 'negative' : 'orange'"
          :icon="filter ? 'close' : 'filter_alt'"
          :label="$q.screen.lt.md ? '' : $t('product.filter')"
          @click="filter = !filter"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.md"
          >
            {{
              ucwords($t('product.filter'))
            }}
          </q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.md ? '' : $t('product.add')"
          @click="addDialig = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.md"
          >
            {{
              ucwords($t('product.add'))
            }}
          </q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 row q-col-gutter-xs" v-if="filter">
        <div
          v-for="(attributeType, index) in listAttributeTypes"
          :key="attributeType.id"
        >
          <q-input
            v-if="attributeType.filter"
            class="col-xs-4 col-sm-4 col-md-2 col-lg-1"
            type="text"
            dense
            outlined
            :label="attributeType.name"
            v-model="attributeTypes[attributeType.id]"
            :ref="`p-${index}`"
            @keyup.enter.native="nextInput('p', index)"
            @input="filterSecondary"
          />
        </div>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="product"
          searchable
          action
          :column="product"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          v-if="listAttributeTypes.length"
          @view-details="viewDetails"
          @search-data="searchData"
          @on-load-data="loadData"
          @delete="deleteData"
          @viewStock="viewStock"
        />
      </div>
    </div>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="product"
        :propsPanelEdition="propsPanelEdition"
        :config="product"
        :loading="loadingForm"
        @cancel="closeModalEdition"
        @update="update"
      >
        <template>
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="priceList" label="Lista de precios" />
              <q-tab name="otherAttribute" label="Otros atributos" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="priceList">
                <div class="row q-col-gutter-xs" v-for="(productPrice, index) in productPrices" :key="productPrice.id">
                  <div class="col-6">
                    <q-input
                      label="Nombre"
                      outlined
                      dense
                      v-model="productPrice.name"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Precio"
                      outlined
                      dense
                      v-model="productPrice.price"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="deletePrice(index)"
                    />
                  </div>
                </div>
                <q-form ref="fromPrice" class="row q-col-gutter-xs" @submit="addPrice">
                  <div class="col-6">
                    <q-input
                      label="Nombre"
                      outlined
                      dense
                      v-model="namePrice"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Precio"
                      outlined
                      dense
                      v-model="priceProduct"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="add"
                      color="primary"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="otherAttribute">
                <div class="row q-col-gutter-xs" v-for="(attrubteSeved, index) in attributesSeved" :key="attrubteSeved.id">
                  <div class="col-6">
                    <q-select
                      autocomplete="off"
                      use-input
                      hide-selected
                      fill-input
                      dense
                      outlined
                      clearable
                      input-debounce="20"
                      name="attributeType"
                      v-model="attrubteSeved.attributeType"
                      option-label="name"
                      option-value="id"
                      label="Atributo"
                      :rules="[val => val || 'Este campo es requerido']"
                      :options="listAttributeTypes"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Valor"
                      outlined
                      dense
                      v-model="attrubteSeved.description"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="deleteAttribute(index)"
                    />
                  </div>
                </div>
                <q-form ref="fromAttribute" class="row q-col-gutter-xs" @submit="addAttribute">
                  <div class="col-6">
                    <q-select
                      autocomplete="off"
                      use-input
                      hide-selected
                      fill-input
                      dense
                      outlined
                      clearable
                      input-debounce="20"
                      name="attributeType"
                      v-model="attributeType"
                      option-label="name"
                      option-value="id"
                      label="Atributo"
                      :rules="[val => val || 'Este campo es requerido']"
                      :options="listAttributeTypes"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Valor"
                      outlined
                      dense
                      v-model="attributeValue"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="add"
                      color="primary"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </template>
      </dynamic-form-edition>
    </q-dialog>
    <q-dialog
      persistent
      full-height
      position="right"
      v-model="addDialig"
    >
      <dynamic-form
        module="product"
        :config="product"
        :loading="loadingForm"
        @cancel="addDialig = false"
        @save="save"
      >
        <template>
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="priceList" label="Lista de precios" />
              <q-tab name="otherAttribute" label="Otros atributos" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="priceList">
                <div class="row q-col-gutter-xs" v-for="(productPrice, index) in productPrices" :key="productPrice.id">
                  <div class="col-6">
                    <q-input
                      label="Nombre"
                      outlined
                      dense
                      v-model="productPrice.name"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Precio"
                      outlined
                      dense
                      v-model="productPrice.price"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="deletePrice(index)"
                    />
                  </div>
                </div>
                <q-form ref="fromPrice" class="row q-col-gutter-xs" @submit="addPrice">
                  <div class="col-6">
                    <q-input
                      label="Nombre"
                      outlined
                      dense
                      v-model="namePrice"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Precio"
                      outlined
                      dense
                      v-model="priceProduct"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="add"
                      color="primary"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="otherAttribute">
                <div class="row q-col-gutter-xs" v-for="(attrubteSeved, index) in attributesSeved" :key="attrubteSeved.id">
                  <div class="col-6">
                    <q-select
                      autocomplete="off"
                      use-input
                      hide-selected
                      fill-input
                      dense
                      outlined
                      clearable
                      input-debounce="20"
                      name="attributeType"
                      v-model="attrubteSeved.attributeType"
                      option-label="name"
                      option-value="id"
                      label="Atributo"
                      :rules="[val => val || 'Este campo es requerido']"
                      :options="listAttributeTypes"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Valor"
                      outlined
                      dense
                      v-model="attrubteSeved.description"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="delete"
                      color="negative"
                      @click="deleteAttribute(index)"
                    />
                  </div>
                </div>
                <q-form ref="fromAttribute" class="row q-col-gutter-xs" @submit="addAttribute">
                  <div class="col-6">
                    <q-select
                      autocomplete="off"
                      use-input
                      hide-selected
                      fill-input
                      dense
                      outlined
                      clearable
                      input-debounce="20"
                      name="attributeType"
                      v-model="attributeType"
                      option-label="name"
                      option-value="id"
                      label="Atributo"
                      :rules="[val => val || 'Este campo es requerido']"
                      :options="listAttributeTypes"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-5">
                    <q-input
                      label="Valor"
                      outlined
                      dense
                      v-model="attributeValue"
                      :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                    />
                  </div>
                  <div class="col-1 text-right q-mt-xs">
                    <q-btn
                      dense
                      round
                      icon="add"
                      color="primary"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </template>
      </dynamic-form>
    </q-dialog>
    <q-dialog v-model="stockDialog">
      <q-card v-if="productSelected">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ productSelected.brand.name }} - {{ productSelected.code }} - {{ productSelected.supsec }} / {{ productSelected.description }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-markup-table>
            <thead>
              <tr class="text-left">
                <th colspan="4">
                  <span class="text-h6">
                    Stock
                  </span>
                </th>
              </tr>
              <tr>
                <th class="text-left">Almacen</th>
                <th class="text-right">Precio de compra</th>
                <th class="text-right">Precio de venta</th>
                <th class="text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="productSelected.stock.length <= 0">
                 <td class="text-center" colspan="4">Producto sin stock</td>
              </tr>
              <tr v-else v-for="stockOne in productSelected.stock" :key="stockOne.id">
                <td class="text-left">{{ stockOne.warehouse_name }}</td>
                <td class="text-right">{{ stockOne.purchase_price }}</td>
                <td class="text-right">{{ stockOne.sale_price }}</td>
                <td class="text-right">{{ stockOne.stock_product }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { product, buttonsActions, propsPanelEdition, productServices } from '../config-file/product/productConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    DynamicFormEdition
  },
  data () {
    return {
      filter: true,
      productSelected: null,
      stockDialog: false,
      tab: 'priceList',
      productServices,
      visible: false,
      brand: null,
      code: null,
      supsec: null,
      buttonsActions,
      propsPanelEdition,
      loadingForm: false,
      /**
       * Selected data
       * @type {Object}
       */
      selectedData: null,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 1,
        dataFilter: {},
        dataSearch: {
          code: '',
          description: '',
          supsec: '',
          numsec: '',
          'category.name': ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialig: false,
      /**
       * File config module
       * @type {Object}
       */
      product,
      /**
       * Open edit dialog
       * @type {Boolean}
       */
      editDialog: false,
      /**
       * Status loading table
       * @type {Boolean}
       */
      loadingTable: false,
      /**
       * Data of table
       * @type {Array}
       */
      data: [],
      /**
       * Model Attribute
       * @type {Object} attribute type
       */
      attributeTypes: {},
      attributeType: null,
      attributeValue: null,
      attributesSeved: [],
      /**
       * List attribute product
       * @type {Array}
       */
      listAttributeTypes: [],
      productPrices: [],
      priceProduct: null,
      namePrice: null
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.productServices, [], this)
    this.getAttributeTypes()
    this.$root.$on('change_branch_office', this.filterBranchOffice)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    filterBranchOffice (branchOffice) {
      this.getProducts(this.params)
    },
    /**
     * Close modal edition
     */
    closeModalEdition () {
      this.editDialog = false
      this.attributesSeved = []
      this.productPrices = []
    },
    /**
     * View stock product
     * @param {Object} data data product
     */
    viewStock (data) {
      this.productSelected = data
      this.stockDialog = true
    },
    /**
     * Delete attributte product
     * @param {Number} index index attribute
     */
    deleteAttribute (index) {
      this.attributesSeved.splice(index, 1)
    },
    /**
     * Delete attributte product
     * @param {Number} index index attribute
     */
    deletPrice (index) {
      this.productPrices.splice(index, 1)
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        ref.resetValidation()
      })
    },
    /**
     * Add attribute product
     */
    addPrice () {
      this.productPrices.push({
        price: this.priceProduct,
        name: this.namePrice,
        user_created_id: this.userSession.id
      })
      this.priceProduct = null
      this.namePrice = null
      this.resetValidations(this.$refs.fromPrice)
    },
    /**
     * Add attribute product
     */
    addAttribute () {
      this.attributesSeved.push({
        attributeType: this.attributeType,
        description: this.attributeValue,
        user_created_id: this.userSession.id
      })
      this.attributeType = null
      this.attributeValue = null
      this.resetValidations(this.$refs.fromAttribute)
    },
    /**
     * Next input
     */
    nextInput (ref, index) {
      if (this.$refs[ref]) {
        this.$refs[ref].focus()
      } else {
        if (!this.$refs[`${ref}-${index + 1}`]) {
          index += 1
          this.nextInput(ref, index)
        } else {
          this.$refs[`${ref}-${index + 1}`][0].focus()
        }
      }
    },
    /**
     * Filter attribute type
     */
    filterSecondary () {
      for (const key in this.attributeTypes) {
        if (Object.hasOwnProperty.call(this.attributeTypes, key)) {
          this.params.dataFilter = {
            'attributeTypeProducts.attribute_type_id': this.attributeTypes[key] ? key : null,
            'attributeTypeProducts.description': this.attributeTypes[key]
          }
        }
      }
      this.getProducts(this.params)
    },
    clearFilter () {
      this.code = null
      this.brand = null
      this.supsec = null
      this.attributeTypes = {}
      this.params.filterProduct = {}
      this.params.dataFilter = {}
      this.getProducts()
    },
    /**
     * Filter primary
     */
    filterPrimary () {
      this.params.filterProduct = {
        code: this.code,
        'brand.name': this.brand,
        supsec: this.supsec
      }
      this.params.page = 1
      this.getProducts(this.params)
    },
    /**
     * Get product attrubutes
     */
    getAttributeTypes () {
      this.visible = true
      this.$services.getData(['attribute-types'], {
        sortBy: 'id',
        sortOrder: 'desc'
      })
        .then(({ res }) => {
          this.listAttributeTypes = res.data.filter(element => {
            if (element.name === 'ALTERNANTE' || element.name === 'CMOTOR' || element.name === 'MODELO' || element.name === 'DIAMET') {
              element.filter = true
            }
            return element
          })
          this.visible = false
          this.newModelTable()
          this.getProducts()
        })
        .catch(() => {
          this.visible = false
        })
    },
    /**
     * Model product table
     */
    newModelTable () {
      product.map(config => {
        this.listAttributeTypes.forEach(attributeType => {
          if (config.children.length < (this.listAttributeTypes.length + 7)) {
            config.children.push({
              tabulated: {
                name: attributeType.name,
                align: 'left',
                field: row => row.attribute[attributeType.name],
                sortable: false,
                visible: true,
                traductorOff: true
              }
            })
          }
        })
      })
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.editDialog = true
      this.propsPanelEdition.data = data
      this.selectedData = data
      this.productPrices = data.product_prices.map(element => {
        element.user_created_id = this.userSession.id
        return element
      })
      this.attributesSeved = data.attribute_types.map(element => {
        return {
          attributeType: element,
          description: element.pivot.description,
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la marca?',
        cancel: {
          label: 'Cancelar',
          color: 'negative'
        },
        persistent: true,
        ok: {
          label: 'Aceptar',
          color: 'primary'
        }
      }).onOk(async () => {
        await this.$services.deleteData(['products', data.id])
        this.notify(this, 'product.deleteSuccessfull', 'positive', 'mood')
        this.getProducts()
      })
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.params.dataFilter = {
        branch_office_id: this.branchOffice.id
      }
      this.optionPagination = data
      this.getProducts(this.params)
    },
    /**
     * Search product
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getProducts()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      data.attribute_types = this.modelAttributeModel(this.attributesSeved)
      data.product_prices = this.productPrices
      this.loadingForm = true
      this.$services.putData(['products', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.attributesSeved = []
          this.productPrices = []
          this.getProducts(this.params)
          this.notify(this, 'product.editSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    modelAttributeModel (data) {
      const attributes = []
      data.forEach(element => {
        attributes.push({
          attribute_type_id: element.attributeType.id,
          description: element.description,
          user_created_id: element.user_created_id
        })
      })
      return attributes
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.user_id = this.userSession.id
      data.branch_office_id = this.branchOffice.id
      data.attribute_types = this.modelAttributeModel(this.attributesSeved)
      data.product_prices = this.productPrices
      this.loadingForm = true
      this.$services.postData(['products'], data)
        .then(({ res }) => {
          this.addDialig = false
          this.loadingForm = false
          this.getProducts(this.params)
          this.attributesSeved = []
          this.productPrices = []
          this.tab = 'priceList'
          this.notify(this, 'product.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all product
     */
    getProducts (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['products'], params)
        .then(({ res }) => {
          this.data = res.data.data.map(productData => {
            productData.attribute = {}
            productData.attribute_types.forEach(attributeType => {
              productData.attribute[attributeType.name] = attributeType.pivot.description
            })
            return productData
          })
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
        })
        .catch(err => {
          console.log(err)
          this.data = []
          this.loadingTable = false
          this.optionPagination.rowsNumber = 0
        })
    }
  }
}
</script>
