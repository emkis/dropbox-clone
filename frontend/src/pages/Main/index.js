import React, { Component } from 'react'

import api from '../../services/api'

import './styles.css'

class Main extends Component {

  state = {
    newFolder: '',
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    
    await api.post('/folder', {
      title: this.state.newFolder,
    })
    
    this.props.history.push(`/folders`)
  }

  handleInputChange = (e) => {
    this.setState({ newFolder: e.target.value })
  }

  render() {
    return (
      <div className="main__container">
        <form onSubmit={this.handleSubmit}>
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
      </div>
    )
  }
}

export default Main
