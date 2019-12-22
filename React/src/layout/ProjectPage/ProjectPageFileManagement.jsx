import React, { Component } from 'react';
import { Layout, Menu, Button, Popover, Icon, Input } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Lightbox from 'react-lightbox-component';
import ContextMenuItems from '../../components/ContextMenuItems';
import '../css/lightbox.css';
import '../css/custom.css';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const triggerStyle = {
  position: 'absolute',
  top: '50%',
  zIndex: '9999',
  background: '#FFF',
  width: '20px',
  height: '50px',
  borderRadius: '0  100% 100% 0/ 50%',
  borderLeft: '0px',
  transition: "all 0.25s ease-out",
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

const menuItemStyle = {
  height: '20px',
  lineHeight: '20px'
}

class FileManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      collapsed: true,
      modalIsOpen: true,
      changeMode: this.props.changeMode,
      leftShow: false,
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

  componentDidMount() {
    document.body.onmousemove = (e) => {
      if (e.clientX > 50 && this.state.leftShow) {
        this.setState({
          leftShow: false
        });
      } else if (e.clientX <= 50 && !this.state.leftShow) {
        this.setState({
          leftShow: true
        });
      }
    }
  }

  render(){
      return(
        <Sider collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
        collapsedWidth="0"
        width="230px"
        trigger={null}>
          <Menu theme="light"
          mode="inline"
          defaultOpenKeys={['/img']}
          defaultSelectedKeys={['/markdown.md']}
          className="menu"
          >
            <Button
              style={triggerStyle}
              className={
                this.state.collapsed?
                (this.state.leftShow?"left-show":"left-hide"):
                ("uncollapsed")
              }
              icon={this.state.collapsed?"right":"left"}
              shape="circle"
              onClick={this.toggle}/>
              <Search
                placeholder="Search File"
                onSearch={value => console.log(value)}
                style={{ width: '210px', margin: '10px', zIndex: 0 }}
              />
              <SubMenu
                key="/img"
                title={
                  <span class="file">
                    <Icon type="folder" />
                    <span>Img</span>
                  </span>
                }
              >
                <Menu.Item key="/img/only_me.gif" className="file">
                <Popover content={only_me} style={{padding: '0'}}>
                  <Icon type="file-image" />only_me.gif
                </Popover>
                </Menu.Item>
                <Menu.Item key="/img/star_ocean.gif" className="file">
                <Popover content={star_ocean} style={{padding: '0'}}>
                  <Icon type="file-image" />star_ocean.gif
                </Popover>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="/markdown.md" className="file" onClick={this.markdownFile}>
                <Icon type="file-text" />markdown.md
              </Menu.Item>
              <Menu.Item key="/latex.tex" className="file" onClick={this.latexFile}>
              <ContextMenuTrigger id="file" attributes={{'info': 'file'}}>
                <Icon type="file-text" />latex.tex
              </ContextMenuTrigger>
              </Menu.Item>
          </Menu>
          <ContextMenu id="file" className="contextMenu">
            <ContextMenuItems />
          </ContextMenu>
        </Sider>
      );
  }
}

export default FileManagement;
