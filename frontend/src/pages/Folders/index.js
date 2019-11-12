import React, { Component } from 'react'
import { MdFolder } from "react-icons/md"
import socket from 'socket.io-client'
import { Link } from 'react-router-dom';

import api from '../../services/api'

import './styles.css'

class Folders extends Component {

  state = {
    folders: [],
    newFolder: null
  }

  async componentDidMount() {
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
  }

  closeMessage = () => {
    this.setState({ newFolder: false })
  }

  render() {
    const { folders, newFolder } = this.state

    return (
      <div className="folder__container">

        <h1>all folders below ↓</h1>

        {newFolder && 
          <div className="overlay">
            <div className="message__container">
              <p className="message">there's a new folder here</p>
              <button onClick={ this.closeMessage }>ok</button>
            </div>
          </div>
        }
       
          <ul className="folders">
            {folders ? 
              (folders.map(folder => (
                  <li key={ folder.title }>
                    <MdFolder size={40} />
                    <Link className="file__info" to={`/folder/${folder._id}/files`}>
                      { folder.title }
                    </Link>
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