<template>
  <div class="body" v-if="data">
    <div class="clearfix header row justify-center">
      <div id="logo" class="col-2">
        <img src="logo.png" class="img">
      </div>
      <div class="col-10">
        <h3 class="q-mt-lg">{{ data.title }}  {{ data.serie }}</h3>
      </div>
      <div id="project" class="col-5">
        <div>
          <span>{{ data.client.fieldName }}</span>
          {{ data.client.fullName }}
        </div>
        <div>
          <span>{{ data.client.documentType }}</span>
          {{ data.client.documentNumber }}
        </div>
        <div>
          <!-- <span>DIRECCIÓN</span>
          {{ strtoupper($bills[0]->address) }} -->
        </div>
        <!-- <div>
          <span>E-MAIL</span>
          <a href="mailto:{{ $bills[0]->email }}">{{ $bills[0]->email }}</a>
        </div> -->
        <div>
          <span>Moneda</span>
          {{ data.coin }}
        </div>
        <div>
          <span>FECHA</span>
          {{ data.date }}
        </div>
        <div>
          <span>FECHA DE EXPIRACIÓN</span>
          {{ data.expirationDate }}
        </div>
      </div>
      <div id="project" class="col-5">
        <div>
          <span>TIENDA</span>
          {{ data.branchOffice.name }}
        </div>
        <div>
          <span>RUC</span>
          J-412902318
        </div>
        <div v-if="data.seller">
          <span>VENDEDOR</span>
          {{ data.seller }}
        </div>
        <div>
          <span>TELEFONO</span>
          +584248019228
        </div>
        <div>
          <span>E-MAIL</span>
          demo@gmal.com
        </div>
      </div>
    </div>
    <main>
      <table class="table">
        <thead>
          <tr>
            <th class="service">ITEM</th>
            <th class="desc">NOMBRE</th>
            <th class="desc">DESCRIPCIÓN</th>
            <th class="service">CANTIDAD</th>
            <th class="service">PRECIO UNI</th>
            <th class="service">SUBTOTAL</th>
            <th>IGV</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in data.products" :key="product.id">
            <td class="service">{{  index + 1 }}</td>
            <td class="name">
              {{ product.product.name }}
            </td>
            <td class="desc">
              {{ product.product.description }}
            </td>
            <td class="unit">
              {{ product.amount }}
            </td>
            <td class="qty">
              {{ product.price }}
            </td>
            <td class="subtotal">
              {{ product.amount * product.price }}
            </td>
            <td class="igv">
              {{ product.igv.toFixed(2) }}
            </td>
            <td class="total">
              {{ Number((product.amount * product.price) + product.igv).toFixed(2) }}
            </td>
        </tr>
        <tr>
          <td colspan="7" class="grand total">SUBTOTAL</td>
          <td class="grand total">{{ data.subtotal.toFixed(2) }}</td>
        </tr>
        <tr>
          <td colspan="7" class="grand total">TOTAL IGV</td>
          <td class="grand total">{{ data.total_igv.toFixed(2) }}</td>
        </tr>
        <tr>
          <td colspan="7" class="grand total">TOTAL A PAGAR</td>
          <td class="grand total">{{ data.total.toFixed(2) }}</td>
        </tr>
        </tbody>
      </table>
      <!-- {{-- <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div> --}} -->
    </main>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      require: true
    }
  }
}
</script>

<style>
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
a {
  color: #5D6975;
  text-decoration: underline;
}
.body {
  position: relative;
  width: 88%;
  color: #001028;
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-family: Arial;
  padding: 5px;
}
.header {
  padding: 10px 0;
  margin-bottom: 30px;
}
#logo {
  text-align: center;
}
#logo img{
  width: 80px;
  height: 80px;
}
h1 {
  border-top: 1px solid  #5D6975;
  border-bottom: 1px solid  #5D6975;
  color: #5D6975;
  font-size: 2.4em;
  line-height: 1.4em;
  font-weight: normal;
  text-align: center;
  margin: 0 0 20px 0;
  /*background: url('assets/img/theme/dimension_pdf.png');*/
}
h3 {
  border-top: 1px solid  #5D6975;
  border-bottom: 1px solid  #5D6975;
  color: #5D6975;
  font-size: 2em;
  line-height: 1.4em;
  font-weight: normal;
  margin: 0 0 20px 0;
  /*background: url('assets/img/theme/dimension_pdf.png');*/
  /*background-image: url('assets/img/theme/dimension_pdf.png');*/
}
#project span {
  color: #5D6975;
  text-align: right;
  margin-right: 10px;
  font-size: 0.8em;
}
#project div,
#company div {
  white-space: nowrap;
}
.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}
.table tr:nth-child(2n-1) td {
  background: #F5F5F5;
}
.table th,
.table td {
  text-align: center;
}
.table th {
  padding: 5px 20px;
  color: #5D6975;
  border-bottom: 1px solid #C1CED9;
  white-space: nowrap;
  font-weight: normal;
}
.table .service,
.table .desc {
  text-align: left;
}
.table td {
  padding: 20px;
  text-align: right;
}
.table td.service,
.table td.desc {
  vertical-align: top;
}
.table td.unit,
.table td.qty,
.table td.total {
  font-size: 1.2em;
}
.table td.grand {
  border-top: 1px solid #5D6975;
  padding: 0px;
}
#notices .notice {
  color: #5D6975;
  font-size: 1.2em;
}
footer {
  color: #5D6975;
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #C1CED9;
  padding: 8px 0;
  text-align: center;
}
</style>
