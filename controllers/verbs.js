/* This folder contains methods to be called to fulfill
user requests, which go through the verbs router in the routes
folder. */
const {
    getPerson,
    getAllPersons,
    getAllTenses
} = require('../verbFinding/verbFinder')

//This function will be used on get request to get all conjugations or all conjugations of a tense
const conjugateFull = (req, res) => {
    const {verb, tense, aux, verbCase} = req.query
    if (!verb) {
        return res.status(400).json({success:false, message:'Verb must be passed as a query parameter when using GET methods'})
    }
    try {
        if (!tense) {
            const output = getAllTenses(verb, aux, verbCase)
            return res.status(200).json({success:true, data:output})
        }
        else {
            const output = getAllPersons(verb, tense, aux, verbCase)
            return res.status(200).json({success:true, data:output})
        }
    } catch (err) {
        return res.status(404).json({success:false, message:'Verb could not be found'})
    }
}

//This function will be used with post requests, when the user wants conjugation for one of the 6 people in a tense
const conjugatePerson = (req, res) => {
    const {verb, tense, person, number, aux, verbCase} = req.body

    if (!verb) {
        return res.status(400).json({success:false, message:'Verb must be passed as part of the body with a verb attribute'})
    }
    
    const message = messageLogger(tense, person, number, aux, verbCase)

    try {
        const output = getPerson(verb, tense, person, number, aux, verbCase)
        return res.status(200).json({success:true, message:message, data:output})
    } catch (err) {
        message.push('Verb could not be found')
        return res.status(404).json({success:false, message:message})
    }
    
}

const messageLogger = (tense, person, number, aux, verbCase) => {
    let message = []
    if (!tense)
        message.push('No tense specified. Defaulting to PRASENS.')
    if (!person)
        message.push('No person specified. Defaulting to singular.')
    if (!number)
        message.push('No number specified. Defaulting to first person.')
    if (!aux)
        message.push('No auxiliary verb specified. Defaulting to a known one')
    if (!verbCase)
        message.push('No case specified. Defaulting to a non-reflexive verb')
    return message
}

module.exports = {
    conjugateFull,
    conjugatePerson
}