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
      }, { new: true })

      // remove o arquivo antigo
      const oldFilePath = resolve(__dirname, '..', '..', 'uploads', path)
      fs.unlinkSync(oldFilePath);

      // se aluno que fez upload, passa esse parametro pra todo mundo
      if (req.query.student) {
        req.io.sockets.in(folder._id).emit('fileChanged', file, { student: true })
        return res.json(file)
      }

      // se nao foi o professor então só atualiza o de todo mundo
      req.io.sockets.in(folder._id).emit('fileChanged', file)
      return res.json(file)
    }

    const file = await File.create({
      title: req.file.originalname,
      path: req.file.key,
    })

    folder.files.push(file)
    await folder.save()

    if (req.query.student) {
      req.io.sockets.in(folder._id).emit('file', file, { student: true })

      return res.json(file)
    }

    req.io.sockets.in(folder._id).emit('file', file)

    return res.json(file)
  }
}

module.exports = new FileController()
