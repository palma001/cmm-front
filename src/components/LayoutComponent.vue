<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar class="bg-primary glossy">
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
        <q-separator dark vertical inset />
        <q-btn
          flat
          dense
          round
          icon="person"
          aria-label="person"
          class="q-mr-sm q-ml-sm">
          <q-menu>
            <q-list style="min-width: 180px;">
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
                        {{ GET_USER ? ucwords(GET_USER.full_name) : '' }}
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-expansion-item expand-separator
                class="text-primary"
                icon="people_alt"
                :label="GET_USER ? `${GET_USER.email}` : ''">
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

    <q-drawer
      bordered
      show-if-above
      v-model="leftDrawerOpen"
      class="q-pa-none"
    >
      <q-scroll-area
        :thumb-style="thumbStyle"
        :content-style="contentStyle"
        :content-active-style="contentActiveStyle"
        style="height: 91vh;"
      >
        <q-list>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section avatar class="">
              <q-icon name="maps_home_work"/>
            </q-item-section>
            <q-item-section class="q-mr-xl">
              <q-item-label>
                {{ ucwords(branchOffice.name) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-expansion-item
          expand-separator
          v-for="category_module in dataMenu"
          :key="category_module.id"
          :icon="category_module.icon"
          :default-opened="category_module.open === 1"
          :label="ucwords($t(`template.${category_module.name}`))"
        >
          <div
            v-for="list in category_module.modules"
            :key="list.id"
          >
            <q-list
              v-for="(divice, index) in JSON.parse(list.devices)"
              :key="index"
            >
              <q-item
                clickable
                v-ripple
                active-class="my-menu-link"
                v-if="validateDivice(divice) && validateRole(list.roles)"
                :active="list.route === $route.name"
              >
                <q-item-section avatar v-if="list.icon" class="q-ml-sm">
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
      </q-scroll-area>
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
import { SessionStorage } from 'quasar'
export default {
  name: 'LayoutComponent',
  mixins: [mixins.containerMixin],
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
      branchOffice: null,
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        color: 'black'
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#1976D2',
        width: '7px',
        opacity: 1
      },
      labelDrown: null,
      dataMenu: [],
      active: true,
      visible: false,
      route: '',
      sucursales: SessionStorage.getItem('sucursales'),
      /**
       * Status menu
       *
       * @type {Bollean} status menu
       */
      leftDrawerOpen: false,
      miniState: false
    }
  },
  watch: {
    data (value) {
      this.dataMenu = value.filter(element => {
        return element.modules.filter(module => {
          return this.validateRole(module.roles)
        }).length > 0
      })
    }
  },
  created () {
    this.loadingPage()
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_ROLE, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    validateRole (roles = []) {
      const rol = this[GETTERS.GET_ROLE]
      if (roles && roles.length > 0 && rol) {
        return roles.filter(element => {
          return element.id === rol.id
        })[0]
      }
      return false
    },
    /**
     * Emit event logout
     */
    logout () {
      this.$emit('logout')
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
    },
    /**
     * Change route
     * @param  {String} data name route
     */
    changeRoute (data) {
      this.$router.push({ name: data })
      this.route = data
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

<style lang="sass">
.my-menu-link
  color: white
  background: #1976D2
</style>
