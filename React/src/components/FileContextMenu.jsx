import React, { Component } from 'react';
import { Layout, Menu, Button, Popover, Icon, Input } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class FileContextMenu extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e, data, target) => {
    e.stopPropagation();
    console.log(target.getAttribute('info'))
  }
  render() {
    return(
      <>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          <Menu selectable={false}>
            <Menu.Item key="0" className="none-select">
              <Icon type="edit" />Rename
            </Menu.Item>
          </Menu>
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
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
