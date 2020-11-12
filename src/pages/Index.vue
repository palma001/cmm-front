<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <div class="row">
      <div class="col-md-12">
        <q-btn color="primary" label="Scaner" @click="captureImage"/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <q-card class="my-card">
          <q-card-section horizontal>
            <q-img
              class="col-5"
              src="https://cdn.quasar.dev/img/parallax1.jpg"
            />
            <q-card-section style="width:100%;">
              <div class="text-h6">
                Our Changing Planet
              </div>
              <div class="text-subtitle2">
                by John Doe
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Adipisci aspernatur ullam consequuntur voluptatum nulla minima accusantium deleniti eius qui,
                aut ea vel, laborum ad maxime aliquid asperiores velit voluptatem magnam?
              </div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn flat round icon="event" />
            <q-btn flat>
              5:30PM
            </q-btn>
            <q-btn flat>
              7:00PM
            </q-btn>
            <q-btn flat color="primary">
              Reserve
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
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
      imageSrc: 'hola'
    }
  },
  created () {
    this.saberDondeEstoy()
  },
  methods: {

    saberDondeEstoy () {
      this.imageSrc = 'hola'
    },

    captureImage () {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          alert(result.text + result.format + 'Hola')
        },
        function (error) {
          alert('No se pudo escanear: ' + error)
        }
      )
    }
  }
}
</script>
