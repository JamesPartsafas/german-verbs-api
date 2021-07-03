//Test functions in file textHandler.js through Jest
const {
    anglophy,
    germanophyNoSZ,
    germanophyWithSZ
} = require('./textHandler')

const inGermanWithSZ = "wünschen wünschen weiß weiß möchte möchte mädchen mädchen"
const inGermanWithSS = "wünschen wünschen weiss weiss möchte möchte mädchen mädchen"
const noSpecialChars = "wuenschen wuenschen weiss weiss moechte moechte maedchen maedchen"

describe('Handle special characters in text strings', () => {
    test('Properly remove special characters from strings', () => {
        expect(anglophy(inGermanWithSZ)).toBe(noSpecialChars)
        expect(anglophy(inGermanWithSS)).toBe(noSpecialChars)
        expect(anglophy(noSpecialChars)).toBe(noSpecialChars)
    })

    test('Reintroduce ü, ö, ä characters, but not ß', () => {
        expect(germanophyNoSZ(noSpecialChars)).toBe(inGermanWithSS)
        expect(germanophyNoSZ(inGermanWithSZ)).toBe(inGermanWithSZ)
        expect(germanophyNoSZ(inGermanWithSS)).toBe(inGermanWithSS)
    })

    test('Reintroduce ü, ö, ä, and ß characters', () => {
        expect(germanophyWithSZ(noSpecialChars)).toBe(inGermanWithSZ)
        expect(germanophyWithSZ(inGermanWithSS)).toBe(inGermanWithSZ)
        expect(germanophyWithSZ(inGermanWithSZ)).toBe(inGermanWithSZ)
    })
})