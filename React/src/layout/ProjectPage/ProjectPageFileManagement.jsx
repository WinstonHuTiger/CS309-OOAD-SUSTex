import React, { Component } from 'react';
import { Layout, Menu, Button, Popover, Icon, Input } from 'antd';
import Lightbox from 'react-lightbox-component';
import '../css/lightbox.css';
import '../css/custom.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const triggerStyle = {
  position: 'absolute',
  top: '50%',
  zIndex: '10',
  background: '#FFF',
  width: '20px',
  height: '50px',
  borderRadius: '0  100% 100% 0/ 50%',
  opacity: '0.5',
  borderLeft: '0px',
};

const only_me = (
  <Lightbox
  images={
   [
     {
       src: 'only_me.jpg',
       title: '他现在只有我了',
       description: 'By: JW'
     }
   ]
 }/>
);
const star_ocean = (
  <Lightbox
  images={
   [
     {
       src: 'star_ocean.jpg',
       title: 'Star Ocean',
       description: 'By：ふろく'
     }
   ]
 }/>
);

class FileManagement extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      isLoading: true,
      collapsed: true,
      modalIsOpen: true,
      changeMode: this.props.changeMode
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  latexFile = () => {
    this.state.changeMode("latex")
  }

  markdownFile = () => {
    this.state.changeMode("markdown")
  }

  render(){
      return(
        <Sider collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
        collapsedWidth="0"
        trigger={null}>
          <Menu theme="light"
          mode="inline"
          defaultOpenKeys={['/img']}
          defaultSelectedKeys={['/markdown.md']}
          className="menu">
            <Button
              id="trigger"
              style={triggerStyle}
              className={this.state.collapsed?"collapsed":"uncollapsed"}
              icon={this.state.collapsed?"right":"left"}
              shape="circle"
              onClick={this.toggle}/>
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
            >
              <Menu.Item key="/img/only_me.gif" style={{height: 'auto'}}>
              <Popover content={only_me} style={{padding: '0'}}>
                <Icon type="file-image" />only_me.gif
              </Popover>
              </Menu.Item>
              <Menu.Item key="/img/star_ocean.gif" style={{height: 'auto'}}>
              <Popover content={star_ocean} style={{padding: '0'}}>
                <Icon type="file-image" />star_ocean.gif
              </Popover>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="/markdown.md" className="file" onClick={this.markdownFile}>
              <Icon type="file-text" />markdown.md
            </Menu.Item>
            <Menu.Item key="/latex.tex" className="file" onClick={this.latexFile}>
              <Icon type="file-text" />latex.tex
            </Menu.Item>
          </Menu>
        </Sider>
      );
  }
}

export default FileManagement;
