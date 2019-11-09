const mongoose = require('mongoose')

const File = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
)

// campo virtual, não existe na tabela, só existe no backend

File.virtual('url').get(function () {
  const url = process.env.URL || 'http://localhost:3333'

  return `${url}/files/${encodeURIComponent(this.path)}`
})

module.exports = mongoose.model('File', File)
