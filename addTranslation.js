const viTrans = require('./locales/vi-VN.json')
const enTrans = require('./locales/en-NZ.json')

Object.keys(viTrans).forEach((key) => {
  if (enTrans[key] === undefined) {
    let trans = key.charAt(0).toUpperCase() + key.slice(1)
    trans = trans.replace('-', ' ')
    enTrans[key] = trans
  }
})

const fs = require('fs')
fs.writeFile('./locales/en-NZ.json', JSON.stringify(enTrans), (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Translation added')
  }
})
