<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ titleApp }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1">
      <div
        v-for="list in data"
        :key="list.id">
        <q-list
          v-for="(divice, index) in list.devices"
          :key="index"
        >
          <q-item
            v-if="validateDivice(divice)"
            clickable>
            <q-item-section
              @click="changeRoute(list.route)"
            >
              <q-item-label class="text-capitalize">
                {{  $t(`modules.${list.name}`) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Loading, QSpinnerGears } from 'quasar'
export default {
  name: 'LayoutComponent',

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
      visible: true,
      /**
       * Status menu
       *
       * @type {Bollean} status menu
       */
      leftDrawerOpen: false
    }
  },
  created () {
    this.loadingPage()
  },
  methods: {
    loadingPage () {
      Loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'primary',
        backgroundColor: 'white',
        spinnerSize: 100
      })

      setTimeout(() => {
        Loading.hide()
      }, 3000)
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
