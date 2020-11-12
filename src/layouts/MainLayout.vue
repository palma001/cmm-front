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
          Bais
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <q-item
          clickable
          v-if="this.$q.platform.is.mobile"
        >
          <q-item-section @click="changeRoute('products')">
            <q-item-label>Productos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-if="this.$q.platform.is.desktop"
        >
          <q-item-section @click="changeRoute('pwa')">
            <q-item-label>Pwa</q-item-label>
            <q-item-label caption>
              pwa
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

const linksData = [
  {
    title: 'PWA',
    caption: 'pwa',
    icon: 'school',
    link: 'pwa'
  },
  {
    title: 'Cordova',
    caption: 'cordova',
    icon: 'school',
    link: 'cordova'
  }
]

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  methods: {
    /**
     * Change route
     * @param  {String} data name route
     */
    changeRoute (data) {
      console.log()
      this.$router.push({ name: data })
    }
  }
}
</script>
