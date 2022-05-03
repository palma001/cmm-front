const client = require('../libraries/Plaid')

const getBankTransactions = async (req, res) => {
  client.transactionsGet(req.query)
    .then((response) => {
      return res.json(response.data)
    })
    .catch((e) => {
      console.log(e.response.data)
    })
  // console.log(response.data)
}
const getBankBalance = async (req, res) => {
  console.log(req.query)
  client.accountsBalanceGet(req.query)
    .then((response) => {
      console.log(response.data)
      return res.json(response.data)
    })
    .catch((e) => {
      console.log(e.response.data)
    })
  // console.log(response.data)
}

module.exports = {
  getBankTransactions,
  getBankBalance
}
