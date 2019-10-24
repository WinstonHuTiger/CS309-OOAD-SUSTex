import { Menu, Icon, Switch, Input } from 'antd';
import React from 'react';

const { SubMenu } = Menu;
const { Search } = Input;
class FileManager extends React.Component {
  state = {
    theme: 'dark',
    current: '1',
  };

  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu theme="light"
      selectedKeys={["/img"]}
      mode="inline"
      className="menu">
        <Search
          placeholder="Search File"
          onSearch={value => console.log(value)}
          style={{ width: '180px', margin: '10px' }}
        />
        <SubMenu
          key="/img"
          title={
            <span>
              <Icon type="folder" />
              <span>Img</span>
            </span>
          }
          onTitleClick={
            (key, domEvent) =>{
              console.log()
            }
          }
        >
          <Menu.Item key="/img/img.gif">
            <Icon type="" />img.gif
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="1" className="file">
          <Icon type="file-text" />markdown.md
        </Menu.Item>
        <Menu.Item key="2" className="file">
          <Icon type="file-text" />latex.tex
        </Menu.Item>
      </Menu>
    );
  }
}

export default FileManager;
