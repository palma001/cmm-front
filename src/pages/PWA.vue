<template>
  <div>
    {{ imageSrc }}
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
      // this.imageSrc = this.platform.is('cordova') ? 'mobile' : 'navegador'
    }
  }
}
</script>
