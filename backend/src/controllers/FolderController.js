const Folder = require('../models/Folder')

class FolderController {
  async store(req, res) {
    const folder = await Folder.create(req.body)
    req.io.sockets.emit('folder', folder)

    return res.json(folder)
  }

  async index(req, res) {
    const folders = await Folder.find()
    res.json(folders)
  }

  async show(req, res) {
    const folder = await Folder.findById(req.params.id).populate({
      path: 'files',
      options: {
        sort: {
          createdAt: -1,
        },
      },
    })

    return res.json(folder)
  }
}

module.exports = new FolderController()
