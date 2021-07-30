<template>
  <div class="body">
    <div class="row justify-center">
      <div class="col-xl-3 col-lg-4 col-md-4 col-sm-7 col-xs-11">
        <q-card flat class="my-card" style="background-color: transparent !important;">
          <q-card-section class="text-center q-pt-none q-pb-none">
            <img src="../statics/logos/logo_dixcont.png" class="img">
          </q-card-section>
        </q-card>
        <q-card class="my-card" style="opacity: 0.9">
          <q-card-section class="bg-primary glossy text-white">
            <div class="text-h6">Iniciar sesión</div>
          </q-card-section>
          <q-card-section>
            <q-input
              class="q-mt-sm"
              color="primary"
              v-model="username"
              label="Correo"
              ref="username"
              name="username"
              outlined
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
              outlined
              @keyup.enter.native="login"
              :rules="[val => !!val || 'El campo es requerido.']">
              <template v-slot:prepend>
                <q-icon name="lock"/>
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions class="">
            <q-space/>
            <q-btn
              color="primary glossy"
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
  .body {
    background-image: url('../statics/image/fondo.jpeg');
    overflow-y:hidden!important;
    overflow-x: auto!important;
    width: 100%;
    height: 100vh;
    position: relative;
  }
  .body:before {
    content:'';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y:hidden!important;
    background-color: rgba(0,0,0,0.6);
  }

  .img {
    width: 70%;
  }
</style>
