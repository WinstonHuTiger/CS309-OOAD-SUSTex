import React, { Component } from 'react';
import { Layout, message } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import NProgress from '../tools/nprogress';
import Header from './Header';
import { Menu, Button, Popover, Icon, Input, Modal } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import FileContextMenu from '../components/FileContextMenu';
import FolderContextMenu from '../components/FolderContextMenu';
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
const { Dragger } = Modal;
var startTime;

const triggerStyle = {
  position: 'absolute',
  top: '50%',
  zIndex: '100',
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

class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateProjectInfo: props.updateProjectInfo,
      rename: false
    }
  }

  updateRename = () => {
    this.setState({
      rename: true
    });
  }

  handleClick = (e) => {
    e.stopPropagation();
  }

  renameEnd = (e) => {
    this.setState({
      rename: false
    });
    let name = e.target.value;
    let path = this.props.item["path"];
    let project = this.props.project;
    const _this = this;
    axios.get(window.url + '/project/' + project + '/rename/path/', {
      params: {
        path: path,
        name: name,
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        message.success("Rename folder: (" + path + ") successfully");
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

  render() {
    const item = this.props.item;
    return(
      <>
        <ContextMenuTrigger id={item["path"] + "-folder"} onClick={this.click}
        attributes={{'path': item["path"], 'project': this.props.project}}>
          <div>
            <span className="none-select">
              <Icon type="folder" />{this.state.rename?(
                <Input
                onClick={this.handleClick}
                onBlur={this.renameEnd}
                onPressEnter={this.renameEnd}
                className="rename-input"
                defaultValue={item["dirname"]}
                autoFocus/>
              ):(item["dirname"])}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenu id={item["path"] + "-folder"} className="contextMenu">
          <FolderContextMenu updateProjectInfo={this.props.updateProjectInfo}
          updateRename={this.updateRename}/>
        </ContextMenu>
      </>
    );
  }
}

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateProjectInfo: props.updateProjectInfo,
      rename: false,
      selected: false
    }
  }

  updateRename = () => {
    this.setState({
      rename: true
    });
  }

  handleClick = (e) => {
    e.stopPropagation();
  }

  renameEnd = (e) => {
    this.setState({
      rename: false
    });
    let newName = e.target.value;
    let path = this.props.path;
    let name = this.props.item["filename"];
    let project = this.props.project;
    const _this = this;
    axios.get(window.url + '/project/' + project + '/rename/file/', {
      params: {
        path: path,
        name: name,
        new_name: newName
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        message.success("Rename File: " + name + " successfully");
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

  getFileType = (type) => {
    switch(type) {
      case "PDF":
        return "file-pdf";
      case "Markdown":
        return "file-markdown";
      case "Bib":
      case "LaTex":
      case "Text":
        return "file-text";
      case "Zip":
        return "file-zip";
      case "Image":
        return "file-image";
      default:
        return "file-unknown"
    }
  }

  render() {
    const item = this.props.item;
    const path = this.props.path;
    const name = this.props.item["filename"];
    const project = this.props.project;
    return(
      <>
        <ContextMenuTrigger id={path + item["filename"] +"-file"}
        attributes={{'path': path, 'name': name, 'project': project}}>
        <div className={this.state.selected?"item-selected":(null)}>
          <span className="none-select">
            <Icon type={this.getFileType(item["type"])} />{this.state.rename?(
              <Input
              onClick={this.handleClick}
              onBlur={this.renameEnd}
              onPressEnter={this.renameEnd}
              className="rename-input"
              defaultValue={item["filename"]}
              autoFocus/>
            ):(item["filename"])}
          </span>
        </div>
        </ContextMenuTrigger>
        <ContextMenu id={path + item["filename"] + "-file"} className="contextMenu">
          <FileContextMenu updateProjectInfo={this.props.updateProjectInfo}
          updateRename={this.updateRename}/>
        </ContextMenu>
      </>
    );
  }
}

class FileManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      collapsed: false,
      modalIsOpen: true,
      leftShow: false,
      fileList: [],
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

  renderDir = (files) => {
    if (files == null) {
      return null;
    }
    return(
      <Menu
        mode="inline"
        >
      {files["child_dirs"].map((item, index) =>
        <SubMenu
          className="folder"
          key={item["dirname"]}
          title={
            <Folder item={item}
            updateProjectInfo={this.props.updateProjectInfo}
            project={this.props.project}/>
          }
        >
        {this.renderDir(item)}
        </SubMenu>)}
        {files["files"].map((item, index) =>
            <Menu.Item key={files["path"] + "/" + item["filename"]} className="file-item">
              <File
              item={item}
              path={files["path"]}
              updateProjectInfo={this.props.updateProjectInfo}
              project={this.props.project}
              />
            </Menu.Item>
        )}
      </Menu>
    );
  }

  onFileChange = (info) => {
    let re = [info.file];
    const { status } = info.file;
    if (status == "removed"){
      re = [];
    } else if (status === 'done') {
      let arr = info.file.name.split('.')
      let prefix = arr[arr.length - 1];
      if (prefix != "zip") {
        message.error("Invalid file type, please upload Zip file.");
        re = [];
      } else {
        if (info.file.response["code"] == 1) {
          message.success(`${info.file.name} file uploaded successfully.`);
          this.updateProjectInfo();
          this.zipOk();
        } else if (info.file.response["code"] == 2) {
          message.error("Error code " + info.file.response["code"] + ": " + info.file.response["message"]);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          message.error("File corrupted! Please check it.")
        }
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({
      fileList: re
    });
  }

  uploadProps = {
    multiple: false,
    headers: {
      Authorization: '$prefix $token',
    },
    customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    }) {
      // EXAMPLE: post form-data with 'axios'
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);
      axios
        .post(action, formData, {
          headers,
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
          },
        })
        .then(({ data: response }) => {
          onSuccess(response, file);
        })
        .catch(onError);
      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    },
  };

  render(){
    const files = this.renderDir(this.props.files);
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
          <div className="project-menu">
            <Search
              placeholder="Search File"
              onSearch={value => console.log(value)}
              style={{ width: '230px', margin: '10px', zIndex: 0 }}
            />
            {files}
        </div>
        <Modal
          title="Upload File"
          visible={this.state.zipProject}
          onOk={this.zipOk}
          onCancel={this.zipOk}
        >
          <Dragger
          fileList={this.state.fileList}
          onChange={this.onFileChange}
          action={window.url + "/project/import/"}
          {...this.uploadProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Only support one zip file.
            </p>
          </Dragger>
        </Modal>
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
      projectInfo: null,
      files: null,
      project: null
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
      _this.updateProjectInfo();
    })
    .catch(function (error) {
      message.error("Server Error!");
      _this.setState({
        users: null,
      });
    });
  }

  updateProjectInfo = () => {
    const _this = this;
    axios.get(window.url + "/project/" + this.props.match.params["random_str"] + "/")
    .then((msg) => {
      console.log(msg);
      if (msg.data["code"] == 1) {
        _this.setState({
          projectInfo: msg.data["message"],
          files: msg.data["message"]["files"],
          project: msg.data["message"]["random_str"]
        });
      } else if (msg.data["code"] == 2) {

      } else {
        message.error("Error code: " + msg.data["code"] + ", " + msg.data["message"]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <Layout>
          <Header page="project"
          userInfo={this.state.userInfo}
          history={this.props.history}
          />
          <Layout>
            <FileManagement
              updateProjectInfo={this.updateProjectInfo}
              projectInfo={this.state.projectInfo}
              project={this.state.project}
              files={this.state.files}/>
          </Layout>
      </Layout>
    );
  }
}
export default ProjectPage;
