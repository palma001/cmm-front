<template>
  <q-btn :icon="icon" :label="label" flat stretch>
    <q-tooltip
      anchor="center left"
      self="center right"
      transition-show="flip-right"
      transition-hide="flip-left"
      content-style="font-size: 13px"
      v-if="tooltip"
      :offset="[10, 10]"
    >
      {{ ucwords($t(`template.${tooltip}`)) }}
    </q-tooltip>
    <q-menu>
      <q-list v-for="item in dataItem" :key="item.id">
        <q-item
          clickable
          v-close-popup
          v-ripple
          dense
          bordered
          tabindex="0"
          active-class="my-menu-link"
          :active="item[labelItem] === itemSelected"
          @click="selected(item)"
        >
          <q-item-section avatar>
            <q-icon :name="icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label :lines="3" class="active">{{item[labelItem]}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mixins } from '../mixins'
export default {
  name: 'BDropdown',
  mixins: [mixins.containerMixin],
  props: {
    icon: {
      type: String,
      default: 'home'
    },
    label: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: null
    },
    labelItem: {
      type: String,
      default: ''
    },
    dataItem: {
      type: Array
    }
  },
  data () {
    return {
      itemSelected: this.label
    }
  },
  methods: {
    /**
     * Emit event selected
     * @param {Object} data data selected
     */
    selected (data) {
      this.itemSelected = data[this.labelItem]
      this.$emit('selected', data)
    }
  }
}
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: goldenrod
</style>
