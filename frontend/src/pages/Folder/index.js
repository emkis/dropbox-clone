import React, { Component } from 'react'
import { MdInsertDriveFile } from "react-icons/md"
import { formatDistance, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import api from '../../services/api'

import './styles.css'

class Folder extends Component {

  state = {
    folder: {},
    newFiles: null
  }

  async componentDidMount() {
    this.subscribeToNewFiles()

    const folderId = this.props.match.params.id
    const response = await api.get(`/folder/${folderId}`)

    this.setState({ folder: response.data })
  }

  subscribeToNewFiles = () => {
    const folderId = this.props.match.params.id
    const io = socket('http://localhost:3333')

    io.emit('connectionRoom', folderId)

    io.on('file', data => {
      this.setState({ 
        folder: { ...this.state.folder, 
        files: [ data, ...this.state.folder.files ] },
        newFiles: true })
    })

    io.on('fileChanged', data => {
      const modifiedFile = this.state.folder.files.map(file => {
        if(file.id === data.id) {
          file.url = data.url
          return file
        }
        return file
      })

      this.setState({ 
        folder: { ...this.state.folder, 
        files: [ ...modifiedFile ] } 
      })
    })
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData()
      const folderId = this.props.match.params.id

      data.append('file', file)
      api.post(`/folder/${folderId}/files`, data)
    });
  }

  closeMessage = () => {
    this.setState({ newFiles: false })
  }

  render() {
    const { title, files } = this.state.folder
    const { newFiles } = this.state

    return (
      <div className="folder__container">
        <h1>{ title }</h1>
        
        {newFiles && 
          <div className="overlay">
            <div className="message__container">
              <p className="message">there's something new in this folder</p>
              <button onClick={ this.closeMessage }>ok</button>
            </div>
          </div>
        }

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="box__upload" {...getRootProps()}>
              <input { ...getInputProps() } />
              <strong>drag a file or click here</strong>
            </div>
          )}
        </Dropzone>

        <ul>
          { files ? 
              files.map(file => 
              (
                <li key={file._id}>
                  <a className="file__info" href={file.url} target="_blank"
                    rel="noopener noreferrer">
                    <MdInsertDriveFile size={40} />
                    <strong>{ file.title }</strong>
                  </a>

                  <span>
                    { formatDistance(parseISO(file.createdAt), new Date(), {
                        locale: pt, 
                        addSuffix: true
                    })}
                  </span>
                </li>
              )) 
              : ( <h2>this folder is empty</h2> ) 
          }
        </ul>
      </div>
    )
  }
}

export default Folder