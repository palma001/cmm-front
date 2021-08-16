<template>
  <div class="row">
    <div class="col-6" v-if="!$q.screen.lt.sm">
      <img src="illustration.png" class="full-width flex flex-center" style="height: 100vh;">
    </div>
    <div :class="$q.screen.lt.sm ? 'col-12 flex flex-center' : 'col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 flex flex-center q-mb-xl'">
      <q-card flat class="my-card" style="width: 70%; background: transparent">
        <q-card-section class="text-center">
          <img src="logo.png" class="img">
        </q-card-section>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Iniciar sesión</div>
        </q-card-section>
        <q-card-section :class="!$q.dark.isActive ? 'bg-blue-grey-1' : 'bg-dark'">
          <q-input
            class="q-mt-sm"
            color="primary"
            v-model="username"
            label="Correo"
            ref="username"
            name="username"
            outlined
            dense
            @keyup.enter.native="login"
            :rules="[val => !!val || 'El campo es requerido.']">
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            class="q-mt-md"
            color="primary"
            v-model="password"
            label="Contraseña"
            ref="password"
            name="password"
            type="password"
            dense
            outlined
            @keyup.enter.native="login"
            :rules="[val => !!val || 'El campo es requerido.']">
            <template v-slot:prepend>
              <q-icon name="lock"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions :class="!$q.dark.isActive ? 'bg-blue-grey-1' : 'bg-dark'">
          <q-space/>
          <q-btn
            color="primary"
            @click="login"
            :disable="btnDisable">
            <span v-if="btnDisable">
              <q-spinner-hourglass
                color="blue-1"
                size="20px"
                :disable="btnDisable"
              />
              Cargando...
            </span>
            <span v-if="!btnDisable">
              Iniciar Sesión
            </span>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { ACTIONS } from '../store/module-login/name.js'
export default {
  data () {
    return {
      /**
         * Email User
         * @type {String}
         */
      username: '',
      /**
         * Password User
         * @type {String}
         */
      password: '',
      /**
       * Message Error
       * @type {String}
       */
      message: null,

      btnDisable: false
    }
  },
  methods: {
    /**
     * return error when field is empty
     * @param {string}
     */
    errorValidation (field) {
      return this.errors.has(field) ? 'is-danger' : null
    },
    /**
     * Login app
     */
    async login () {
      this.$refs.username.validate()
      this.$refs.password.validate()
      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      } else {
        await this[ACTIONS.LOGIN]({ self: this, param: { username: this.username, password: this.password } })
      }
    },

    ...mapActions([ACTIONS.LOGIN])
  }
}
</script>
<style>
  .img {
    width: 40%;
  }
  .body {
    scroll-behavior: hidden;
  }
</style>
