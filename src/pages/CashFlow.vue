<template>
  <q-page padding>
    <q-card>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="egress">
          <q-form @submit="saveCashFlow" @reset="clean" ref="cashFlow">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-h6">Nuevo Egreso</div>
              </div>
              <div class="col-6 text-right">
                <q-btn icon="add_a_photo" color="teal" @click="takePicture"/>
              </div>
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="category"
                  v-model="category"
                  option-label="name"
                  option-value="id"
                  label="Categoria"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="categories"
                  @filter="getCategories"
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
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="concept"
                  v-model="concept"
                  option-label="name"
                  option-value="id"
                  label="Concepto"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="concepts"
                  @filter="getConcepts"
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
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="beneficiary"
                  v-model="beneficiarySelected"
                  option-label="name"
                  option-value="id"
                  label="Beneficiario"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="beneficiaries"
                  @filter="getBeneficiaries"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogBeneficiary = true"/>
                  </template>
                </q-select>
              </div>
              <div class="col-12">
                <q-input
                  outlined
                  v-model="amount"
                  label="Monto"
                  dense
                  type="number"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"/>
              </div>
              <div class="col-12">
                <q-input
                  type="textarea"
                  outlined
                  v-model="description"
                  label="Descripción"
                  dense
                  autogrow
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                />
              </div>
              <div class="col-6" v-for="(image, index) in images" :key="image.id">
                <q-img
                  :src="image.img"
                  style="width: 100%; height: 100px;"
                  native-context-menu
                >
                  <q-icon class="absolute all-pointer-events bg-dark" size="20px" name="cancel" color="white" style="top: 0px; right: 0px; border-radius: 100%;" @click="deleteImage(index)"/>
                </q-img>
              </div>
              <div class="col-12 q-gutter-x-sm text-right">
                <q-btn icon="clear" color="negative" label="Limpiar" type="reset"/>
                <q-btn icon="save" color="primary" label="Guardar" type="submit" :loading="loadingForm"/>
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="entry">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movements">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer reveal>
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
      >
        <q-tab name="entry" label="Ingreso" />
        <q-tab name="egress" label="Egreso" />
        <q-tab name="movements" label="Movimientos" />
      </q-tabs>
    </q-footer>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialogBeneficiary"
    >
      <dynamic-form
        module="beneficiary"
        :config="beneficiary"
        :loading="loadingForm"
        @cancel="addDialogBeneficiary = false"
        @save="save"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
import { beneficiary, buttonsActions, propsPanelEdition } from '../config-file/beneficiary/beneficiaryConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm
  },
  data () {
    return {
      loadingForm: false,
      beneficiary,
      buttonsActions,
      propsPanelEdition,
      addDialogBeneficiary: false,
      images: [],
      /**
       * Name submenu
       * @type {String}
       */
      tab: 'egress',
      /**
       * Amount cash flow
       * @type {Number}
       */
      amount: 0,
      /**
       * Category selected cash flow
       * @type {Object}
       */
      category: null,
      /**
       * Description cash flow
       * @type {String}
       */
      description: null,
      /**
       * Concept selected cash flow
       * @type {Object}
       */
      concept: null,
      /**
       * Concepts cash flow
       * @type {Array}
       */
      concepts: [],
      /**
       * Beneficiary selected cash flow
       * @type {Object}
       */
      beneficiarySelected: null,
      /**
       * Beneficiaries cash flow
       * @type {Array}
       */
      beneficiaries: [],
      /**
       * Categories cash flow
       * @type {Array}
       */
      categories: []
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        ref.resetValidation()
      }, 100)
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.branch_office_id = this.branchOffice.id
      this.loadingForm = true
      this.$services.postData(['beneficiaries'], data)
        .then(({ res }) => {
          this.addDialogBeneficiary = false
          this.loadingForm = false
          this.beneficiarySelected = res.data
          this.notify(this, 'beneficiary.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    clean () {
      this.concept = null
      this.beneficiarySelected = null
      this.amount = 0
      this.description = null
      this.category = null
      this.images = []
      this.resetValidations(this.$refs.cashFlow)
    },
    srcToFile (dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    modelCashFlow () {
      const model = new FormData()
      this.images.forEach((imge, index) => {
        model.append(`files[${index}]`, this.srcToFile(imge.img), `file-${index}.jpg`)
      })
      model.append('concept_id', this.concept.id)
      model.append('beneficiary_id', this.beneficiarySelected.id)
      model.append('amount', this.amount)
      model.append('description', this.description)
      model.append('user_created_id', this.userSession.id)
      model.append('field_id', 1)
      return model
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    saveCashFlow () {
      if (this.images.length >= 3) {
        this.loadingForm = true
        this.$services.postUpload(['field-cash-flows'], this.modelCashFlow())
          .then(({ res }) => {
            this.addDialogBeneficiary = false
            this.loadingForm = false
            this.beneficiarySelected = res.data
            this.notify(this, 'fieldCashFlow.addSuccessful', 'positive', 'mood')
            this.clean()
          })
          .catch(() => {
            this.loadingForm = false
          })
      } else {
        this.notify(this, 'fieldCashFlow.errorAmountImage', 'negative', 'warning')
      }
    },
    /**
     * Delete image
     * @param {Numer} index index image
     */
    deleteImage (index) {
      this.images.splice(index, 1)
    },
    /**
     * All Categories
     */
    getCategories (value, update) {
      this.$services.getData(['categories'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.categories = res.data.data
          })
        })
    },
    /**
     * All Concepts
     */
    getConcepts (value, update) {
      this.$services.getData(['concepts'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.concepts = res.data
          })
        })
    },
    /**
     * All Beneficiaries
     */
    getBeneficiaries (value, update) {
      this.$services.getData(['beneficiaries'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.beneficiaries = res.data
          })
        })
    },
    /**
     * Set Image
     */
    async takePicture () {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        webUseInput: true,
        promptLabelHeader: 'Seleccionar imagen',
        promptLabelPhoto: 'Abrir galería',
        promptLabelPicture: 'Abrir cámara',
        resultType: CameraResultType.DataUrl
      })
      this.images.push({
        img: image.dataUrl
      })
    }
  }
}
</script>
...
<style scoped>
.file-select > .select-button {
  padding: 1rem;

  color: white;
  background-color: #2EA169;

  border-radius: .3rem;

  text-align: center;
  font-weight: bold;
}

/* Don't forget to hide the original file input! */
.file-select > input[type="file"] {
  display: none;
}
</style>
