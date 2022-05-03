const client = require('../libraries/Plaid')

const createLinkToken = async (req, res) => {
  const response = await client.linkTokenCreate({
    user: {
      client_user_id: 'unique-id'
    },
    client_name: 'Plaid Test App',
    products: ['auth', 'identity'],
    country_codes: ['US'],
    language: 'en'
  })
  console.log(response.data)
  return res.json(response.data)
}

const exchangeToken = async (req, res) => {
  const response = await client.itemPublicTokenExchange({
    public_token: req.body.public_token
  })
  return res.json(response.data)
}

module.exports = {
  createLinkToken,
  exchangeToken
}
