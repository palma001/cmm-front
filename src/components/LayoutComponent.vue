<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-btn flat
          dense
          round
          class="q-mr-sm"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-separator dark vertical inset />
        <q-toolbar-title>{{ titleApp }}</q-toolbar-title>
        <b-dropdown
          icon="store"
          class="q-mr-sm"
          labelItem="nombre_sucursal"
          tooltip="sucursales"
          :label="labelDrown"
          :dataItem="sucursales"
          @selected="sucursaelSelected"
        />
        <q-separator dark vertical inset />
        <q-btn
          flat
          dense
          round
          icon="person"
          class="q-mr-sm q-ml-sm">
          <q-menu>
            <q-list style="min-width: 205px;">
              <q-item clickable
                v-close-popup>
                <q-item-section>
                  <div class="row q-pa-xs">
                    <div class="column">
                      <q-avatar size="45px">
                        <img src="../assets/user.png">
                      </q-avatar>
                    </div>
                    <div class="column">
                      <div class="text-subtitle1 text-primary q-mt-sm q-mb-xs q-ml-sm">
                        {{ GET_USER ? GET_USER.full_name : '' }}
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-expansion-item expand-separator
                class="text-primary"
                icon="people_alt"
                :label="GET_USER ? GET_USER.email : ''">
                <q-item clickable @click="darkMode">
                  <q-item-section avatar>
                    <q-icon name="chrome_reader_mode">
                    </q-icon>
                  </q-item-section>
                  <q-item-section>
                    <span>
                      {{ ucwords($t('template.darkMode')) }}
                      <q-badge transparent class="glossy">
                        {{ ucwords(this.$q.dark.isActive ? $t('template.desactive') : $t('template.active')) }}
                      </q-badge>
                    </span>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
              <q-item clickable
                v-close-popup>
                <q-item-section>
                  <q-btn color="negative"
                    label="Logout"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen"
      bordered>
      <q-expansion-item
        expand-separator
        default-opened
        v-for="category_module in data"
        :key="category_module.id"
        :icon="category_module.icon"
        :label="ucwords($t(`template.${category_module.name}`))">
        <div v-for="list in category_module.modules"
          :key="list.id">
          <q-list v-for="(divice, index) in list.devices"
            :key="index">
            <q-item v-if="validateDivice(divice)"
              clickable
              v-ripple
              class="q-ml-lg"
              :active="active">
              <q-item-section avatar
                v-if="list.icon">
                <q-icon :name="list.icon" />
              </q-item-section>
              <q-item-section @click="changeRoute(list.route)">
                <q-item-label>
                  {{ ucwords($t(`modules.${list.name}`)) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-expansion-item>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-layout>
</template>

<script>
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import BDropdown from '../components/BDropdown'
import { SessionStorage } from 'quasar'
export default {
  name: 'LayoutComponent',
  mixins: [mixins.containerMixin],
  components: {
    BDropdown
  },
  props: {

    /**
     * Title component
     *
     * @type {String} data content
     */
    titleApp: {
      type: String,
      required: true
    },
    /**
     * Title component
     *
     * @type {String} data content
     */
    titleMenu: {
      type: String,
      required: false
    },
    /**
     * List menu
     *
     * @type {Array} data content
     */
    data: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      labelDrown: null,
      active: true,
      visible: false,
      sucursales: SessionStorage.getItem('sucursales'),
      /**
       * Status menu
       *
       * @type {Bollean} status menu
       */
      leftDrawerOpen: true
    }
  },
  created () {
    // this.loadingPage()
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER])
  },
  methods: {
    /**
     * Emit event logout
     */
    logout () {
      this.$emit('logout')
    },
    /**
     * Sucursal lected
     * @param {Object} data sucursal selected
     */
    sucursaelSelected (data) {
      SessionStorage.set('sucursalSelected', data)
      this.labelDrown = data.nombre_sucursal
      this.$root.$emit('sucursal', data)
    },
    /**
     * Dark mode aplication
     */
    darkMode () {
      this.$q.dark.toggle()
      SessionStorage.set('dark', this.$q.dark.isActive)
    },
    /**
     * Loading aplications
     */
    loadingPage () {
      this.$q.dark.set(SessionStorage.getItem('dark'))
      const sucursaelSelected = SessionStorage.getItem('sucursalSelected')
      if (sucursaelSelected) {
        SessionStorage.set('sucursalSelected', sucursaelSelected)
        this.labelDrown = sucursaelSelected.nombre_sucursal
      } else {
        this.labelDrown = this.sucursales[0].nombre_sucursal
        SessionStorage.set('sucursalSelected', this.sucursales[0])
      }
    },
    /**
     * Change route
     * @param  {String} data name route
     */
    changeRoute (data) {
      this.$router.push({ name: data })
    },
    /**
     * Validate divice
     * @param  {String} validate divice
     */
    validateDivice (divice) {
      return this.$q.platform.is[divice]
    }
  }
}
</script>

<style>
.my-menu-link {
  background-color: #efebe4;
  color: #f5ad23;
}
</style>
