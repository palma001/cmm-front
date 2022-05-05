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
          <qrcode-stream @decode="onDecode"></qrcode-stream>
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
  methods: {
    onDecode (data) {
      alert(data)
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
