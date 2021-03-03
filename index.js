/**
 * External imports
 */
const dotenv   = require('dotenv').config({path: `${__dirname}/.env`})
const readList = require('read-safari-reading-list')
const request  = require('request-promise-native')
const delay    = require('iterate-with-delay')

/**
 * Set up the database
 */
const low      = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter  = new FileSync(`${__dirname}/db.json`)
const db       = low(adapter)

// Set up the database
db.defaults({articles: []}).write()

// Get the article "table"
const articles = db.get('articles')

// Grab the Safari reading list
readList()
  .then(function (readingList) {
    // Loop through the items in the database
    readingList.forEach(function ({title, url, dateAdded}) {
      // Skip if this URL exists in the database
      if (articles.find({url: url}).value()) {
        return
      }

      // Add to the database
      articles.push({
        title: title,
        url: url,
        dateAdded: dateAdded,
        sent: false,
      }).write()
    })

    // Get articles marked unsent
    return articles.filter({sent: false})
  })
  .then(function (articlesToSend) {
    const items = articlesToSend.value()

    // Quit early if there are no new articles
    if (items.length < 1) {
      console.log(`No articles to send`)

      process.exit()
    }

    // Get the party started
    console.log(`Preparing to send ${items.length} articles`)

    // Send the unsent articles
    delay.each(items, {time: 2000}, function (item) {
      request
        .get({
          url: 'https://sendtoreader.com/api/send/',
          qs: {
            rejectUnauthorized: false,
            url: item.url,
            username: process.env.SENDTOREADER_USERNAME,
            password: process.env.SENDTOREADER_PASSWORD,
          },
        })
        .then(function (response) {
          // Handle error conditions
          if (response != 200) {
            console.log(response)
            console.log(`Could not send: ${item.url}`)

            process.exit(1)
          }

          // Mark the article as sent
          articlesToSend
            .find({url: item.url})
            .assign({sent: true})
            .write()

          // Make a log note
          console.log(`Successfully sent >>> ${item.url}`)
        })
        .catch(function (error) {
          console.log(error.statusCode)

          if (error.statusCode === 405) {
            console.log(`SendToReader could not process this article so we marked it as sent to prevent future attempts >>> ${item.url}`)

            // Mark the article as sent
            articlesToSend
              .find({url: item.url})
              .assign({sent: true})
              .write()
          }

          if (error.statusCode === 401) {
            console.log('Your SendToReader account is currently rate-limited')
          }

          process.exit(1)
        })

      return
    })
  })
  .catch(function (error) {
    console.log(error)

    process.exit()
  })
