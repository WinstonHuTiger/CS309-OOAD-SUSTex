import React, { Component } from 'react';
import { Layout, message } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import NProgress from '../tools/nprogress';
import Header from './Header';
import { Menu, Button, Popover, Icon, Input } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Lightbox from 'react-lightbox-component';
import './css/lightbox.css';
import './css/custom.css';
import MarkdownRender from '../components/MarkdownRender';
import MarkdownEditor from '../components/MarkdownEditor';
import LatexEditor from '../components/LatexEditor';
import { Resizable } from "re-resizable";

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
var startTime;

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
const { Content } = Layout;
const contentStyle = {
  height: '100%',
  width: '100%'
};

var resizableStyle = {
  position: "relative",
  float: "left",
  width: "50%",
  height: "100%",
  transition: null
};

const layer = {
  position: 'absolute',
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#373b41',
  fontSize: '35px'
}

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      resize: false,
      max: false,
      min: false,
      maxWidth: "75%",
      minWidth: "25%",
      iconHover: false,
      resizeSize: null,
      hideRender: false,
      hide: false,
      defaultSize: {
        width: "50%",
        height: "100%"
      },
      showRightButton: false,
      currentWidth: document.body.clientWidth * 0.5 - 10,
      render: this.props == "markdown" ? "markdown-render" : "pdf-viewer",
    }
  }

  getEditorText = (text) => {
    this.setState({
      value: text
    });
  }

  showRender = () => {
    this.setState({
      hideRender: false,
      maxWidth: "75%",
      minWidth: "25%",
      resizeSize: {
        width: "70%",
        height: "100%"
      },
      hide: false
    });
    document.getElementById("editor").onmousemove = null;
  }

  render() {
    return(
      <Content style={contentStyle}>
        <Row className="content-row">
        <Col
          span={24}
          style={{
             height: "100%",
             margin: 0,
             padding: 0,
             width: "100%",
          }}>
              <Resizable
                id="editor"
                style={resizableStyle}
                size={this.state.resizeSize}
                defaultSize={this.state.defaultSize}
                enable={{
                  top:false,
                  right:true,
                  bottom:false,
                  left:false,
                  topRight:false,
                  bottomRight:false,
                  bottomLeft:false,
                  topLeft:false
                }}
                minWidth={this.state.minWidth}
                maxWidth={this.state.maxWidth}
                handleClasses={{
                  right: "resize"
                }}
                handleStyles={{
                  right: {
                      left: "100%",
                      cursor: "ew-resize",
                      borderTop: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderWidth: 5,
                      background: "#FFF",
                      zIndex: 99,
                      width: 10,
                      boxShadow: "4px 0px 6px #e7e7e7",
                    },
                }}
                onResize={(e, dir, refToElement, delta) => {
                  console.log(this.state.render)
                  if (this.state.resize != null) {
                    this.setState({
                      resizeSize: null
                    })
                  }
                  if(this.state.hide)
                    return;
                  let width = refToElement.style.width;
                  let widthpx = refToElement.getBoundingClientRect().width
                  let leftpx = refToElement.getBoundingClientRect().left
                  let tmp = document.body.clientWidth - (widthpx + leftpx) - 10
                  this.setState({
                    currentWidth: tmp + "px"
                  })
                  let hideIcon = document.getElementById("hideIcon");
                  if (hideIcon != null){
                    let pos = hideIcon.getClientRects()[0];
                    if (pos.left < e.clientX && e.clientX < pos.right &&
                        pos.top < e.clientY && e.clientY < pos.bottom) {
                      this.setState({
                        iconHover: true
                      });
                    } else {
                      this.setState({
                        iconHover: false
                      });
                    }
                  }
                  if (width >= "71%") {
                    this.setState({
                      max: true,
                    });
                  } else if (width <= "29%") {
                    this.setState({
                      min: true,
                    });
                  } else {
                    this.setState({
                      min: false,
                      max: false
                    });
                  }
                }}
                onResizeStop={(e, dir, refToElement, delta) => {
                  if (this.state.iconHover) {
                    if (this.state.max) {
                      this.setState({
                        resizeSize: {
                          width: "100%",
                          height: "100%"
                        },
                        maxWidth: "100%",
                        iconHover: false,
                        hideRender: true,
                        hide: true
                      });
                      document.getElementById("editor").onmousemove = (e) => {
                        if (document.body.offsetWidth - e.clientX <= 50 && !this.state.showRightButton) {
                          this.setState({
                            showRightButton: true
                          });
                        } else if (document.body.offsetWidth - e.clientX > 50 && this.state.showRightButton) {
                          this.setState({
                            showRightButton: false
                          });
                        }
                      }
                    } else {
                      this.setState({
                        resizeSize: {
                          width: "0%",
                          height: "100%"
                        },
                        minWidth: "0%",
                        iconHover: false,
                        hide: true
                      });
                    }
                  } else {
                    this.setState({
                      maxWidth: "75%",
                      minWidth: "25%",
                      resizeSize: null,
                      hide: false
                    });
                  }
                  this.setState({
                    max: false,
                    min: false
                  });
                }}
              >
              {this.state.min?
                (<div style={layer}>
                  <div
                    id="hideIcon"
                    className={this.state.iconHover? "hideIcon hover" : "hideIcon"}>
                    Hide
                  </div>
                 </div>):(null)}
                {this.props.mode === "markdown" ? (
                  <MarkdownEditor
                    updateFater={this.getEditorText}
                    blur={this.state.min}
                    text={this.state.value}
                    />
                ):(
                  <LatexEditor
                    updateFater={this.getEditorText}
                    blur={this.state.min}
                    text={this.state.value}
                    />
                )}
            </Resizable>
              {this.state.max?
                (<div style={{
                  position: 'absolute',
                  height: document.getElementById(this.state.render).getClientRects()[0].height,
                  width: document.getElementById(this.state.render).getClientRects()[0].width,
                  top: 0,
                  right: 0,
                  zIndex: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#373b41',
                  fontSize: '35px'
                }}>
                  <div
                    id="hideIcon"
                    className={this.state.iconHover? "hideIcon hover" : "hideIcon"}>
                    Hide
                  </div>
                 </div>):(null)}
              {this.props.mode == "markdown" ? (
                <MarkdownRender
                  id="markdown-render"
                  className="markdown"
                  blur={this.state.max}
                  source={this.state.value}
                  hide={this.state.hideRender}
                  show={this.showRender}
                  showButton={this.state.showRightButton}
                />
              ) : (
                <div class="iframe-container">
                  <iframe
                    id="pdf-viewer"
                    className={this.state.max?"pdf-render blur":"pdf-render"}
                    src="/pdfjs-2.2.228-dist/web/viewer.html?file=https://arxiv.org/pdf/1704.04861.pdf"
                    allowfullscreen
                    // width={this.state.currentWidth}
                    />
                </div>
              )}
          </Col>
        </Row>
      </Content>
    );
  }
}

class FileManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      collapsed: true,
      modalIsOpen: true,
      leftShow: false,
    }
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

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render(){
      return(
        <>
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
        <Sider collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
        collapsedWidth="0"
        width="250px"
        trigger={null}>
          <Menu theme="light"
          mode="inline"
          defaultOpenKeys={['/img']}
          defaultSelectedKeys={['/markdown.md']}
          className="project-menu"
          >
            <Search
              placeholder="Search File"
              onSearch={value => console.log(value)}
              style={{ width: '230px', margin: '10px', zIndex: 0 }}
            />
        </Menu>
      </Sider>
      </>
      );
  }
}

class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      random_str: props.match.params.random_str
    };
  }

  componentWillMount() {
    startTime = new Date();
    NProgress.start();
  }

  componentDidMount() {
    let endTime = new Date();
    let timeInterval = endTime.getTime() - startTime.getTime();
    const _this = this;
    axios.get(window.url + '/user/')
    .then((msg) => {
      if (msg.data["code"] == 1) {
        _this.setState({
          userInfo: msg.data["message"],
        });
        message.success('Login Successfully!');
        if (timeInterval <= 500){
          setTimeout(function(){
            NProgress.done();
          }, 500 - timeInterval);
        } else {
          NProgress.done();
        }
      } else {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
      }
    })
    .catch(function (error) {
      message.error("Server Error!");
      _this.setState({
        users: null,
      });
    })
  }

  render() {
    return (
      <Layout>
          <Header page="project" userInfo={this.state.userInfo}/>
          <Layout>
            <FileManagement project={this.state.random_str}/>
          </Layout>
      </Layout>
    );
  }
}
export default ProjectPage;
