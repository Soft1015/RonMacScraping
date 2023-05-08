const express = require('express')
const Joi = require('@hapi/joi')
const { insertItem, getItems, updateTimer, getTimer } = require('./db')
const { setFirstTimer, setSecondTimer } = require('./timer');
const router = express.Router()

router.post('/item', (req, res) => {
  const item = req.body
  console.log(req.body)
  insertItem(item)
    .then(() => {
      res.status(200).end()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/items', (req, res) => {
  getItems()
    .then((items) => {
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/timer', (req, res) => {
  getTimer()
    .then((items) => {
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.post('/saveTime', (req, res) => {
  console.log('saveTime');
  setFirstTimer(req.body.Time1);
  setSecondTimer(req.body.Time2);
  updateTimer(req.body._id, req.body.Time1, req.body.Time2)
    .then(() => {
      res.status(200).end()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

module.exports = router
