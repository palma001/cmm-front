<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar class="bg-primary">
        <q-btn flat
          dense
          round
          class="q-mr-sm"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-separator dark vertical inset />
        <q-toolbar-title>
          {{ ucwords($t(`modules.${titleApp}`)) }}
          <q-tooltip :offset="[10, 10]">
            {{ ucwords($t(`modules.${titleApp}`)) }}
          </q-tooltip>
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="notifications"
          aria-label="dark_mode"
          class="q-mr-sm q-ml-sm"
          @click="getNotifications"
        >
          <q-tooltip :offset="[10, 10]">
            Notificaciones
          </q-tooltip>
          <q-popup-proxy>
            <q-card>
              <q-card-section class="q-pa-none">
                <q-item>
                  <q-item-section>
                    <q-toolbar-title>
                      Notificaciones
                    </q-toolbar-title>
                  </q-item-section>
                  <q-item-section top side>
                    <q-btn flat icon="more_vert" round>
                      <q-menu max-width="300px">
                        <q-list dense style="width: 250px;">
                          <q-item clickable v-ripple>
                            <q-item-section thumbnail>
                              <q-avatar icon="check" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>
                                Marcar todas como leídas
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple>
                            <q-item-section thumbnail>
                              <q-avatar icon="list" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>
                                Abrir notificaciones
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <q-item v-for="notification in notifications" :key="notification.id">
                  <q-item-section class="q-px-xs">
                    <q-item-label>
                      {{ notification.data.title }}
                    </q-item-label>
                    <q-item-label caption lines="2">
                      {{ notification.data.description }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section top side :class="notification.read_at ? '' : 'text-secondary'">
                    <q-item-label>{{ ucwords(notification.diffForHumans) }}</q-item-label>
                    <q-icon size="md" name="circle_notifications"/>
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
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
            {{ this.$q.dark.isActive ? 'Modo claro' : 'Modo oscuro' }}
          </q-tooltip>
        </q-btn>
        <q-separator dark vertical inset />
        <q-btn
          flat
          dense
          round
          icon="person"
          aria-label="person"
          v-if="GET_USER"
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
        style="height: 90vh;"
      >
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
                <q-item-section @click="changeRoute(list.route, list.name)">
                  <q-item-label>
                    {{ ucwords($t(`modules.${list.name}`)) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-expansion-item>
      </q-scroll-area>
      <div class="text-center text-uppercase">
        developed by <span class="text-primary text-bold">q</span><span class="text-bold text-secondary">bits</span>
      </div>
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
      notifications: [],
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
        backgroundColor: '#4A235A',
        width: '7px',
        opacity: 1
      },
      labelDrown: null,
      dataMenu: [],
      active: true,
      visibleLoading: false,
      titleApp: null,
      route: '',
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
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.branchOfficeSelected = this[GETTERS.GET_BRANCH_OFFICE]
    this.userSession = this[GETTERS.GET_USER]
    this.role = this[GETTERS.GET_ROLE]
    this.loadingPage()
    this.getNotifications()
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
    getNotifications () {
      this.$services.getData(['notifications'])
        .then(({ res }) => {
          console.log(res.data)
          this.notifications = res.data
        })
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
      // this.$router.push({ name: this.role.modules[0].route })
      this.$q.dark.set(SessionStorage.getItem('dark'))
      this.titleApp = this.role.modules.find(module => module.route === this.$route.name).name
    },
    /**
     * Change route
     * @param  {String} data name route
     */
    changeRoute (data, listName) {
      this.$router.push({ name: data })
      this.route = data
      this.titleApp = listName
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

<!-- <style lang="sass">
.my-menu-link
  color: white
  background: #4A235A
</style> -->
