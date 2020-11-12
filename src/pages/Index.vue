<template>
  <div>
    <q-btn color="primary" label="Tomar Foto" @click="captureImage" />

    <img :src="imageSrc">
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
      imageSrc: ''
    }
  },

  methods: {
    captureImage () {
      navigator.camera.getPicture(
        data => { // on success
          this.imageSrc = `data:image/jpeg;base64,${data}`
        },
        (e) => { // on fail
          this.$q.notify(e)
        },
        {
          // camera options
        }
      )
    }
  }
}
</script>
