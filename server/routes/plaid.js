const { Router } = require('express')
const router = Router()

const { createLinkToken, exchangeToken } = require('../controllers/PlaidController')
const { getBankTransactions, getBankBalance } = require('../controllers/BankController')

router.get('/', createLinkToken)
router.post('/', exchangeToken)
router.get('/bank/transactions', getBankTransactions)
router.get('/bank/balances', getBankBalance)

module.exports = router
