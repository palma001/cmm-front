<template>
  <q-page padding>
    <div id="app">
      <PlaidLink
        clientName="APPLICATION NAME"
        env="sandbox"
        :link_token="linkPlaid.link_token"
        :public_key="linkPlaid.request_id"
        :products="['auth','transactions']"
        :onLoad='onLoad'
        :onSuccess='onSuccess'
        :onEvent='onEvent'
        :onExit='onExit'
        >
        <q-btn color="primary">Agregar Banco</q-btn>
      </PlaidLink>
    </div>
  </q-page>
</template>
<script>
import vue from 'vue'
import PlaidLink from '../components/PlaidLink.vue'

vue.component('PlaidLink', PlaidLink)

export default {
  name: 'App',
  data () {
    return {
      linkPlaid: {}
    }
  },
  created () {
    this.getLink()
  },
  methods: {
    async getLink () {
      const { res } = await this.$nodeServices.getData(['plaid'])
      this.linkPlaid = res.data
      console.log(res.data)
      // this.getAccessToken(res.data)
      // const response = await this.$nodeServices.getData(['plaid', 'bank'], {
      //   access_token: 'bE5QbVGWDZfPD7GNR3xNij7m9PzGrnt3bw87z',
      //   start_date: '2018-01-01',
      //   end_date: '2020-02-01'
      // })
    },
    onLoad () {
      //
    },
    onEvent () {},
    async onSuccess (publicToken, metadata) {
      this.$nodeServices.postData(['plaid'], {
        public_token: publicToken
      })
        .then(({ res }) => {
          this.$nodeServices.getData(['plaid', 'bank', 'transactions'], {
            access_token: res.access_token,
            start_date: '2018-01-01',
            end_date: '2020-02-01'
          })
            .then(({ res }) => {
              console.log(res)
            })
        })
    },
    onExit (err, metadata) {
      console.log(err, metadata)
    }
  }
}
</script>
