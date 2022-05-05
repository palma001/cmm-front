<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-right">
        <q-btn color="primary" icon="qr_code_scanner" dense @click="openQr = true"/>
      </div>
    </div>
    <q-dialog v-model="openQr">
      <q-card class="my-card">
        <q-card-section class="q-pa-none">
          <qrcode-stream @decode="onDone"></qrcode-stream>
          <!-- <qrcode-drop-zone @decode="onDone"></qrcode-drop-zone> -->
          <qrcode-capture @decode="onDone"></qrcode-capture>
          <!-- <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom text-subtitle2 text-center">
              Escanear Guía
            </div>
          </q-img> -->
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="q-gutter-sm">
       <q-card class="my-card">
        <q-card-section class="row justify-center q-col-gutter-sm">
          <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
            <q-select rounded outlined v-model="model" :options="proveedor" label="Proveedor" />
          </div>
          <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
            <q-input rounded outlined v-model="text" label="Guía" disable/>
          </div>
          <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
            <q-input rounded outlined v-model="text" label="Fecha" disable />
          </div>
        </q-card-section>
        </q-card>
        <q-separator />
        <q-card class="mycard">
            <q-card-section>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-input rounded outlined v-model="text" label="Empresa" disable/>
                </div>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-input rounded outlined v-model="text" label="RIF" disable />
                </div>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-input rounded outlined v-model="text" label="Dirección de Origen" />
                </div>
            </q-card-section>
        </q-card>
        <q-card class="mycard">
            <q-card-section>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-select rounded outlined v-model="model" :options="estado" label="Estado" />
                </div>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-select rounded outlined v-model="model" :options="cliente" label="Cliente" />
                </div>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-input rounded outlined v-model="text" label="RIF" disable />
                </div>
                <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                  <q-input rounded outlined v-model="text" label="Dirección de Destino" />
                </div>
            </q-card-section>
        </q-card>
        <q-card class="mycard">
            <q-card-section>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                {{material}}
              </div>
            </q-card-section>
        </q-card>
        <q-card class="mycard">
            <q-card-section>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Empresa de Transporte" disable />
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="RIF" disable/>
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Conductor" disable/>
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="CI" disable/>
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Marca del Vehículo" disable />
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Modelo" />
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Placa del Chuto" disable/>
              </div>
              <div class="col-sm-12 col-md-4 col-md-2 col-xs-12">
                <q-input rounded outlined v-model="text" label="Placa Batea" disable/>
              </div>
            </q-card-section>
        </q-card>
          <div class="q-gutter-sm" >
             <q-btn unelevated rounded color="primary" label="Generar Nota de Entrega"/>
             <q-btn unelevated rounded color="secondary" label="Limpiar" />
           </div>
        </div>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
      /**
       * Open dialog qr
       * @type {Boolean}
       */
      openQr: false,
      text: '',
      proveedor: ['Coporación Macro Metal C.M.M. C.A.', 'Protocol Capital W.L.L, C.A.'],
      cliente: ['Metalplast de Venezuela 2021 C.A.', 'Reciplast de Venezuela C.A.', 'Protocol Capital W.L.L, C.A.'],
      estado: ['Anzoátegui', 'Carabobo', 'Zulia'],
      model: '',
      material: ''
    }
  },
  created () {
    console.log('ihola')
    // window.QRScanner.scan(this.onDone)
  },
  methods: {
    onDone (data) {
      const dataEnter = data.split('\n')
      const objectData = {}
      dataEnter.map(data => {
        const data2 = data.split(':')
        if (data2.length === 2) {
          const stringFormated = data2[0].replace(/"/g, '-').replaceAll('.', '_').replaceAll(' ', '')
          objectData[stringFormated] = data2[1]
        }
      })
      const placas = objectData.PLACAS.split('/')
      objectData.CHUTO = placas[0]
      objectData.BATEA = placas[1]
      console.log(objectData)
    },
    error (error) {
      alert(error)
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
