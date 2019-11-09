
const Folder = require('../models/Folder')
const File = require('../models/File')

class FileController {
  async store(req, res) {
    const folder = await Folder.findById(req.params.id)

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
