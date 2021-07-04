//This file contains helper functions to render verb finding easier

/*Imports
*
*/
const GermanVerbsLib = require('german-verbs')
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json')
const {
    anglophy,
    germanophyNoSZ,
    germanophyWithSZ
} = require('./textHandler')

/* Constants 
*
*/
//List of tenses that require an auxiliary verb
const needsAux = [
    'PERFEKT',
    'PLUSQUAMPERFEKT',
    'FUTUR2',
    'KONJUNKTIV1_PERFEKT',
    'KONJUNKTIV2_FUTUR2'
]

//List of all tenses
const tenses = [
    'PRASENS',
    'PRATERITUM',
    'FUTUR1',
    'FUTUR2',
    'PERFEKT',
    'PLUSQUAMPERFEKT',
    'KONJUNKTIV1_PRASENS',
    'KONJUNKTIV1_FUTUR1',
    'KONJUNKTIV1_PERFEKT',
    'KONJUNKTIV2_PRATERITUM',
    'KONJUNKTIV2_FUTUR1',
    'KONJUNKTIV2_FUTUR2'
]

/* Functions
*
*/
const verbNeedsAux = (tense) => {
    return needsAux.indexOf(tense) > -1
}

const tenseExists = (tense) => {
    return tenses.indexOf(tense) > -1
}

/*Automatically chooses an auxiliary verb (either "sein" or "haben").
Verbs that always take sein will have that chosen, otherwise haben is chosen*/
const automaticAux = (verb) => {
    const noSZ = germanophyNoSZ(verb)
    const withSZ = germanophyWithSZ(verb)
    if (GermanVerbsLib.alwaysUsesSein(noSZ) || GermanVerbsLib.alwaysUsesSein(withSZ))
        return 'SEIN'
    else
        return 'HABEN'
}

/* Get conjugation of verb at specific tense and person.
Unspecified tense will return present, aux is chosen automatically if not
specified, verbCase is ignored unless it is ACCUSATIVE or DATIVE */
const getPerson = (verb, tense, person, number, aux, verbCase) => {
    //Handle auxiliary verb issues
    if (aux !== 'SEIN' && aux !== 'HABEN') {
        if (verbNeedsAux(tense))
            aux = automaticAux(verb)
    }

    //Handle verbCase issues if the passed one is not formatted properly
    let isReflexive = true
    if (!(verbCase === 'ACCUSATIVE' || verbCase === 'DATIVE')) {
        verbCase = null
        isReflexive = false
    }

    //If there is an issue with the tense, default to present tense
    if (!(tenseExists(tense)))
        tense = 'PRASENS'

    //Handle issues with person and number
    if (!person || person < 1 || person > 3)
        person = 1
    if (number !=='P')
        number = 'S'

    //return conjugation, but must check if verb exists with both types of conversion to germanic characters
    verb = anglophy(verb)    
    try {
        return GermanVerbsLib.getConjugation(GermanVerbsDict, germanophyNoSZ(verb), tense, person, number, aux, isReflexive, verbCase)
    } catch (err1) {
        try {
            return GermanVerbsLib.getConjugation(GermanVerbsDict, germanophyWithSZ(verb), tense, person, number, aux, isReflexive, verbCase)
        }
        catch (err2) {
            throw err2
        }
    }

}

//Creates object containg all conjugations for a given tense
const getAllPersons = (verb, tense, aux, verbCase) => {
    let output = new Object()
    output.S1 = getPerson(verb, tense, 1, 'S', aux, verbCase)
    output.S2 = getPerson(verb, tense, 2, 'S', aux, verbCase)
    output.S3 = getPerson(verb, tense, 3, 'S', aux, verbCase)
    output.P1 = getPerson(verb, tense, 1, 'P', aux, verbCase)
    output.P2 = getPerson(verb, tense, 2, 'P', aux, verbCase)
    output.P3 = getPerson(verb, tense, 3, 'P', aux, verbCase)
    return output
}

//Get all persons in all tenses
const getAllTenses = (verb, aux, verbCase) => {
    let output = new Object()
    tenses.map((tense) => {
        output[tense] = getAllPersons(verb, tense, aux, verbCase)
    })
    return output
}

//Exports
module.exports = {
    verbNeedsAux,
    automaticAux,
    getPerson,
    getAllPersons,
    getAllTenses
}