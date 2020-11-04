import React, { Component, createRef } from "react"
import { MdFolder } from "react-icons/md"
import { FiDownload, FiFolderPlus } from "react-icons/fi"
import { FaCircleNotch } from "react-icons/fa"

import socket from "socket.io-client"
import { Link } from "react-router-dom"

import api from "../../services/api"

class Folders extends Component {
  state = {
    folders: [],
    loading: true,
    downloadingFiles: false,
    creatingFolder: false,
    iWantAFolder: false,
    newFolderName: ""
  }

  async componentDidMount() {
    this.subscribeToNewFolders()

    const response = await api.get(`/folders`)
    const data = await response.data

    this.setState({
      folders: data,
      loading: false
    })
  }

  componentDidUpdate() {
    this.textInput.current && this.focusTextInput()

    if (this.state.iWantAFolder) {
      document.addEventListener("mousedown", this.handleClickOutside)
      window.addEventListener('scroll', this.noScroll);
    }
  }

  textInput = createRef()
  focusTextInput = () => this.textInput.current.focus()

  containerRef = createRef()

  handleClickOutside = event => {
    if (this.containerRef.current.contains(event.target)) return

    this.setState({
      iWantAFolder: false,
      newFolderName: "",
      creatingFolder: false
    })
    document.removeEventListener("mousedown", this.handleClickOutside)
    window.removeEventListener('scroll', this.noScroll);
  }

  noScroll = (x = 0, y = 0) => window.scrollTo(x, y)

  subscribeToNewFolders = () => {
    const io = socket(process.env.REACT_APP_API_URL)

    io.on("@folder/CREATED", data => {
      this.setState({
        folders: [...this.state.folders, data]
      })
    })

    io.on('@folder/REMOVED', removedFolder => {
      this.setState({
        folders: [
          ...this.state.folders.filter(folder => 
          folder._id !== removedFolder._id && folder
        )]
      })
    })
  }

  handleDownload = async () => {
    this.setState({ downloadingFiles: true })

    try {
      const response = await api.get("/download", {
        responseType: "blob",
        timeout: 30000
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "all_files.zip")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {}

    this.setState({ downloadingFiles: false })
  }

  handleNewFolder = () => {
    this.setState({
      iWantAFolder: true
    })
  }

  createNewFolder = async e => {
    e.preventDefault()
    if (!this.state.newFolderName.trim()) return

    this.setState({ creatingFolder: true })

    try {
      await api.post("folder", {
        title: this.state.newFolderName
      })

      this.setState({ iWantAFolder: false, creatingFolder: false, newFolderName: "" })
      document.removeEventListener("mousedown", this.handleClickOutside)
    } catch (error) {
      this.setState({ creatingFolder: false })
    }
  }

  render() {
    const {
      folders,
      loading,
      iWantAFolder,
      creatingFolder,
      downloadingFiles
    } = this.state

    if (loading) {
      return (
        <div className="loading">
          <FaCircleNotch />
        </div>
      )
    }

    return (
      <div className="folder__container">
        {iWantAFolder && (
          <div className="overlay">
            <form onSubmit={this.createNewFolder} className="main__box" ref={this.containerRef}>
              <h1>type the folder name</h1>
              <input
                type="text"
                ref={this.textInput}
                value={this.state.newFolderName}
                onChange={e => this.setState({ newFolderName: e.target.value })}
              />
              <button
                type="submit"
                disabled={creatingFolder}
                required
              >
                {creatingFolder ? (
                  <FaCircleNotch className="rotate" />
                ) : (
                  "create folder"
                )}
              </button>
            </form>
          </div>
        )}

        <header>
          <h1>current folders</h1>
          <div>
            <button
              className="btn btn-icon"
              title="add a new folder"
              onClick={this.handleNewFolder}
            >
              <FiFolderPlus size={35} />
            </button>
            <button
              className="btn btn-icon"
              title="download all files"
              onClick={this.handleDownload}
              disabled={downloadingFiles}
            >
              {downloadingFiles ? (
                <FaCircleNotch size={33} className="rotate" />
              ) : (
                <FiDownload size={35} />
              )}
            </button>
          </div>
        </header>

        <ul className="folders">
          {folders.length ? (
            folders.map(folder => (
              <li key={folder.title}>
                <Link
                  className="wrapper-_link"
                  to={`/folder/${folder._id}/files`}
                >
                  <MdFolder size={40} />
                  <span className="file__info">{folder.title}</span>
                </Link>
              </li>
            ))
          ) : (
            <p className="folders__empty-message">
              there's no folders here, you can create one 
              <strong onClick={this.handleNewFolder}> clicking here.</strong>
            </p>
          )}
        </ul>
      </div>
    )
  }
}

export default Folders
