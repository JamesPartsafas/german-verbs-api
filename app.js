/*Entry point of application. See verbFinding folder for internal workings of API,
controllers folder for HTTP function handling and logging procedures, and routes 
folder for details on methods called by any given request */
const express = require('express')
const app = express()
const apicache = require('apicache')
const verbsRouter = require('./routes/verbs')
const logRequest = require('./controllers/logger')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT

//Middleware
const onlyStatus200 = (req, res) => res.statusCode === 200

app.use(
    cors({
        origin: "*"
    }),
    express.urlencoded({extended: false}),
    express.json({
        type: "*/*"
    }),
    apicache.middleware('10 minutes', onlyStatus200)
)

app.use('/german-verbs-api', logRequest)
app.use('/german-verbs-api', verbsRouter)

//Create server
app.listen(port, () => {
    console.log('Server is listening on port', port)
})
.on('error', (err) => {
    console.log('There was an error starting the server.')
    console.log(err)
})

module.exports = app