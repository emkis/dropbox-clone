import React, { Component } from 'react'

import api from '../../services/api'

import './styles.css'

class Main extends Component {

  state = {
    newFolder: '',
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    
    const response = await api.post('/folder', {
      title: this.state.newFolder,
    })

    const { _id } = response.data
    
    this.props.history.push(`/folder/${_id}`)
  }

  handleInputChange = (e) => {
    this.setState({ newFolder: e.target.value })
  }

  render() {
    return (
      <div className="main__container">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="folderName">whats the folder name?</label>
          <input 
            type="text" 
            name="folderName"
            placeholder="type a cool nome" 
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
