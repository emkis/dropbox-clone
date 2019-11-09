const Folder = require('../models/Folder')

class FolderController {
  async store(req, res) {
    const folder = await Folder.create(req.body)

    return res.json(folder)
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
