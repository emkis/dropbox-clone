import React, { Component } from 'react'
import { MdInsertDriveFile } from "react-icons/md"
import { FaCircleNotch } from 'react-icons/fa'
import { formatDistance, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import api from '../../services/api'

import './styles.css'

class Folder extends Component {

  state = {
    folder: { },
    studentChanged: null,
    changeInfo: { },
    imTeacher: null,
    loading: true,
  }

  async componentDidMount() {
    const isTeacher = new URLSearchParams(this.props.location.search).get('teacher')
    
    if (isTeacher) {
      this.setState({ imTeacher: true })
    }

    this.subscribeToNewFiles()

    const folderId = this.props.match.params.id
    const response = await api.get(`/folder/${folderId}`)

    this.setState({ 
      folder: response.data,
      loading: false
    })
  }

  subscribeToNewFiles = () => {
    const folderId = this.props.match.params.id
    const io = socket('http://localhost:3333')

    io.emit('connectionRoom', folderId)

    io.on('file', (data, student) => {
      
      // um aluno alterou algo »» mostra o aviso pro professor
      if (student && this.state.imTeacher) {
        this.setState({ 
          folder: { ...this.state.folder, 
          files: [ data, ...this.state.folder.files ] },
          studentChanged: true
        })
        return
      }

      // eu que fiz alteração nao avisa pra mim
      this.setState({ 
        folder: { ...this.state.folder, 
        files: [ data, ...this.state.folder.files ] }
      })
    })

    io.on('fileChanged', (data, student) => {
      const modifiedFile = this.state.folder.files.map(file => {
        if(file.id === data.id) {
          file.url = data.url
          return file
        }
        return file
      })

      if (student && this.state.imTeacher) {
        this.setState({ 
          folder: { ...this.state.folder, 
          files: [ ...modifiedFile ] },
          studentChanged: true 
        })
        return
      }

      this.setState({ 
        folder: { ...this.state.folder, 
        files: [ ...modifiedFile ] } 
      })
    })

    io.on('iSaidToNotChange', data => {
      if (this.state.imTeacher) {

        this.setState({ 
          studentChanged: true,
          changeInfo: { 
            fileName: data.fileName, 
            folderName: data.folderName,
          }
        })
      }
    })

  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData()
      const folderId = this.props.match.params.id
      
      data.append('file', file)

      // aluno fez o upload, passa esse parametro pro server
      if (!this.state.imTeacher) {
        api.post(`/folder/${folderId}/files?student=true`, data)
        return
      }

      api.post(`/folder/${folderId}/files`, data)
    });
  }

  closeMessage = () => {
    this.setState({ studentChanged: false })
  }

  render() {
    const { title, files } = this.state.folder
    const { studentChanged, changeInfo, loading } = this.state

    if (loading) {
      return (
        <div className="loading">
          <FaCircleNotch />
        </div>
      )
    }

    return (
      <div className="folder__container">
        <h1>{ title }</h1>
        
        { studentChanged && 
          <div className="overlay">
            <div className="message__container">
            <p className="title">some student change a file!</p>
              
              <p className="message">
                folder name » { changeInfo.folderName }
                <br/>
                file name » { changeInfo.fileName }
              </p>
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
                    { formatDistance(parseISO(file.updatedAt), new Date(), {
                        locale: pt, 
                        addSuffix: true
                    })}
                  </span>
                </li>
              )) 
              : ( <h1>this folder is empty</h1> ) 
          }
        </ul>
      </div>
    )
  }
}

export default Folder