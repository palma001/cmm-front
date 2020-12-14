<template>
  <q-btn :icon="icon" :label="label" flat stretch>
    <q-tooltip
      anchor="bottom middle"
      transition-show="flip-right"
      transition-hide="flip-left"
      content-style="font-size: 13px"
      v-if="tooltip"
      :offset="[10, 10]"
    >
      {{ $t(`template.${tooltip}`) }}
    </q-tooltip>
    <q-menu>
      <q-list>
        <q-item v-for="item in dataItem" :key="item.id"
          clickable
          v-close-popup
          tabindex="0"
        >
          <q-item-section avatar>
            <q-avatar
              :icon="icon"
              color="primary"
              text-color="white"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{dataItem[labelItem]}}</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: 'BDropdown',
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
    return {}
  }
}
</script>
