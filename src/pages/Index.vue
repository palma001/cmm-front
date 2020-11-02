<template>
  <div>
    <template>
      <div class="q-pa-md">
        <q-table
          title="Usuarios"
          :data="list"
          :columns="columns"
          row-key="nombre"
        >
          <template v-slot:top-right>
            <q-input filled dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
      </q-table>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      /**
       * Filters table
       * @type {String}
       */
      filter: '',
      /**
       * Data table
       * @type{Array}
       */
      list: [],
      /**
       * Columns table
       * @type{Array}
       */
      columns: [
        {
          name: 'nombre',
          label: 'Nombre',
          field: 'nombre',
          align: 'left',
          sortable: true
        },
        {
          name: 'apellido',
          label: 'Apellido',
          field: 'apellido',
          align: 'left'
        }
      ]
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      this.$services.getData(['ficde', 'usuarios'])
        .then(({ res }) => {
          this.list = res.data.data
        })
    }
  }
}
</script>
