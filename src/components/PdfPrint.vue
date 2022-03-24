<template>
  <div class="row q-py-sm justify-center">
    <div id="logo" class="col-2">
      <img src="logo-aprobado.png" class="img">
    </div>
    <div class="col-5 row text-center text-primary">
      <div class="col-12 text-bold text-uppercase">
        Asociación de trabajadores del mercado
      </div>
      <div class="col-12 text-h6 text-bold text-center text-uppercase">
        Mercado Nr 2
      </div>
      <div class="col-12 text-center text-uppercase" style="font-size: 10px;">
        urb. inca manco capac - av. santa rosa de lima 1,598 <br>
        segunda etapa - san juan de lurigancho <br>
        fundado el 17 de septiembre de 1,997
      </div>
      <div class="col-12 text-center" style="font-size: 10px;">
        Reconocido Oficialmente el 27 de Noviembre de 1980
      </div>
    </div>
    <div class="col-3 text-center">
      <table class="table" border="1">
        <tr class="bg-blue-2 text-center text-primary text-bold">
          <td class="text-uppercase">
            {{ title }}
          </td>
        </tr>
        <tr class="text-red-13" v-if="numberReceipt">
          <td class="q-pa-sm">{{ numberReceipt }}</td>
        </tr>
      </table>
      <table class="table q-mt-sm" border="1">
        <tr class="bg-blue-2 text-center text-primary text-bold">
          <td class="text-uppercase" colspan="3">
            Fecha
          </td>
        </tr>
        <tr class="text-blue-13">
          <td>{{ formatDate(dateNow, 'D')}}</td>
          <td>{{ formatDate(dateNow, 'M')}}</td>
          <td>{{ formatDate(dateNow, 'YY')}}</td>
        </tr>
      </table>
    </div>
    <div class="col-10">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
import { date } from 'quasar'
export default {
  props: {
    dateNow: {
      type: [String, Object],
      require: true
    },
    numberReceipt: {
      type: Number,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  methods: {
    formatDate (data, format) {
      return date.formatDate(data, format)
    }
  }
}
</script>

<style>
.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
#logo .img{
  width: 100%;
  height: 120px;
}
.table tr:nth-child(2n-1) td {
  background: #F5F5F5;
}
</style>
