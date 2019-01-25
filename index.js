/**
 * External imports
 */
const dotenv   = require('dotenv').config({path:`${__dirname}/.env`})
const readList = require('read-safari-reading-list')
const request  = require('request-promise-native')
const lodash   = require('lodash')
const moment   = require('moment')

readList()
  .then(function (json) {
    /**
     * Sometimes, Safari doesn't have a usable description field. In these
     * cases, it still adds the item to the reading list, and then attempts
     * to fetch the description in a follow-up request, which can cause your
     * file watcher to trigger this script twice. This is a hacky way to
     * mitigate that issue.
     */
    if (typeof json[0].description === 'undefined') {
      throw {
        message: 'Item does not have description set',
        data: json[0],
      }
    }

    /**
     * Your file watcher will be triggered again when an item is removed
     * from your Safari Reading List. This is an attempt to mitigate that
     * by checking if the item was recently added. If not, an error is
     * thrown and the script exits early.
     */
    const dateAdded = moment(json[0].dateAdded)
    const timeAgo   = moment().utc().subtract(20, 'seconds')

    if (dateAdded.isBefore(timeAgo)) {
      throw {
        message: 'Item not added recently enough',
        data: json[0],
      }
    }

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
  .catch(function (error) {
    console.log(error)

    process.exit()
  })
