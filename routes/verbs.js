//This file routes functions defined in the controllers folder to the appropriate HTTP requests
const express = require('express')
const router = express.Router()

const {
    conjugateFull,
    conjugatePerson
} = require('../controllers/verbs')

router.get('/', conjugateFull)
router.post('/', conjugatePerson)

module.exports = router