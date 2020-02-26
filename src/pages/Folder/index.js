import React, { Component } from "react";
import { formatDistance, parseISO } from "date-fns";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { FaCircleNotch } from "react-icons/fa";

import api from "../../services/api";

class Folder extends Component {
  state = {
    folder: {},
    loading: true,
    deletingFolder: false
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const folderId = this.props.match.params.id;
    const response = await api.get(`/folder/${folderId}`);

    this.setState({
      folder: response.data,
      loading: false
    });
  }

  subscribeToNewFiles = () => {
    const folderId = this.props.match.params.id;
    const io = socket(process.env.REACT_APP_API_URL);

    io.emit("connectionRoom", folderId);

    io.on("file", data => {
      this.setState({
        folder: {
          ...this.state.folder,
          files: [data, ...this.state.folder.files]
        }
      });
    });

    io.on("fileChanged", data => {
      const modifiedFile = this.state.folder.files.map(file => {
        if (file.id === data.id) {
          file.url = data.url;
          file.updatedAt = data.updatedAt;
          return file;
        }
        return file;
      });

      this.setState({
        folder: { ...this.state.folder, files: [...modifiedFile] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const folderId = this.props.match.params.id;

      data.append("file", file);
      api.post(`folder/${folderId}/files`, data);
    });
  };

  handleDeleteFolder = async id => {
    this.setState({ deletingFolder: true });

    try {
      await api.delete(`folder/${id}`);
      this.props.history.push("/");
    } catch (error) {
      this.setState({ deletingFolder: false });
    }
  };

  render() {
    const { title, files } = this.state.folder;
    const { loading, deletingFolder } = this.state;

    if (loading) {
      return (
        <div className="loading">
          <FaCircleNotch />
        </div>
      );
    }

    return (
      <div className="folder__container">
        <header>
          <h1>{title}</h1>
          <div>
            <button
              type="button"
              className="btn btn-icon"
              title="delete this folder"
              onClick={this.handleDeleteFolder}
              disabled={deletingFolder}
            >
              {deletingFolder ? (
                <FaCircleNotch className="rotate" size={33} />
              ) : (
                <FiTrash2 size={35} />
              )}
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
    );
  }
}

export default Folder;
