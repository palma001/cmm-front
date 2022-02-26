<template>
  <div class="flex flex-center q-mt-xl">
    <q-card flat class="my-card" style="width: 40%">
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
