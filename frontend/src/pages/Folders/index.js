import React, { Component } from 'react'
import { MdFolder, MdArrowDownward } from "react-icons/md"
import socket from 'socket.io-client'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

class Folders extends Component {

  state = {
    folders: [ ],
    studentChanged: null,
    changeInfo: { },
    imTeacher: null,
  }

  async componentDidMount() {
    const isTeacher = new URLSearchParams(this.props.location.search).get('teacher')
    
    if (isTeacher) {
      this.setState({ imTeacher: true })
    }

    this.subscribeToNewFolders()

    const response = await api.get(`/folders`)
    const data = await response.data
    
    this.setState({ folders: data })
  }

  subscribeToNewFolders = () => {
    const io = socket('http://localhost:3333')

    io.on('folder', data => {
      this.setState({ 
        folders: [ data, ...this.state.folders ]
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

  closeMessage = () => {
    this.setState({ studentChanged: false })
  }

  handleDownload = async () => {
    const response = await api.get('/download', {
      responseType: 'blob',
      timeout: 30000,
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'AllFiles.zip')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  handleStyleTeacher = () => {
    document.getElementById('root').style = 'color: #5a71ff'
  }

  render() {
    const { folders, studentChanged, changeInfo, imTeacher } = this.state

    if (imTeacher) {
      this.handleStyleTeacher()
    }

    return (
      <div className="folder__container">

        <header>
          <h1>all folders below</h1>
          <button className="download" onClick={this.handleDownload}>
            <MdArrowDownward size={45} />
          </button>
        </header>

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
       
          <ul className="folders">
            {folders ? 
              (folders.map(folder => (
                  <li key={ folder.title }>
                    <MdFolder size={40} />
                    
                    { imTeacher ? (
                        <Link className="file__info" to={{ 
                        pathname:`/folder/${folder._id}/files`,
                        search: '?teacher=true' 
                        }}>
                          { folder.title }
                        </Link>) 
                      : 
                        (
                        <Link className="file__info"
                        to={`/folder/${folder._id}/files`}>
                          { folder.title }
                        </Link>)
                    }
                    
                  </li>
              )))
              : (<h2>there's no folders here</h2>) 
            }
          </ul>
        </div>
    )
  }
}

export default Folders