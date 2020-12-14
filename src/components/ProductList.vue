<template>
  <div style="position: relative;">
    <div class="row q-gutter-xs">
      <div class="col-xs-8 col-sm-9 col-md-8 col-lg-9">
        <q-input
          type="text"
          dense
          outlined
          clearable
          label="Código"
          v-model="search"
          ref="codigo"
          :autofocus="autofocus"
          @keyup.enter="findProduct"
        />
      </div>
      <div class="col-xs-3 col-sm-2 col-md-3 col-lg-2">
        <q-btn
          class="full-width full-height"
          :color="showList ? 'negative' : 'primary'"
          :icon="showList ? 'close' : 'search'"
          @click="showLists"
        />
      </div>
    </div>
    <div class="container-list-item" v-if="showList">
      <q-list dense bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'" v-for="product in dataList" :key="product.id">
        <q-item clickable v-ripple>
          <q-item-section @click="selected(product)">
            {{ product[label] }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    data: {
      type: Array,
      require: true
    },
    value: {
      type: String,
      require: true
    },
    label: {
      type: String,
      require: true
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showList: false,
      search: ''
    }
  },
  computed: {
    dataList () {
      if (typeof this.search === 'string') {
        return this.data.filter(product => {
          return product.id.toLowerCase().match(this.search.toLowerCase()) ||
          product.articulo.toLowerCase().match(this.search.toLowerCase())
        })
      }
      return this.data
    }
  },
  methods: {
    findProduct () {
      const data = this.data.filter(product => product.codigo === this.search)
      if (data.length > 0) {
        this.$emit('selected', data[0])
        this.search = ''
      } else {
        this.$emit('errorSearch', this.search)
      }
      this.focus()
    },
    selected (data) {
      this.$emit('selected', data)
      this.focus()
    },
    showLists () {
      this.focus()
      this.$emit('showLists')
      this.showList = !this.showList
    },
    focus () {
      this.$refs.codigo.focus()
    }
  }
}
</script>
<style lang="stylus" scoped>
.container-list-item {
  position: absolute;
  z-index: 1;
  margin-top: 5px;
  width: 100%;
  height: 500px;
  overflow: auto;
}
</style>
