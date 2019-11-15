const path = require('path')

const archiver = require('archiver')

const File = require('../models/File')

class DownloadController {
  async index(req, res) {
    const uploadsFolderPath = path.resolve(__dirname, '..', '..', 'uploads')
    const outputFile = 'AllFiles.zip'

    const files = await File.find()

    const zip = archiver('zip')

    res.attachment(outputFile)
    zip.pipe(res)

    files.forEach(file => {
      // constroi o path do arquivo
      const filePath = path.join(uploadsFolderPath, file.path)

      // adiciona o arquivo com esse path no zip, e coloca um nome
      zip.file(filePath, { name : file.title })
    });

      zip.finalize()
      return archiver
  }
}

module.exports = new DownloadController()
