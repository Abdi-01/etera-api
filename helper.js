const client = require('./client')
const util = require('util')

module.exports={
    asynqQuery = util.promisify(client.query).bind(client)
}