const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
  res.render('home/index')
})

routes.get('/socket', (req, res) => {
  res.render('socket/index')
})

module.exports = routes;