//Entry point of application
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.status(200).send("hey")
})


app.listen(port, (err) => {
    if (err)
        console.log("Something went wrong. Details are shown below: ", error)
    else
        console.log('Server is listening on port', port)
})