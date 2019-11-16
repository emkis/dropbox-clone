import React, { Component } from 'react'

import api from '../../services/api'

import './styles.css'

class Main extends Component {

  state = {
    newFolder: '',
    iWantNewFolder: null,
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    
    await api.post('/folder', {
      title: this.state.newFolder,
    })
    
    this.goToFolders()
  }

  handleInputChange = (e) => {
    this.setState({ newFolder: e.target.value })
  }

  handleWantNewFolder = () => {
    this.setState({ iWantNewFolder: true })
  }

  goToFolders = () => { this.props.history.push(`/folders`) }

  render() {

    const { iWantNewFolder } = this.state 

    return (
      <div className="main__container">

        { !iWantNewFolder && 
          <div className="main__box">
            <h1>hi teacher, do you need a new folder?</h1>
            <button type='button' className="no" onClick={ this.goToFolders }>no</button>
            <button type='button' onClick={ this.handleWantNewFolder }>yes</button>
          </div>
        }
        
        { iWantNewFolder && 
          <form className="main__box" onSubmit={this.handleSubmit}>
            <h1>whats the folder name?</h1>
            <input 
              type="text" 
              name="folderName"
              placeholder="type a cool name" 
              onChange={this.handleInputChange}
              value={this.state.newFolder}
            />
            <button type='submit'>create</button>
          </form>
        }

      </div>
    )
  }
}

export default Main
