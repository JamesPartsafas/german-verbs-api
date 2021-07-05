//This file routes functions defined in the controllers folder to the appropriate HTTP requests
const express = require('express')
const router = express.Router()

const {
    conjugateFull,
    conjugatePerson,
    errorHandler,
    conjugateArray
} = require('../controllers/verbs')

router.get('/', conjugateFull)
router.post('/', errorHandler, conjugatePerson)
router.post('/tense-array', conjugateArray)

module.exports = router