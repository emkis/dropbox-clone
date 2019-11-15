const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')

const routes = express.Router()

const FolderController = require('./controllers/FolderController')
const FileController = require('./controllers/FileController')
const DownloadController = require('./controllers/DownloadController')

routes.post('/folder', FolderController.store)
routes.get('/folder/:id', FolderController.show)
routes.get('/folders', FolderController.index)
routes.get('/download', DownloadController.index)

routes.post('/folder/:id/files',
  multer(multerConfig).single('file'),
  FileController.store,
)

module.exports = routes
