import React, { Component, createRef } from "react"
import { formatDistance, parseISO } from "date-fns"
import Dropzone from "react-dropzone"
import socket from "socket.io-client"

import { MdInsertDriveFile } from "react-icons/md"
import { FiTrash2, FiAlertCircle } from "react-icons/fi"
import { FaCircleNotch } from "react-icons/fa"

import api from "../../services/api"

class Folder extends Component {
  state = {
    folder: {},
    loading: true,
    deleteClickCounter: 0,
    deletingFolder: false
  }

  buttonRef = createRef()

  async componentDidMount() {
    this.subscribeToNewFiles()

    const folderId = this.props.match.params.id
    
    try {
      const response = await api.get(`folder/${folderId}`)

      if(!response.data) throw Error()
      
      this.setState({
        folder: response.data,
        loading: false
      })
    } catch (error) {
      this.props.history.push('/')
    }
  }

  componentDidUpdate() {
    if (this.state.deleteClickCounter > 0) {
      document.addEventListener("mousedown", this.handleClickOutside)
    }
  }

  handleClickOutside = event => {
    if (this.buttonRef.current.contains(event.target)) return

    this.setState({ deleteClickCounter: 0 })
    document.removeEventListener("mousedown", this.handleClickOutside)
  }

  subscribeToNewFiles = () => {
    const folderId = this.props.match.params.id
    const io = socket(process.env.REACT_APP_API_URL)

    io.emit("connectionRoom", folderId)

    io.on("@file/CREATED", data => {
      this.setState({
        folder: {
          ...this.state.folder,
          files: [data, ...this.state.folder.files]
        }
      })
    })

    io.on("@file/CHANGED", data => {
      const modifiedFile = this.state.folder.files.map(file => {
        if (file.id === data.id) {
          file.url = data.url
          file.updatedAt = data.updatedAt
          return file
        }
        return file
      })

      this.setState({
        folder: { ...this.state.folder, files: [...modifiedFile] }
      })
    })
  }

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData()
      const folderId = this.props.match.params.id

      data.append("file", file)
      api.post(`folder/${folderId}/files`, data)
    })
  }

  handleDeleteFolder = async () => {
    this.setState({ 
      deleteClickCounter: this.state.deleteClickCounter += 1
    })

    if (this.state.deleteClickCounter > 1) {
      document.removeEventListener("mousedown", this.handleClickOutside)
      this.setState({ deletingFolder: true, deleteClickCounter: 0 })

      try {
        const folderId = this.props.match.params.id
        
        await api.delete(`folder/${folderId}`)
        this.props.history.push("/")
      } catch (error) {
        this.setState({ deletingFolder: false })
      }
    }
  }

  render() {
    const { title, files } = this.state.folder
    const { loading, deletingFolder, deleteClickCounter } = this.state

    if (loading) {
      return (
        <div className="loading">
          <FaCircleNotch />
        </div>
      )
    }

    return (
      <div className="folder__container">
        <header>
          <h1 title="folder title">{title}</h1>
          <div>
            <button
              type="button"
              className="btn btn-icon"
              title="delete this folder"
              onClick={this.handleDeleteFolder}
              ref={this.buttonRef}
              disabled={deletingFolder}
            >
              { deleteClickCounter === 0 && !deletingFolder && <FiTrash2 size={35} /> }
              { deleteClickCounter === 1 && !deletingFolder && <FiAlertCircle size={35} /> }
              { deletingFolder && <FaCircleNotch className="rotate" size={35} /> }
            </button>
          </div>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="box__upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <strong>drag a file or click here</strong>
            </div>
          )}
        </Dropzone>

        <ul>
          {files ? (
            files.map(file => (
              <li key={file._id}>
                <a
                  className="file__info"
                  href={file.url}
                  title="open file"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdInsertDriveFile size={40} />
                  <strong>{file.title}</strong>
                </a>

                <span className="updated-at">
                  {formatDistance(parseISO(file.updatedAt), new Date(), {
                    addSuffix: true,
                    includeSeconds: true
                  })}
                </span>
              </li>
            ))
          ) : (
            <h1>this folder is empty</h1>
          )}
        </ul>
      </div>
    )
  }
}

export default Folder
