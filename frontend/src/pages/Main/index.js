import React, { Component } from 'react'

import api from '../../services/api'

import './styles.css'

class Main extends Component {

  state = {
    newFolder: '',
    iWantNewFolder: null,
    imTeacher: false,
  }

  componentDidMount() {
    const isTeacher = new URLSearchParams(this.props.location.search).get('teacher')
    
    if (isTeacher) {
      this.setState({ imTeacher: true })
    }
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

  goToFolders = (teacher) => {  
    if (teacher) {
      this.props.history.push(`/folders/?teacher=true`)
    } else {
      this.props.history.push(`/folders`)
    }
  }

  handleStyleTeacher = () => {
    document.getElementById('root').style = 'color: #5a71ff'
  }

  render() {

    const { iWantNewFolder, imTeacher } = this.state 

    if (!imTeacher) {
      return (
        <div className="main__container">
          <div className="main__box">
            <h1>you are a student, only teachers can create folders</h1>
            <button type='button' onClick={ () => this.goToFolders(false) }>go to folders</button>
          </div>
        </div>
      )
    }

    this.handleStyleTeacher()

    return (
      <div className="main__container">

        { !iWantNewFolder && 
          <div className="main__box">
            <h1>hi teacher, do you need a new folder?</h1>
            <button type='button' className="gray" onClick={ () => this.goToFolders(true) }>no</button>
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
