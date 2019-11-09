const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const pathName = path.resolve(__dirname, '..', '..', 'uploads')

module.exports = {
  dest: pathName,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, pathName)
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        file.key = `${hash.toString('hex')}-${file.originalname}`

        cb(null, file.key)
      })
    }
  })
}
