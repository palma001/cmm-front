<template>
  <div>
    <LayoutComponent
      titleApp="DBA"
      titleMenu="Opciones"
      :data="modules"
      @logout="logout"
    />
    <q-dialog v-model="dialogSession" position="top" seamless persistent>
      <q-card>
        <q-card-section class="row items-center no-wrap bg-primary">
          <div>
            <div class="text-weight-bold">Tu sesión esta por vencer</div>
          </div>
          <q-space />
          <q-btn color="secondary" label="extender sesión" @click="session('refresh')" class="q-ml-lg" dense :loading="loading"/>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import LayoutComponent from 'components/LayoutComponent.vue'
import { mapActions, mapGetters } from 'vuex'
import { ACTIONS, GETTERS } from '../store/module-login/name.js'
export default {
  name: 'MainLayout',
  components: { LayoutComponent },
  data () {
    return {
      /**
       * Data menu
       *
       * @type {Array} data menu
       */
      modules: [],
      loading: false
    }
  },

  created () {
    this.getAllModules()
    // this.loadCron()
  },

  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_ROLE, GETTERS.GET_TOKEN_TYPE, GETTERS.GET_TOKEN, GETTERS.GET_REFRESH_TOKEN]),

    dialogSession () {
      return this[GETTERS.GET_TOKEN] === null || this[GETTERS.GET_TOKEN] === 'null'
    }
  },
  watch: {
    dialogSession () {
      console.log(this[GETTERS.GET_TOKEN])
      setTimeout(() => {
        if (this[GETTERS.GET_TOKEN] === null || this[GETTERS.GET_TOKEN] === 'null') {
          this.logout()
        }
      }, 10000)
    }
  },
  methods: {
    loadCron () {
      this.$crontab.addJob({
        name: 'location',
        interval: {
          seconds: '/10'
        },
        job: this.location,
        condition: this.validateSession
      })
    },
    /**
     * Logout User
     * @type {String} event
     */
    async session (data) {
      this.loading = true
      switch (data) {
        case 'logout':
          this.logout()
          break
        default:
          await this[ACTIONS.REFRESH_TOKEN]({ self: this, refreshToken: this[GETTERS.GET_REFRESH_TOKEN] })
          this.loading = false
          break
      }
    },

    validateSession () {
      return this[GETTERS.GET_USER] && this[GETTERS.GET_USER].rol === 'ET'
    },
    /**
     * Get all products
     */
    getAllModules () {
      const header = `${this[GETTERS.GET_TOKEN_TYPE]} ${this[GETTERS.GET_TOKEN]}`
      this.$services.setAxiosHeader('Authorization', header)
      this.$services.getData(['sections'])
        .then(({ res }) => {
          this.modules = res.data
        })
    },
    /**
     * Log out api
     */
    logout () {
      this[ACTIONS.LOGOUT]({ self: this })
    },
    /**
     * Enviar localización
    */
    location () {
      this.$getLocation({})
        .then(coordinates => {
          const userData = {
            position: {
              lat: coordinates.lat,
              lng: coordinates.lng
            },
            userName: this[GETTERS.GET_USER].nombre
          }
          this.updateRoom(userData)
        })
    },
    /**
     * Modificar coordenadas
     * @type {Object} datos de coordenadas
    */
    updateRoom (data) {
      const channel = this.$ably.channels.get(this[GETTERS.GET_USER].codigo)
      channel.presence.update(data, function (err) {
        if (err) {
          return console.error('Error updating presence data')
        }
        console.log('We have successfully updated our data')
      })
    },
    ...mapActions([ACTIONS.LOGOUT, ACTIONS.REFRESH_TOKEN])
  }
}
</script>
