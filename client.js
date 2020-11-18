const {Client} = require("whatsapp-web.js")
const fs = require('fs')

const SESSION_FILE_PATH = './whatsapp-session.json'
let sessionCfg
if(fs.existsSync(SESSION_FILE_PATH)){
    sessionCfg = require(SESSION_FILE_PATH)
}
const client = new Client({puppeteer:{headless: true}, session: sessionCfg} )
module.exports = client