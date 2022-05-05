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
      openQr: false
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
  max-width: 250px
</style>
