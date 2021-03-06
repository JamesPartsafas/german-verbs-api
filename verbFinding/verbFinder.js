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
    let S1 = getPerson(verb, tense, 1, 'S', aux, verbCase, isReflexive)
    let S2 = getPerson(verb, tense, 2, 'S', aux, verbCase, isReflexive)
    let S3 = getPerson(verb, tense, 3, 'S', aux, verbCase, isReflexive)
    let P1 = getPerson(verb, tense, 1, 'P', aux, verbCase, isReflexive)
    let P2 = getPerson(verb, tense, 2, 'P', aux, verbCase, isReflexive)
    let P3 = getPerson(verb, tense, 3, 'P', aux, verbCase, isReflexive)
    const arr = await Promise.all([S1,S2,S3,P1,P2,P3])
    output.S1 = arr[0]
    output.S2 = arr[1]
    output.S3 = arr[2]
    output.P1 = arr[3]
    output.P2 = arr[4]
    output.P3 = arr[5]
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

//Get all persons in array of tenses
const getArrayTenses = async (verb, tenseArray, aux, verbCase, isReflexive) => {
    
    if (!Array.isArray(tenseArray) || tenseArray.length == 0)
        throw new Error('The passed array of tenses is empty or not an array')

    tenseArray.map((tense) => {
        if (!tenseExists(tense))
            throw new Error(`${tense} is not a valid tense`)
    })

    let output = new Object()
    await Promise.all(tenseArray.map(async (tense) => {
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
    getAllTenses,
    getArrayTenses
}