const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'db_scrape'

let db

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    db = client.db(dbName)
    console.log('MongoDB is connected suceesfully!')
  })

const insertItem = (item) => {
  const collection = db.collection('time')
  return collection.insertOne(item)
}

const insertMultiItems = (item) => {
  const collection = db.collection('items')
  return collection.insertMany(item)
}

const getItems = () => {
  const collection = db.collection('items')
  return collection.find({}).toArray();
}

const updateTimer = (id, timer1, timer2) => {
  const collection = db.collection('timer')
  return collection.updateOne({ _id: ObjectId(id) }, { $set: { "timer1":timer1, "timer2":timer2 } })
}
const insertTimer = () => {
  const collection = db.collection('timer')
  return collection.insertOne({timer1:'00:00', timer2:'12:00'});
}

const getTimer = async () => {
  const collection = db.collection('timer')
  return collection.findOne({});
}

module.exports = { init, insertItem, getItems, insertMultiItems, updateTimer, getTimer, insertTimer }
