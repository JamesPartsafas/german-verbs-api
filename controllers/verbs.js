/* This folder contains methods to be called to fulfill
user requests, which go through the verbs router in the routes
folder. */
const {
    tenseExists,
    verbNeedsAux,
    automaticAux,
    getPerson,
    getAllPersons,
    getAllTenses,
    getArrayTenses
} = require('../verbFinding/verbFinder')

//This function will be used on get request to get all conjugations or all conjugations of a tense
const conjugateFull = async (req, res) => {
    let {verb, tense, aux, verbCase} = req.query
    if (!verb) {
        return res.status(400).json({success:false, message:'Verb must be passed as a query parameter when using GET methods'})
    }

    if (aux !== 'SEIN' && aux !== 'HABEN') {
        aux = automaticAux(verb)
    }

    let isReflexive = true
    if (!(verbCase === 'ACCUSATIVE' || verbCase === 'DATIVE')) {
        verbCase = null
        isReflexive = false
    }

    if (tense && !(tenseExists(tense))) 
        tense = 'PRASENS'

    try {
        if (!tense) {
            const output = await getAllTenses(verb, aux, verbCase, isReflexive)
            return res.status(200).json({success:true, data:output})
        }
        else {
            const output = await getAllPersons(verb, tense, aux, verbCase, isReflexive)
            return res.status(200).json({success:true, data:output})
        }
    } catch (err) {
        return res.status(404).json({success:false, message:err.message})
    }
}

//This function will be used on post requests to handle conjugations of an individual person from a tense
const conjugatePerson = async (req, res) => {
    const {verb, tense, person, number, aux, verbCase, isReflexive, message} = req.body

    try {
        const output = await getPerson(verb, tense, person, number, aux, verbCase, isReflexive)
        return res.status(200).json({success:true, message:message, data:output})
    } catch (err) {
        message.unshift(err.message)
        return res.status(404).json({success:false, message:message})
    }
    
}

const errorHandler = async (req, res, next) => {

    if (!req.body.verb) {
        return res.status(400).json({success:false, message:'Verb must be passed as part of the body with a verb attribute'})
    }

    var hasTense = hasAux = hasVerbCase = hasPerson = hasNumber = true // These variables are used for error messages in response
    
    //Handle auxiliary verb issues
    if (req.body.aux !== 'SEIN' && req.body.aux !== 'HABEN') {
        hasAux = false
        if (verbNeedsAux(req.body.tense))
            req.body.aux = automaticAux(req.body.verb)
    }
    
    //Handle verbCase issues if the passed one is not formatted properly
    req.body.isReflexive = true
    if (!(req.body.verbCase === 'ACCUSATIVE' || req.body.verbCase === 'DATIVE')) {
        hasVerbCase = false
        req.body.verbCase = null
        req.body.isReflexive = false
    }
    
    //If there is an issue with the tense, default to present tense
    if (!(tenseExists(req.body.tense))) {
        hasTense = false
        req.body.tense = 'PRASENS'
    }

    //Handle issues with person and number
    if (!req.body.person || req.body.person < 1 || req.body.person > 3) {
        hasPerson = false
        req.body.person = 1
    }
    if (req.body.number !=='P' && req.body.number !== 'S') {
        hasNumber = false
        req.body.number = 'S'
    }
    
    req.body.message = messageLogger(hasTense, hasAux, hasVerbCase, hasPerson, hasNumber)
    
    if (typeof next === "function") //Avoid issues if next is not defined
        next()
}

const messageLogger = (hasTense, hasAux, hasVerbCase, hasPerson, hasNumber) => {
    
    let message = []
    if (!hasTense)
        message.push('No tense specified. Defaulting to PRASENS.')
    if (!hasPerson)
        message.push('No person specified. Defaulting to singular.')
    if (!hasNumber)
        message.push('No number specified. Defaulting to first person.')
    if (!hasAux)
        message.push('No auxiliary verb specified. Defaulting to a known one')
    if (!hasVerbCase)
        message.push('No case specified. Defaulting to a non-reflexive verb')
    return message
}

//Allow user to pass array of tenses as post request and receive all conjugations of the selected verb
const conjugateArray = async (req, res) => {

    if (!req.body.verb) {
        return res.status(400).json({success:false, message:'Verb must be passed as part of the body with a verb attribute'})
    }

    //Avoid returning error messages relating to not having passed person and number
    req.body.person = 1
    req.body.number = 'S'
    req.body.tense = 'PRASENS'

    await errorHandler(req, res)

    let {verb, tenseArray, aux, verbCase, isReflexive, message} = req.body
    if (!message)
        message = []
        
    try {
        const output = await getArrayTenses(verb, tenseArray, aux, verbCase, isReflexive)
        return res.status(200).json({success:true, message:message, data:output})
    } catch (err) {
        message.unshift(err.message)
        return res.status(404).json({success:false, message:message})
    }
}

module.exports = {
    conjugateFull,
    conjugatePerson,
    errorHandler,
    conjugateArray
}