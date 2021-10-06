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
        <q-btn
          flat
          dense
          round
          :icon="this.$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          aria-label="dark_mode"
          class="q-mr-sm q-ml-sm"
          @click="darkMode"
        >
          <q-tooltip :offset="[10, 10]">
            {{ this.$q.dark.isActive ? 'Light Mode' : 'Dark Mode' }}
          </q-tooltip>
        </q-btn>
        <q-separator dark vertical inset />
        <q-btn
          flat
          dense
          round
          icon="person"
          aria-label="person"
          class="q-mr-sm q-ml-sm">
          <q-menu>
            <q-list>
              <q-item clickable v-ripple v-close-popup>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="../assets/user.png">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  {{ ucwords(userSession.full_name) }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup dense>
                <q-item-section avatar>
                  <q-avatar icon="email"/>
                </q-item-section>
                 <q-item-section>
                  {{ GET_USER.email }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup dense>
                <q-item-section avatar>
                  <q-avatar icon="badge"/>
                </q-item-section>
                 <q-item-section>
                  {{ role.name }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn color="negative"
                    label="Cerrar Sesión"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout"
                  />
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
          <q-item>
            <q-item-section avatar class="">
              <q-icon name="maps_home_work"/>
            </q-item-section>
            <q-item-section class="q-mr-xl">
              <q-item-label>
                {{ ucwords(branchOfficeSelected.name) }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar v-if="role.acronym === 'super_admin'">
              <q-btn rounded flat icon="unfold_more" size="md"/>
              <q-popup-edit v-model="branchOffice.name" auto-save>
                <q-select
                  use-input
                  fill-input
                  hide-selected
                  outlined
                  dense
                  autofocus
                  autocomplete="off"
                  input-debounce="0"
                  v-model="branchOfficeSelected"
                  option-value="id"
                  option-label="name"
                  label="Establecimiento"
                  :rules="[val => val || 'El campo metodo de pago es requerido']"
                  :options="branchOffices"
                  @filter="getBranchOffices"
                  @input="chanageBranchOffice"
                />
              </q-popup-edit>
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
    <q-inner-loading :showing="visibleLoading">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-layout>
</template>

<script>
import { mixins } from '../mixins'
import { GETTERS, MUTATIONS } from '../store/module-login/name.js'
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
      branchOfficeSelected: null,
      branchOffices: [],
      userSession: null,
      role: null,
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
      visibleLoading: false,
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
    this.branchOfficeSelected = this[GETTERS.GET_BRANCH_OFFICE]
    this.userSession = this[GETTERS.GET_USER]
    this.role = this[GETTERS.GET_ROLE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_ROLE, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Get payment method
     * @param {String} value data filter
     */
    getBranchOffices (value, update) {
      this.$services.getData(['branch-offices'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.branchOffices = res.data.data
          })
        })
    },
    chanageBranchOffice () {
      this.visibleLoading = true
      this.$store.commit(MUTATIONS.SET_BRANCH_OFFICE, this.branchOfficeSelected)
      setTimeout(() => {
        this.$root.$emit('change_branch_office', this.branchOfficeSelected)
        this.visibleLoading = false
      }, 1000)
    },
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
