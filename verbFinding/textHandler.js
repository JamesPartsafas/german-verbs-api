/*This file handles special characters in the german alphabet, converting them to
the standard accepted equivalent form. In particular, ö, ä, ü, and ß become
oe, ae, ue, and ss respectively, or vice-versa*/

//Removes special characters
const anglophy = (word) => {
    word = word
        .replace(/ö/g, 'oe')
        .replace(/ä/g, 'ae')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
    return word
}

//Returns word to a german format, leaving ss as is
const germanophyNoSZ = (word) => {
    word = word
        .replace(/oe/g, 'ö')
        .replace(/ae/g, 'ä')
        .replace(/ue/g, 'ü')
    return word
}

//Returns word to a german format, turning ss to ß
const germanophyWithSZ = (word) => {
    word = word
        .replace(/oe/g, 'ö')
        .replace(/ae/g, 'ä')
        .replace(/ue/g, 'ü')
        .replace(/ss/g, 'ß')
    return word
}

module.exports = {
    anglophy,
    germanophyNoSZ,
    germanophyWithSZ
}