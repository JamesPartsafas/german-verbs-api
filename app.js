//Entry point of application
const express = require('express')
const app = express()
const GermanVerbsLib = require('german-verbs')
const GermanVerbsDict = require('german-verbs-dict/dist/verbs.json')
const port = 5000

app.get('/', (req, res) => {
    res.status(200).send(GermanVerbsLib.getConjugation(GermanVerbsDict, 'haben', 'FUTUR2', 3, 'P', 'HABEN'))
})


app.listen(port, (err) => {
    if (err)
        console.log("Something went wrong. Details are shown below: ", error)
    else
        console.log('Server is listening on port', port)
})