/**
 * External imports
 */
const dotenv   = require('dotenv').config({path: '.env'})
const readList = require('read-safari-reading-list')
const request  = require('request-promise-native')

readList()
  .then(function (json) {
    // @todo Check that the first item is not a duplicate
    return json[0]
  })
  .then(function ({url}) {
    return request
      .get({
        url: 'https://sendtoreader.com/api/send/',
        qs: {
          url: url,
          username: process.env.SENDTOREADER_USERNAME,
          password: process.env.SENDTOREADER_PASSWORD,
        },
      })
      .then(function (response) {
        return JSON.parse(response)
      })
  })
  .then(function (response) {
    console.log(response)

    process.exit()
  })
