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
const getPerson = async (verb, tense, person, number, aux, verbCase, isReflexive) => {

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
const getAllPersons = async (verb, tense, aux, verbCase, isReflexive) => {
    let output = new Object()
    output.S1 = await getPerson(verb, tense, 1, 'S', aux, verbCase, isReflexive)
    output.S2 = await getPerson(verb, tense, 2, 'S', aux, verbCase, isReflexive)
    output.S3 = await getPerson(verb, tense, 3, 'S', aux, verbCase, isReflexive)
    output.P1 = await getPerson(verb, tense, 1, 'P', aux, verbCase, isReflexive)
    output.P2 = await getPerson(verb, tense, 2, 'P', aux, verbCase, isReflexive)
    output.P3 = await getPerson(verb, tense, 3, 'P', aux, verbCase, isReflexive)
    return output
}

//Get all persons in all tenses
const getAllTenses = async (verb, aux, verbCase, isReflexive) => {
    let output = new Object()
    await Promise.all(tenses.map(async (tense) => {
        output[tense] = await getAllPersons(verb, tense, aux, verbCase, isReflexive)
    }))
    return output
}

//Exports
module.exports = {
    tenseExists,
    verbNeedsAux,
    automaticAux,
    getPerson,
    getAllPersons,
    getAllTenses
}