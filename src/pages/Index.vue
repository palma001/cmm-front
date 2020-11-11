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
          name: 'name',
          label: 'Nombre',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          name: 'lastname',
          label: 'Apellido',
          field: 'lastname',
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
      this.$mockData.getData('users', 5)
        .then(({ response }) => {
          this.list = response.data.content
          console.log(this.list)
        })
    }
  }
}
</script>
