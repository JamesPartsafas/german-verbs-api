//This file routes functions defined in the controllers folder to the appropriate HTTP requests
const express = require('express')
const router = express.Router()

const {
    conjugateFull,
    conjugatePerson,
    errorHandler
} = require('../controllers/verbs')

router.get('/', conjugateFull)
router.post('/', errorHandler, conjugatePerson)

module.exports = router