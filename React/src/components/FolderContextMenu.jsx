import React, { Component } from 'react';
import { Layout, Menu, Button, Popover, Icon, Input, message } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import axios from 'axios';

class FileContextMenu extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e, data, target) => {
    e.stopPropagation();
    console.log(target.getAttribute('path'))
  }

  deleteFolder = (e, data, target) => {
    e.stopPropagation();
    let path = target.getAttribute('path');
    let project = target.getAttribute('project');
    const _this = this;
    axios.get(window.url + '/project/' + project + '/delete/path/', {
      params: {
        path: path
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        message.success("Delete folder: (" + path + ") successfully");
      } else {
        message.error("Error code :" + msg.data["code"] + ", " + msg.data["message"]);
      }
      _this.props.updateProjectInfo();
    })
    .catch((error) => {
      message.error("Server error!");
    });
    _this.props.updateProjectInfo();
  }

  renameClick = (e, data, target) => {
    e.stopPropagation();
    this.props.updateRename();
  }

  render() {
    return(
      <>
        <MenuItem data={{foo: 'bar'}} onClick={this.renameClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="edit" />Rename
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.deleteFolder}>
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
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="profile" />Property
            </Menu.Item>
          </Menu>
        </MenuItem>
      </>
    );
  }
}

export default FileContextMenu;
