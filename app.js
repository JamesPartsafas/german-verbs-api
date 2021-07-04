/*Entry point of application. See verbFinding folder for internal workings of API,
controllers folder for HTTP function handling and logging procedures, and routes 
folder for details on methods called by any given request */
const express = require('express')
const app = express()
const verbsRouter = require('./routes/verbs')
const port = 5000

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Have an app.use for logging middleware here
app.use('/german-verbs-api', verbsRouter)

app.get('/test', (req, res) => {
    res.status(200).json({'hello': 'world'})
})

app.listen(port, () => {
    console.log('Server is listening on port', port)
})
.on('error', (err) => {
    console.log('There was an error starting the server.')
    console.log(err)
})

module.exports = app