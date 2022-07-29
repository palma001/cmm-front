<template>
  <q-page padding>
    <q-card class="my-card">
      <q-form @submit="save" @reset="clearForm">
        <q-card-section>
          <div class="text-h5">
            Crear Ticket
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                name="guide"
                v-model="ticket.guide"
                option-label="full_name"
                option-value="id"
                label="Guías"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="guides"
                @filter="getGuides"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin datos
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                name="provider"
                v-model="ticket.provider"
                option-label="name"
                option-value="id"
                label="Proveedor"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="providers"
                @filter="getProviders"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin datos
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                name="field"
                v-model="ticket.field"
                option-label="denomination"
                option-value="id"
                label="Campo"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="fields"
                @filter="getFields"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin datos
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                name="client"
                v-model="ticket.client"
                option-label="name"
                option-value="id"
                label="Cliente"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="clients"
                @filter="getClients"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin datos
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.checkweighing" label="Orden de Pesaje" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.tare" label="Tara" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.vehicle_number" label="N° Vehiculo" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.certificate" label="Certificado" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input type="date" dense outlined v-model="ticket.start_date" hint="Fecha de inicio" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input type="date" dense outlined v-model="ticket.final_date" hint="Fecha fin" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.tare_weight" label="Peso de tara" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xl-4 col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-input dense outlined v-model="ticket.gross_weight" label="Peso bruto" :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="secondary" type="reset" label="Limpiar"/>
          <q-btn color="primary" type="submit" label="Guardar"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'TicketPage',
  data () {
    return {
      /**
       * List Provider
       * @type {Array}
       */
      providers: [],
      /**
       * List Clients
       * @type {Array}
       */
      clients: [],
      /**
       * List Field
       * @type {Array}
       */
      fields: [],
      /**
       * List Guide
       * @type {Array}
       */
      guides: [],
      /**
       * Ticket data
       * @type {Object}
       */
      ticket: {}
    }
  },
  methods: {
    clearForm () {
      this.ticket = {}
    },
    save () {
      console.log(this.ticket)
    },
    /**
     * Get data providers
     * @param {String} value data search
     * @param {Callback} update update data select
     */
    getProviders (value, update) {
      this.$services.getData(['providers'], {
        dataSearch: {
          document_number: value,
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.providers = res.data.data
          })
        })
    },
    /**
     * Get data guides
     * @param {String} value data search
     * @param {Callback} update update data select
     */
    getGuides (value, update) {
      this.$services.getData(['guides'], {
        dataSearch: {
          serie_number: value,
          code_runpa: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.guides = res.data.data
          })
        })
    },
    /**
     * Get data field
     * @param {String} value data search
     * @param {Callback} update update data select
     */
    getFields (value, update) {
      this.$services.getData(['fields'], {
        dataSearch: {
          denomination: value,
          acronym: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.fields = res.data.data
          })
        })
    },
    /**
     * Get data client
     * @param {String} value data search
     * @param {Callback} update update data select
     */
    getClients (value, update) {
      this.$services.getData(['clients'], {
        dataSearch: {
          name: value,
          document_number: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.clients = res.data.data
          })
        })
    }
  }
}
</script>
