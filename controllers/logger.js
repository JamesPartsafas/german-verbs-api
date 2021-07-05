//This file contains middleware to handle logging of API usage asynchronously

const { writeFile } = require('fs')

//Handles writing to log file after HTTP response is sent
const logRequest = async (req, res, next) => {
    next()

    const writeContent = await getContent(req, res)
    
    writeFile('./log.txt', writeContent, { flag: 'a+' }, err => {
        if (err) {
            console.log(err)
            return
        }
    })
}

//Creates content to be logged
const getContent = async (req, res) => {
    const date = new Date().toLocaleString()
    const method = req.method

    let requested
    if (method == 'POST')
        requested = JSON.stringify(req.body)
    else 
        requested = JSON.stringify(req.body)

    const log = `${date} - ${method} ${req.url} requested: ${requested}\n`
    return log
}

module.exports = logRequest