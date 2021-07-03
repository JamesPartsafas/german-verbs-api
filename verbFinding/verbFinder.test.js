//Test functions in file verbFinder.js through Jest
const {
    verbNeedsAux,
    automaticAux,
    getPerson,
    getAllPersons,
    getAllTenses
} = require('./verbFinder')

describe('Test helper functions to find verb', () => {
    test('Verify automatic selection of auxiliary verb', () => {
        expect(automaticAux('haben')).toBe('HABEN')
        expect(automaticAux('gehen')).toBe('SEIN')
        expect(automaticAux('hüpfen')).toBe('SEIN')
        expect(automaticAux('huepfen')).toBe('SEIN')
    })

    test('Verify if verb tense needs an auxiliary', () => {
        expect(verbNeedsAux('PERFEKT')).toBe(true)
        expect(verbNeedsAux('PRASENS')).toBe(false)
    })

    test('Verify that a specific tense and person can be found', () => {
        expect(getPerson('lieben', 'FUTUR1', 2, 'S', 'HABEN', 'DATIVE')).toEqual(['wirst dir', 'lieben'])
        expect(getPerson('heißen', 'PLUSQUAMPERFEKT', 2, 'S')).toEqual(['hattest', 'geheißen'])
        expect(getPerson('lieben', 'not a tense', 2, 'P', 'not an aux', 'not a case')).toEqual(['liebt'])
        expect(getPerson('zurueckkehren', 'PLUSQUAMPERFEKT', 1, 'S')).toEqual(['war', 'zurückgekehrt'])
        expect(() => {
            getPerson('notaverb', 'PRASENS', 1, 'P')
        }).toThrow()
    })

    const expected={S1:["werde","gegangen sein"],S2:["werdest","gegangen sein"],S3:["werde","gegangen sein"],P1:["werden","gegangen sein"],P2:["werdet","gegangen sein"],P3:["werden","gegangen sein"]}
    test('Verify that all conjugations of a tense can be found', () => {
        expect(getAllPersons('gehen', 'KONJUNKTIV2_FUTUR2')).toEqual(expected)
    })

    const expectedFull = {PRASENS:{S1:["gehe"],S2:["gehst"],S3:["geht"],P1:["gehen"],P2:["geht"],P3:["gehen"]},PRATERITUM:{S1:["ging"],S2:["gingst"],S3:["ging"],P1:["gingen"],P2:["gingt"],P3:["gingen"]},FUTUR1:{S1:["werde","gehen"],S2:["wirst","gehen"],S3:["wird","gehen"],P1:["werden","gehen"],P2:["werdet","gehen"],P3:["werden","gehen"]},FUTUR2:{S1:["werde","gegangen sein"],S2:["wirst","gegangen sein"],S3:["wird","gegangen sein"],P1:["werden","gegangen sein"],P2:["werdet","gegangen sein"],P3:["werden","gegangen sein"]},PERFEKT:{S1:["bin","gegangen"],S2:["bist","gegangen"],S3:["ist","gegangen"],P1:["sind","gegangen"],P2:["seid","gegangen"],P3:["sind","gegangen"]},PLUSQUAMPERFEKT:{S1:["war","gegangen"],S2:["warst","gegangen"],S3:["war","gegangen"],P1:["waren","gegangen"],P2:["wart","gegangen"],P3:["waren","gegangen"]},KONJUNKTIV1_PRASENS:{S1:["gehe"],S2:["gehest"],S3:["gehe"],P1:["gehen"],P2:["gehet"],P3:["gehen"]},KONJUNKTIV1_FUTUR1:{S1:["werde","gehen"],S2:["werdest","gehen"],S3:["werde","gehen"],P1:["werden","gehen"],P2:["werdet","gehen"],P3:["werden","gehen"]},KONJUNKTIV1_PERFEKT:{S1:["sei","gegangen"],S2:["seist","gegangen"],S3:["sei","gegangen"],P1:["seien","gegangen"],P2:["seiet","gegangen"],P3:["seien","gegangen"]},KONJUNKTIV2_PRATERITUM:{S1:["ginge"],S2:["gingest"],S3:["ginge"],P1:["gingen"],P2:["ginget"],P3:["gingen"]},KONJUNKTIV2_FUTUR1:{S1:["würde","gehen"],S2:["würdest","gehen"],S3:["würde","gehen"],P1:["würden","gehen"],P2:["würdet","gehen"],P3:["würden","gehen"]},KONJUNKTIV2_FUTUR2:{S1:["werde","gegangen sein"],S2:["werdest","gegangen sein"],S3:["werde","gegangen sein"],P1:["werden","gegangen sein"],P2:["werdet","gegangen sein"],P3:["werden","gegangen sein"]}}
    test('Verify that full verb conjugation can be found', () => {
        expect(getAllTenses('gehen')).toEqual(expectedFull)
    })
})