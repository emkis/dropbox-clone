const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.on('connectionRoom', (folder) => {
    socket.join(folder)
  })
})

mongoose.connect(
  'mongodb+srv://dropbox:dropbox@cluster0-hoetb.mongodb.net/dropbox?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
)

mongoose.set('debug', true);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.io = io

  return next()
})

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(require('./routes'))

server.listen(process.env.PORT || 3333)
