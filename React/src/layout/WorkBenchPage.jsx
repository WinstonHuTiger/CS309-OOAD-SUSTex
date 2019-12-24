import React, { Component } from 'react';
import { Layout, Menu, Icon, Card, Row, Col, Dropdown, Avatar, Popover
  , Divider, Input, message, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import Header from './Header';
import axios from 'axios';

const { confirm } = Modal;
const { SubMenu } = Menu;

class UserAvatar extends Component {
  render() {
    return(
      <Popover content={
        <div className="user-popover">
          <div>{this.props.userInfo["alias"]}</div>
          <Icon type="user"
          className={this.props.userInfo["type"] == "Creator"?"popover-creater":"popover-member"}
          />
            <b> {this.props.userInfo["type"]}</b>
            <div>Authority: <b>{this.props.userInfo["authority"] == "rw" ? "Read And Write" : "Read Only"}</b></div>
        </div>
      } trigger="hover">
        <Avatar shape="square" size={35} src="https://avatars1.githubusercontent.com/u/35868425?v=4"/>
      </Popover>
    );
  }
}

class ProjectCard extends Component {
  state = {
    hover: false,
    rename: false
  }

  onMouseEnter = () => {
    this.setState({
      hover: true
    });
  }

  onMouseLeave = () => {
    this.setState({
      hover: false
    });
  }

  renameStart = () => {
    this.setState({
      rename: true
    });
  }

  renameEnd = (e) => {
    this.setState({
      rename: false
    });
    const _this = this;
    axios.get(window.url + '/project/' + this.props.projectInfo["project"] + "/rename/",{
      params: {
        name: e.target.value
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        message.success("Rename successfully!")
        _this.props.updateProjectInfo();
      } else {
        message.error("Error code: " + msg.data["code"] + ", " + msg.data["message"])
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  copyUrl = () => {
    copy(window.location.host + '/#/project/' + this.props.projectInfo["project"] + '/');
    message.success("Copy project url into clipboard!");
  }

  deleteProject = () => {
    const _this = this;
    confirm({
     title: 'Are you sure delete this project?',
     content: 'This operation will delete project file from the server.',
     okText: 'Yes',
     okType: 'danger',
     cancelText: 'No',
     onOk() {
       axios.get(window.url + '/project/' + _this.props.projectInfo["project"] + '/delete/')
       .then((msg) => {
         if (msg.data["code"] == 1) {
           message.success("Delete project successfully!")
           _this.props.updateProjectInfo();
         } else {
           message.error("Error code" + msg.data["code"] + ": " + msg.data["message"]);
         }
       })
       .catch((error) => {
         console.log(error);
       });
     },
     onCancel() {

     },
   });
  }

  render() {
    const users = this.props.projectInfo["users"].map((item, index) =>
      <UserAvatar userInfo={item}/>
    );
    return(
      <Col span={6}>
        <Dropdown overlay={
          <Menu className="project-card-menu">
            <Menu.Item key="1" onClick={this.renameStart}><Icon type="edit" />Rename</Menu.Item>
            <Menu.Item key="2" onClick={this.deleteProject}><Icon type="delete" />Delete</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3"><Icon type="user-add" />Invite</Menu.Item>
            <Menu.Item key="4" onClick={this.copyUrl}><Icon type="share-alt" />Copy Url</Menu.Item>
            <Menu.Item key="5" onClick={this.downloadProject}>
              <a href={window.url + '/project/' + this.props.projectInfo["project"] + '/download/'} target="_blank"><Icon type="download" />Download</a>
            </Menu.Item>
          </Menu>
          } trigger={['contextMenu']}>
          <Card title={
            <>
            {this.state.rename?(
              <Input className="project-title"
                defaultValue={this.props.projectInfo["name"]}
                onBlur={this.renameEnd}
                onPressEnter={this.renameEnd}
               />
            ):(
              <div className="project-title none-select">
                {this.props.projectInfo["name"]}
              </div>
            )}
            </>
          }
          className={this.state.hover?("card-hover"):("card")}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          >
          <div className="project-card-container">
            <div className="project-card-members">
              <div className="project-card-tag">
                Members:
              </div>
              {users}
            </div>
            <div className="project-card-last">
              <div className="align-right none-select"><Icon type="clock-circle" /> Last Modify</div>
              <div className="align-right none-select">{this.props.projectInfo["last_modify"].split('.')[0]}</div>
            </div>
          </div>
         </Card>
       </Dropdown>
      </Col>
    );
  }
}

class WorkBenchPage extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  state = {
    userInfo: null,
    projectsInfo: [],
    emptyProject: false,
    nameValue: null
  };

  componentDidMount() {
    this.updateUserInfo();
    this.updateProjectInfo();
  }

  updateProjectInfo = () => {
    const _this = this;
    axios.get(window.url + '/user/projects/')
    .then((msg) => {
      if (msg.data["code"] == 1) {
        _this.setState({
          projectsInfo: msg.data["message"]
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateUserInfo = () => {
    const _this = this;
    axios.get(window.url + '/user/')
    .then((msg) => {
      console.log(msg)
      if (msg.data["code"] == 1) {
        _this.setState({
          userInfo: msg.data["message"]
        });
        if (_this.props.match.path == "/workbench/login/") {
          message.success("Login Successfully!");
          _this.props.history.push("/workbench/");
        }
      } else if (msg.data["code"] == 2) {

      }
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  emptyProject = () => {
    this.setState({
      emptyProject: true
    });
  }

  emptyOk = () => {
    const _this = this;
    axios.get(window.url + '/project/create/',{
      params: {
        name: this.state.nameValue
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        message.success("Create empty project successfully!");
        _this.updateProjectInfo();
      } else {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
    this.setState({
      emptyProject: false,
      nameValue: null
    });
  }

  emptyCancel = () => {
    this.setState({
      emptyProject: false
    });
  }

  inputName = ({ target: { value } }) => {
    this.setState({
      nameValue: value
    })
  }

  render() {
    const projects = this.state.projectsInfo.map((item, index) =>
      <ProjectCard projectInfo={item} updateProjectInfo={this.updateProjectInfo}/>
    );
    return(
      <Layout>
        <Header page='workbench' userInfo={this.state.userInfo} history={this.props.history}/>
        <Layout className="workbench-content">
          <Menu selectedKeys={["0"]} mode="horizontal" className="workbench-menu">
            <Menu.Item key="0">
              <Icon type="project" />
              Projects
            </Menu.Item>
            <Dropdown overlay={
              <Menu>
                <Menu.Item onClick={this.emptyProject}>
                  <Icon type="file" /> Empty Project
                </Menu.Item>
                <Menu.Item>
                  <Link to="/templates/"><Icon type="book" /> Import from Templte</Link>
                </Menu.Item>
                <Menu.Item>
                  <Icon type="file-zip" /> Load from Zip File
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
            >
              <Button type="primary" shape="round" icon="plus" size={30} id="new-project-btn">
                Create Project
              </Button>
            </Dropdown>
            <Modal
              title="New Project"
              visible={this.state.emptyProject}
              onOk={this.emptyOk}
              onCancel={this.emptyCancel}
            >
              <Input placeholder="name" value={this.state.nameValue} onChange={this.inputName} autoFocus/>
            </Modal>
          </Menu>
          <div className="workbench-container">
            <Row gutter={[24, 24]}>
              {projects}
            </Row>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default WorkBenchPage;
