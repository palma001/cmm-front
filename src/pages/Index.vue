<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <div class="row">
      <div class="col">
        <div class="text-h5">
          Lista de producto
        </div>
      </div>
    </div>
    <div class="row" v-for="product in allProducts" :key="product.id">
      <div class="col-md-12">
        <q-card class="my-card">
          <q-card-section horizontal>
            <q-img
              class="col-5"
              src="https://cdn.quasar.dev/img/parallax1.jpg"
            />
            <q-card-section>
              <q-btn
                fab
                color="primary"
                icon="shopping_cart"
                class="absolute"
                style="top: 15px; right: 12px; transform: translateY(-50%);"
              />
                <div class="text-h6">
                  {{ product.name }}
                </div>
              <div class="row no-wrap items-center">
                <div class=" col text-subtitle2 ellipsis">
                  {{ product.brand }} - {{ product.sub_category }}
                </div>
                <div class="col-auto text-caption q-pt-md row no-wrap items-center">
                  $ {{ product.price }}
                </div>
              </div>
              <div class="text-caption text-grey">
                {{ product.description }}
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="card">
      <q-card class="my-card" v-if="productScaner">
        <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="shopping_cart"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ productScaner.name }}
            </div>
            <div class="col-auto text-caption q-pt-md row no-wrap items-center">
              $
              {{ productScaner.price }}
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ productScaner.sub_category }} - {{ productScaner.brand }}
          </div>
          <div class="text-caption text-grey">
            {{ productScaner.description }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Cerrar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="purple" icon="keyboard_arrow_up" direction="up" label="Opciones" label-position="left" external-label>
        <q-fab-action color="amber" size="md" @click="captureImage" icon="qr_code" glossy label="Scanner" label-position="left" external-label/>
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
// outside of the default export,
// we need to listen to the event for ourselves:
document.addEventListener('deviceready', () => {
  // it's only now that we are sure
  // the event has triggered
}, false)

export default {
  data () {
    return {
      /**
       * all products
       * @type {Array} all products
       */
      allProducts: [],

      productScaner: null,

      card: false
    }
  },
  created () {
    this.saberDondeEstoy()
    this.getAllProducts()
  },
  methods: {

    saberDondeEstoy () {
      this.imageSrc = 'hola'
    },

    getAllProducts () {
      this.$mockData.getData('products')
        .then(({ response }) => {
          this.allProducts = response.data.content
        })
    },

    /**
     * Get products scanner
     *
     * @param {Object} data scanner
     *
     */

    getOneProduct (data) {
      this.productScaner = this.allProducts.filter(element => {
        return Number(element.code) === Number(data.text)
      })[0]

      if (!this.productScaner) {
        alert('Producto no encontrado')
      } else {
        this.card = true
      }
    },

    captureImage () {
      cordova.plugins.barcodeScanner.scan(
        (result) => { this.getOneProduct(result) },
        function (error) {
          alert('No se pudo escanear: ' + error)
        }
      )
    }
  }
}
</script>
