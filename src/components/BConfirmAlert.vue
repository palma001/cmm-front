<template>
  <q-dialog
    v-model="openDialog"
  >
    <q-card style="width: 400px; max-width: 80vw;">
      <q-card-section :class="`bg-${color} glossy text-white`">
        <div class="text-h6">{{ ucwords($t(`template.messageSistem`)) }}</div>
      </q-card-section>
      <q-card-section class="row items-center justify-start">
        <q-avatar
          size="40px"
          class="glossy"
          text-color="white"
          :icon="icon"
          :color="color"
        />
        <span class="q-ml-sm col">
          {{ ucwords(message) }}
        </span>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn :label="$t('template.cancel')" class="glossy" color="negative" @click="cancel" :disable="loading"/>
        <q-btn :label="$t('template.confirm')" class="glossy" color="primary" @click="confirm" :loading="loading" :disable="loading"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mixins } from '../mixins'
export default {
  name: 'BConfirmAlert',
  mixins: [mixins.containerMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'alert'
    },
    icon: {
      type: String,
      default: 'mood'
    },
    color: {
      type: String,
      default: 'primary'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show () {
      this.value = this.show
    }
  },
  computed: {
    openDialog () {
      return this.value
    }
  },
  data () {
    return {
      value: false
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },

    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
