import React, { Component } from 'react';
import { Layout, Menu, Button, Popover, Icon, Input, message, Modal } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import axios from 'axios';

const { confirm } = Modal;

class FileContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newFile: false,
      nameValue: null,
      newFolder: false,
      folderNameValue: null,
    }
  }

  handleClick = (e, data, target) => {
    e.stopPropagation();
  }

  renameClick = (e, data, target) => {
    console.log(target.getAttribute('path'));
    e.stopPropagation();
    this.props.updateRename();
  }

  deleteFile = (e, data, target) => {
    e.stopPropagation();
    let path = target.getAttribute('path');
    let project = target.getAttribute('project');
    let name = target.getAttribute('name');
    const _this = this;
    confirm({
    title: 'Are you sure delete this file?',
    content: 'This operation is irreversible',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      axios.get(window.url + '/project/' + project + '/delete/file/', {
        params: {
          path: path,
          name: name
        }
      })
      .then((msg) => {
        if (msg.data["code"] == 1) {
          message.success("Delete file: " + name + " successfully");
        } else {
          message.error("Error code :" + msg.data["code"] + ", " + msg.data["message"]);
        }
        _this.props.updateProjectInfo();
      })
      .catch((error) => {
        message.error(error.toString())
      });
      _this.props.updateProjectInfo();
    },
    onCancel() {

    },
  });
  }

  propertyClick = (e, data, target) => {
    let path = target.getAttribute('path');
    let project = target.getAttribute('project');
    let name = target.getAttribute('name');
    e.stopPropagation();
    axios.get(window.url + '/project/' + project + '/attribute/file/', {
      params: {
        path: path,
        name: name
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        Modal.info({
         title: 'File: ' + name,
         content: (
           <div>
             <p>Size: {msg.data["message"]["size"]}KB <br/>
                Create Time: {msg.data["message"]["create_time"]}<br/>
                Access Time: {msg.data["message"]["access_time"]}<br/>
                Modify Time: {msg.data["message"]["modify_time"]}</p>
           </div>
         ),
         onOk() {},
       });
      } else {
        message.error("Error code :" + msg.data["code"] + ", " + msg.data["message"]);
      }
    })
    .catch((error) => {
      message.error(error.toString())
    });
  }

  newFileClick = (e, data, target) => {
    this.setState({
      newFile: true,
      path: target.getAttribute('path'),
      project: target.getAttribute('project'),
      name: target.getAttribute('name')
    });
  }

  newFileOk = () => {
    if (this.state.nameValue == null || this.state.nameValue == "") {
      message.error("File name cannot be empty!");
      return;
    }
    const _this = this;
    let name = this.state.nameValue;
    let project = this.state.project;
    let path = this.state.path;
    axios.get(window.url + '/project/' + project + '/create/file/',{
      params: {
        name: name,
        path: path
      }
    })
    .then((msg) => {
      console.log(msg);
      if (msg.data["code"] == 1) {
        message.success("Create file successfully!");
      } else {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
      }
      _this.props.updateProjectInfo();
    })
    .catch((error) => {
      message.error(error.toString())
    });
    this.setState({
      newFile: false,
      nameValue: null
    });
  }

  newFileCancel = () => {
    this.setState({
      newFile: false,
    });
  }

  inputName = ({ target: { value } }) => {
    this.setState({
      nameValue: value
    });
  }

  newFolderClick = (e, data, target) => {
    e.stopPropagation();
    this.setState({
      newFolder: true,
      path: target.getAttribute('path'),
      project: target.getAttribute('project'),
      name: target.getAttribute('name')
    });
  }

  newFolderOk = () => {
    const _this = this;
    let name = this.state.folderNameValue;
    let project = this.state.project;
    let path = this.state.path;
    if (name == null || name == "") {
      message.error("Folder name cannot be empty!");
      return;
    }
    axios.get(window.url + '/project/' + project + '/create/path/',{
      params: {
        name: name,
        path: path
      }
    })
    .then((msg) => {
      console.log(msg);
      if (msg.data["code"] == 1) {
        message.success("Create folder successfully!");
      } else {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
      }
      _this.props.updateProjectInfo();
    })
    .catch((error) => {
      message.error(error.toString())
    });
    this.setState({
      newFolder: false,
      folderNameValue: null
    });
  }

  newFolderCancel = () => {
    this.setState({
      newFolder: false,
    });
  }

  inputFolderName = ({ target: { value } }) => {
    this.setState({
      folderNameValue: value
    });
  }

  render() {
    return(
      <>
        <MenuItem data={{foo: 'bar'}} onClick={this.newFileClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="file-add" />New File
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.newFolderClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="folder-add" />New Folder
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.renameClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="edit" />Rename
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.deleteFile}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="delete" />Delete
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="scissor" />Cut
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="copy" />Copy
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="save" />Paste
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.propertyClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="profile" />Property
            </Menu.Item>
          </Menu>
        </MenuItem>
        <Modal
          title="New File"
          visible={this.state.newFile}
          onOk={this.newFileOk}
          onCancel={this.newFileCancel}
        >
          <Input placeholder="filename"
            value={this.state.nameValue}
            onChange={this.inputName}
            onPressEnter={this.newFileOk}
            autoFocus/>
        </Modal>
        <Modal
          title="New Folder"
          visible={this.state.newFolder}
          onOk={this.newFolderOk}
          onCancel={this.newFolderCancel}
        >
          <Input placeholder="filename"
            value={this.state.folderNameValue}
            onChange={this.inputFolderName}
            onPressEnter={this.newFolderOk}
            autoFocus/>
        </Modal>
      </>
    );
  }
}

export default FileContextMenu;
