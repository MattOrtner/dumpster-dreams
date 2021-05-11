const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const { getCurrentInvoke } = require('@vendia/serverless-express')
const ejs = require('ejs').__express
const AWS = require('aws-sdk')
const app = express()
const router = express.Router()

AWS.config.update({ region: process.env.AWS_REGION })
const db = new AWS.DynamoDB.DocumentClient()

app.set('view engine', 'ejs')
app.engine('.ejs', ejs)

router.use(compression())

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.static(path.join(__dirname, 'views', 'client')))

function validate(type, obj) {
  return obj
}


console.log(process.env.INVENTORY_TABLE_NAME)

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))

router.get('/', (req, res) => {
  res.render('client/index')
})

router.get('/api/inventory', async (req, res) => {
  const inventory = await db.scan({
    TableName: process.env.INVENTORY_TABLE_NAME
  }).promise()
  res.json(inventory)
})

router.post('/admin/inventory', async (req, res) => {
  const validated = validate('product', req.body)
  const message = await db.put({
    TableName: process.env.INVENTORY_TABLE_NAME,
    Item: validated
  }).promise()
  console.log(message)
  res.json({ success: true })
})

router.put('/admin/inventory', async (req, res) => {
  const id = req.body.id
  console.log('id', id);
  const itemName = req.body.name
  console.log('itemName', itemName);

  const message = await db.put({
    TableName: process.env.INVENTORY_TABLE_NAME,
    Item: {
      'id': id,
      'name': req.body.name,
      'price': req.body.price
    }
  }).promise().catch(console.log)
  console.log(message, 'message');
  res.json({success: true})
})

router.get('/users', (req, res) => {
  res.json(users)
})
router.get('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  return res.json(user)
})

router.post('/users', (req, res) => {
  const user = {
    id: ++userIdCounter,
    name: req.body.name
  }
  users.push(user)
  res.status(201).json(user)
})

router.put('/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) return res.status(404).json({})

  user.name = req.body.name
  res.json(user)
})

router.delete('/users/:userId', (req, res) => {
  const userIndex = getUserIndex(req.params.userId)

  if (userIndex === -1) return res.status(404).json({})

  users.splice(userIndex, 1)
  res.json(users)
})

router.get('/cookie', (req, res) => {
  res.cookie('Foo', 'bar')
  res.cookie('Fizz', 'buzz')
  res.json({})
})

const getUser = (userId) => users.find(u => u.id === parseInt(userId))
const getUserIndex = (userId) => users.findIndex(u => u.id === parseInt(userId))

// Ephemeral in-memory data store
const users = [{
  id: 1,
  name: 'Joe'
}, {
  id: 2,
  name: 'Jane'
}]
let userIdCounter = users.length

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
