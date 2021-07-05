//Test API calls through Jest
const httpMocks = require('node-mocks-http')

describe("Test full verb finding", () => {
    const expectedDataFull = {PRASENS:{S1:["gehe"],S2:["gehst"],S3:["geht"],P1:["gehen"],P2:["geht"],P3:["gehen"]},PRATERITUM:{S1:["ging"],S2:["gingst"],S3:["ging"],P1:["gingen"],P2:["gingt"],P3:["gingen"]},FUTUR1:{S1:["werde","gehen"],S2:["wirst","gehen"],S3:["wird","gehen"],P1:["werden","gehen"],P2:["werdet","gehen"],P3:["werden","gehen"]},FUTUR2:{S1:["werde","gegangen sein"],S2:["wirst","gegangen sein"],S3:["wird","gegangen sein"],P1:["werden","gegangen sein"],P2:["werdet","gegangen sein"],P3:["werden","gegangen sein"]},PERFEKT:{S1:["bin","gegangen"],S2:["bist","gegangen"],S3:["ist","gegangen"],P1:["sind","gegangen"],P2:["seid","gegangen"],P3:["sind","gegangen"]},PLUSQUAMPERFEKT:{S1:["war","gegangen"],S2:["warst","gegangen"],S3:["war","gegangen"],P1:["waren","gegangen"],P2:["wart","gegangen"],P3:["waren","gegangen"]},KONJUNKTIV1_PRASENS:{S1:["gehe"],S2:["gehest"],S3:["gehe"],P1:["gehen"],P2:["gehet"],P3:["gehen"]},KONJUNKTIV1_FUTUR1:{S1:["werde","gehen"],S2:["werdest","gehen"],S3:["werde","gehen"],P1:["werden","gehen"],P2:["werdet","gehen"],P3:["werden","gehen"]},KONJUNKTIV1_PERFEKT:{S1:["sei","gegangen"],S2:["seist","gegangen"],S3:["sei","gegangen"],P1:["seien","gegangen"],P2:["seiet","gegangen"],P3:["seien","gegangen"]},KONJUNKTIV2_PRATERITUM:{S1:["ginge"],S2:["gingest"],S3:["ginge"],P1:["gingen"],P2:["ginget"],P3:["gingen"]},KONJUNKTIV2_FUTUR1:{S1:["würde","gehen"],S2:["würdest","gehen"],S3:["würde","gehen"],P1:["würden","gehen"],P2:["würdet","gehen"],P3:["würden","gehen"]},KONJUNKTIV2_FUTUR2:{S1:["werde","gegangen sein"],S2:["werdest","gegangen sein"],S3:["werde","gegangen sein"],P1:["werden","gegangen sein"],P2:["werdet","gegangen sein"],P3:["werden","gegangen sein"]}}
    test('Verify that full verb conjugation can be found', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen'
            })

            const response = httpMocks.createResponse()
            routeHandler(request, response)

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataFull)
        }
    })
    test('Test error when verb is not passed', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?'
            })

            const response = httpMocks.createResponse()

            const {success, message} = JSON.parse(response._getData())
            expect(success).toBe(false)
            expect(message).toEqual("Verb must be passed as a query parameter when using GET methods")
        }
    })
})

describe("Test finding of full tense", () => {
    const expectedDataPresent = {"S1":["kann"],"S2":["kannst"],"S3":["kann"],"P1":["können"],"P2":["könnt"],"P3":["können"]}
    const expectedDataBase = {"data":{"S1":["habe","gekonnt"],"S2":["hast","gekonnt"],"S3":["hat","gekonnt"],"P1":["haben","gekonnt"],"P2":["habt","gekonnt"],"P3":["haben","gekonnt"]}}
    const expectedDataDative = {"S1":["habe mir","gekonnt"],"S2":["hast dir","gekonnt"],"S3":["hat sich","gekonnt"],"P1":["haben uns","gekonnt"],"P2":["habt euch","gekonnt"],"P3":["haben sich","gekonnt"]}
    const expectedDataDativeSein = {"S1":["bin mir","gekonnt"],"S2":["bist dir","gekonnt"],"S3":["ist sich","gekonnt"],"P1":["sind uns","gekonnt"],"P2":["seid euch","gekonnt"],"P3":["sind sich","gekonnt"]}

    test('Verify basic search', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen&tense=PERFEKT'
            })

            const response = httpMocks.createResponse()

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataBase)
        }
    })

    test('Verify search with dative case', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen&tense=PERFEKT&verbCase=DATIVE'
            })

            const response = httpMocks.createResponse()

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataDative)
        }
    })
    test('Verify search with dative case and sein aux', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen&tense=PERFEKT&verbCase=DATIVE&aux=SEIN'
            })

            const response = httpMocks.createResponse()

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataDativeSein)
        }
    })
    test('Verify search with mispelled dative case and mispelled sein aux', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen&tense=PERFEKT&verbCase=DAIVE&aux=SEI'
            })

            const response = httpMocks.createResponse()

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataBase)
        }
    })
    test('Verify search with all parameters other than verb mispelled', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/german-verbs-api?verb=gehen&tense=PEREKT&verbCase=DAIVE&aux=SEI'
            })

            const response = httpMocks.createResponse()

            const {success, data} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(expectedDataPresent)
        }
    })
})

describe("Test finding of specific person", () => {
    const validBody = {
        "verb": "heissen",
        "tense": "PERFEKT",
        "number": "S",
        "person": 2,
        "aux": "SEIN",
        "verbCase": "DATIVE"
    }
    const validData = ["bist dir", "geheißen"]
    const validMessage = []

    const missingDataBody = {
        "verb": "heissen",
        "tense": "PERFEKT",
        "aux": "SEIN",
        "verbCase": "DATIVE"
    }
    const missingData = ["bin mir", "geheißen"]
    const missingDataMessage = ["No person specified. Defaulting to singular.","No number specified. Defaulting to first person."]

    test('Verify search with all parameters valid', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/german-verbs-api',
                body: validBody
            })

            const response = httpMocks.createResponse()

            const {success, data, message} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(validData)
            expect(message).toEqual(validMessage)
        }
    })

    test('Verify search with missing person and number', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/german-verbs-api',
                body: missingDataBody
            })

            const response = httpMocks.createResponse()

            const {success, data, message} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(missingData)
            expect(message).toEqual(missingDataMessage)
        }
    })
})

describe('Test the user passing an array of tenses', () => {

    const validDataBody = {
        "verb": "heissen",
        "tense": ["PRASENS", "PERFEKT"],
        "aux": "SEIN",
        "verbCase": "DATIVE"
    }
    const validDataResponse = {"PRASENS":{"S1":["gehe"],"S2":["gehst"],"S3":["geht"],"P1":["gehen"],"P2":["geht"],"P3":["gehen"]},"PRATERITUM":{"S1":["ging"],"S2":["gingst"],"S3":["ging"],"P1":["gingen"],"P2":["gingt"],"P3": ["gingen"]}}
    test('Verify search with valid array', async () => {
        () => {
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/german-verbs-api',
                body: validDataBody
            })

            const response = httpMocks.createResponse()

            const {success, data, message} = JSON.parse(response._getData())
            expect(success).toBe(true)
            expect(data).toEqual(validDataResponse)
            expect(message).toEqual([])
        }
    })
})