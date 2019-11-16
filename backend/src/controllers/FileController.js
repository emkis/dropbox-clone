const fs = require('fs')
const resolve = require('path').resolve

const Folder = require('../models/Folder')
const File = require('../models/File')

class FileController {
  async store(req, res) {

    const folder = await Folder.findById(req.params.id)

    // pega a informação de todos os arquivos que tem nessa pasta
    const { files } = await Folder.findById(req.params.id)
    .select('files').populate('files', 'title path')

    // ve se esse arquivo ja existe nessa pasta
    const [fileExists] = files.filter(file => {
      return file.title === req.file.originalname
    })

    // se o arquivo já existe, atualiza as informações
    if (fileExists) {
      const { _id, path } = fileExists

      const file = await File.findOneAndUpdate({ _id }, {
        path: req.file.key,
      })

      // remove o arquivo antigo
      const oldFilePath = resolve(__dirname, '..', '..', 'uploads', path)
      fs.unlinkSync(oldFilePath);

      req.io.sockets.in(folder._id).emit('fileChanged', file)
      return res.json(file)
    }

    const file = await File.create({
      title: req.file.originalname,
      path: req.file.key,
    })

    folder.files.push(file)
    await folder.save()

    req.io.sockets.in(folder._id).emit('file', file)

    return res.json(file)
  }
}

module.exports = new FileController()
