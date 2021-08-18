<template>
  <q-page padding>
    <q-card>
      <q-form @submit="modelGuide">
        <q-card-section class="col-12 text-h5">
          Nueva Guía de Remisión
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm q-py-xs">
          <div class="col-3">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="branchOffice"
              ref="branchOfficeRef"
              v-model="branchOffice"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Establecimiento"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="branchOffices"
              @filter="getBranchOffices"
            />
          </div>
          <div class="col-3">
            <q-input
              outlined
              v-model="createdAt"
              type="date"
              label="Fecha de emisión"
              dense
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-3">
            <q-input
              outlined
              v-model="dateTransfer"
              type="date"
              label="Fecha de traslado"
              dense
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-3">
            <q-select
              outlined
              label="Cliente"
              dense
              option-value="id"
              option-label="full_name"
              v-model="client"
              disable
              readonly
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm q-py-xs">
          <div class="col-3">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="transferSubject"
              ref="transferSubjectRef"
              v-model="transferSubject"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Motivo de translado"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="transferSubjects"
              @filter="getTransferSubjects"
            />
          </div>
          <div class="col-3">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="transferMode"
              ref="transferModeRef"
              v-model="transferMode"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Modo de translado"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="transferModes"
              @filter="getTransferModes"
            />
          </div>
          <div class="col-6">
            <q-input
              type="text"
              label="Descripción motivo de traslado"
              dense
              outlined
              v-model="description"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm q-pt-xs">
          <div class="col-2">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="measurementUnit"
              ref="measurementUnitRef"
              v-model="measurementUnit"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Unidad de medidad"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="measurementUnits"
              @filter="getMeasurementUnits"
            />
          </div>
          <div class="col-2">
            <q-input
              outlined
              v-model="totalWeight"
              label="Peso total"
              dense
              type="number"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-2">
            <q-input
              outlined
              v-model="totalPacket"
              label="Número de paquetes"
              dense
              type="number"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-6">
            <q-input
              outlined
              v-model="observation"
              label="Observaciones"
              dense
            />
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row q-col-gutter-sm q-pt-xs">
          <div class="col-12 text-h6">
            Datos envío
          </div>
          <div class="col-12 subtitle2 text-grey">
            Dirección partida
          </div>
          <div class="col-2 text-h6">
            <q-input
              type="text"
              label="País"
              dense
              outlined
              v-model="fromCountry"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-3 text-h6">
            <q-input
              type="text"
              label="Ubigeo"
              dense
              outlined
              v-model="fromUbigeo"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-7 text-h6">
            <q-input
              type="text"
              label="Dirección "
              dense
              outlined
              v-model="fromAddress"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-12 subtitle2 text-grey">
            Dirección llegada
          </div>
          <div class="col-2">
            <q-input
              type="text"
              label="País"
              dense
              outlined
              v-model="toCountry"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-3">
            <q-input
              type="text"
              label="Ubigeo"
              dense
              outlined
              v-model="toUbigeo"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-7">
            <q-input
              type="text"
              label="Dirección "
              dense
              outlined
              v-model="toAddress"
            />
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row q-col-gutter-sm q-py-xs">
          <div class="col-12 text-h6">
            Datos transportista
          </div>
          <div class="col-4">
            <q-select
              autofocus
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="carrierDocumentType"
              ref="carrierDocumentTypeRef"
              v-model="carrierDocumentType"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Tipo Doc. identidad"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="documentTypes"
              @filter="getDocumentTypes"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Número"
              dense
              outlined
              v-model="carrierDocumentNumber"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Nombre y/o razón social"
              dense
              outlined
              v-model="carrierName"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm q-py-xs">
          <div class="col-12 text-h6">
            Datos conductor
          </div>
          <div class="col-4">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="driverDocumentType"
              ref="driverDocumentTypeRef"
              v-model="driverDocumentType"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Tipo Doc. identidad"
              :rules="[val => val || 'El campo metodo de pago es requerido']"
              :options="documentTypes"
              @filter="getDocumentTypes"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Número"
              dense
              outlined
              v-model="driverDocumentNumber"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Nombre y/o razón social"
              dense
              outlined
              v-model="driverName"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Número de placa del vehiculo"
              dense
              outlined
              v-model="licenseNumber"
              :rules="[
                val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
              ]"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="Licencia del conductor"
              dense
              outlined
              v-model="plateNumber"
            />
          </div>
          <div class="col-4">
            <q-input
              type="text"
              label="N° placa semirremolque"
              dense
              outlined
              v-model="semitrailerNumber"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            title="Lista de productos"
            :data="dataProducts"
            :columns="columsProducts"
            row-key="id"
            :filter="filter"
            :loading="loading"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="cancelar" color="negative" type="submit"/>
          <q-btn label="guardar" color="primary" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      branchOfficeSession: null,
      userSession: null,
      semitrailerNumber: null,
      driverName: null,
      plateNumber: null,
      licenseNumber: null,
      carrierDocumentNumber: null,
      driverDocumentNumber: null,
      fromUbigeo: null,
      fromCountry: null,
      fromAddress: null,
      toUbigeo: null,
      toCountry: null,
      toAddress: null,
      totalWeight: 0,
      observation: null,
      totalPacket: 0,
      transferMode: null,
      transferModes: [],
      carrierName: null,
      carrierDocumentType: null,
      driverDocumentType: null,
      documentTypes: [],
      transferSubject: null,
      transferSubjects: [],
      measurementUnit: null,
      measurementUnits: [],
      client: null,
      description: null,
      loading: false,
      filter: '',
      rowCount: 10,
      columsProducts: [
        { name: 'description', align: 'left', label: 'Descripción', field: 'description', sortable: true },
        { name: 'amount', align: 'left', label: 'Cantidad', field: 'amount', sortable: true }
      ],
      dataProducts: [
        {
          name: '1',
          unit: 'Lts',
          description: 'Aceite de motor 20/50',
          cant: 1
        },
        {
          name: '2',
          unit: 'Kg',
          description: 'Tornilos 1/2"',
          cant: 1
        },
        {
          name: '3',
          unit: 'Lts',
          description: 'Aceite de motor 20/50',
          cant: 1
        }
      ],
      branchOffices: [],
      branchOffice: null,
      createdAt: date.formatDate(new Date(), 'YYYY-MM-DD'),
      dateTransfer: date.formatDate(new Date(), 'YYYY-MM-DD')
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
    this.getOneBill()
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Get data billing
     */
    getOneBill () {
      this.$services.getOneData([this.$route.params.module, this.$route.params.id])
        .then(({ res }) => {
          this.client = res.data.client
          const products = res.data.bill_electronic_details
          this.dataProducts = this.modelProduct(products)
        })
    },
    /**
     * Model product
     * @param {Array} data product billing
     */
    modelProduct (data) {
      return data.map(details => {
        return {
          id: details.product.id,
          product_id: details.product.id,
          description: details.product.name ?? details.product.description,
          amount: details.amount,
          user_created_id: this.userSession.id
        }
      })
    },
    modelGuide () {
      const params = {
        date_of_issue: this.createdAt,
        date_transfer: this.dateTransfer,
        total_packet: this.totalPacket,
        description: this.description,
        branch_office_id: this.branchOffice.id,
        measurement_unit_id: this.measurementUnit.id,
        transfer_mode_id: this.transferMode.id,
        transfer_subject_id: this.transferSubject.id,
        client_id: this.client.id,
        observation: this.observation,
        from_country: this.fromCountry,
        from_ubigeo: this.fromUbigeo,
        from_address: this.fromAddress,
        to_country: this.toCountry,
        to_ubigeo: this.toUbigeo,
        to_address: this.toAddress,
        carrier_name: this.carrierName,
        carrier_document_type_id: this.carrierDocumentType.id,
        carrier_document_number: this.carrierDocumentNumber,
        driver_name: this.driverName,
        driver_document_type_id: this.driverDocumentType.id,
        driver_document_number: this.driverDocumentNumber,
        total_weight: this.totalWeight,
        plate_number: this.plateNumber,
        license_number: this.licenseNumber,
        semitrailer_number: this.semitrailerNumber,
        guideDetails: this.dataProducts,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id
      }
      this.saveGuide(params)
    },
    saveGuide (data) {
      this.visible = true
      this.$services.postData(['guides'], data)
        .then(res => {
          this.notify(this, 'guide.saveSuccess', 'positive', 'mood')
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'guide.error', 'negative', 'warning')
          this.visible = false
        })
    },
    getBranchOffices (value, update) {
      this.$services.getData(['branch-offices'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.branchOffices = res.data.data
          })
        })
    },
    getTransferModes (value, update) {
      this.$services.getData(['transfer-modes'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.transferModes = res.data.data
          })
        })
    },
    getTransferSubjects (value, update) {
      this.$services.getData(['transfer-subjects'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.transferSubjects = res.data.data
          })
        })
    },
    getMeasurementUnits (value, update) {
      this.$services.getData(['measurement-units'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.measurementUnits = res.data.data
          })
        })
    },
    getDocumentTypes (value, update) {
      this.$services.getData(['document-types'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.documentTypes = res.data.data
          })
        })
    }
  }
}

</script>
