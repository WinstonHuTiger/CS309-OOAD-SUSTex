import React, { Component } from 'react';
import { Layout, Menu, Icon, Card, Row, Col, Dropdown, Avatar, Popover
  , Divider, Input, message, Button, Modal, Upload, Tabs, Transfer
  , Select } from 'antd';
import { Link } from 'react-router-dom';
import NProgress from '../tools/nprogress';
import copy from 'copy-to-clipboard';
import Header from './Header';
import axios from 'axios';

const { Dragger } = Upload;
const { confirm } = Modal;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
const { Option } = Select;
var startTime;

class PrioritySelect extends Component {
  state = {
    priority: "Read & Write"
  }

  handleParentClick = (e) => {
    e.stopPropagation();
  }

  clickItem = (e) => {
    let val = e.key == "rw" ? "Read & Write" : "Read Only";
    this.setState({
      priority: val
    })
    this.props.updatePriority(this.props.mapKey, e.key);
  }

  render() {
    return(
      <span onClick={this.handleParentClick}>
        <Dropdown overlay={
          <Menu>
           <Menu.Item onClick={this.clickItem} key="rw">
             Read & Write
           </Menu.Item>
           <Menu.Item onClick={this.clickItem} key="r">
             Read Only
           </Menu.Item>
          </Menu>
        }
        className="invite-priority-dropdown"
        >
          <span>
            {this.state.priority}<Icon type="down" />
          </span>
        </Dropdown>
      </span>
    );
  }
}

class UserInviteTransfer extends Component {
  state = {
    mockData: [],
    targetKeys: [],
    priority: "rw"
  };

  filterOption = (inputValue, option) => {
    console.log(option.key)
    let inArr = false;
    let i;
    for (i = 0; i < this.state.targetKeys.length; i++) {
      if (this.state.targetKeys[i] == option.key) {
        inArr = true;
        break;
      }
    }
    return option.key.indexOf(inputValue) > -1 || inArr;
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  updatePriority = (key, val) => {
    let arr = this.state.mockData;
    let i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i]["key"] == key) {
        arr[i]["priority"] = val;
      }
    }
    this.setState({
      mockData: arr
    });
  }

  handleSearch = (dir, value) => {
    const _this = this;
    axios.get(window.url + '/user/search/',{
      params: {
        random_id: value
      }
    })
    .then((msg) => {
      if (msg.data["code"] == 1) {
        let users = msg.data["message"]
        let i;
        let mockData = []
        for (i = 0; i < this.state.mockData.length; i++) {
          let key = this.state.mockData[i].key;
          if (this.state.targetKeys.includes(key)) {
            mockData.push(this.state.mockData[i]);
          }
        }
        for (i = 0; i < users.length; i++) {
          let user = {
            key: users[i]["random_id"].toString(),
            title: (
                <>
                  <span className="invite-user-id">ID: {users[i]["random_id"]}</span>
                  <Avatar
                  shape="square"
                  size="small"
                  icon="user"
                  src={users[i]["avatar_url"]}
                  className="invite-user-avatar"/>
                  <span className="invite-user-alias">{users[i]["alias"]}</span>
                  <PrioritySelect mapKey={users[i]["random_id"].toString()} updatePriority={this.updatePriority}/>
                </>
            ),
            chosen: false,
            priority: "rw"
          }
          mockData.push(user);
        }
        console.log(mockData)
        _this.setState({
          mockData: mockData
        });
        console.log(this.state)
      } else if (msg.data["code"] == 2) {
         message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
         setTimeout(() => {
           window.location.reload();
         }, 300);
      } else {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
      }
    })
    .catch((error) => {
      message.error("Opps, server encounter internal error.");
      console.log(error);
    });

  };

  render() {
    return (
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        filterOption={this.filterOption}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        render={item => item.title}
        showSelectAll={false}
        listStyle={{
          width: 350,
          height: 300,
        }}
      />
    );
  }
}

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
        <Avatar shape="square" size={35} src={this.props.userInfo["avatar_url"]}/>
      </Popover>
    );
  }
}

class ProjectCard extends Component {
  state = {
    hover: false,
    rename: false,
    inviteVisiable: false,
    inviteLoading: false,
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
      } else if (msg.data["code"] == 2) {
         message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
         setTimeout(() => {
           window.location.reload();
         }, 300);
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
         } else if (msg.data["code"] == 2) {
           message.error("Error code" + msg.data["code"] + ": " + msg.data["message"]);
           setTimeout(() => {
             window.location.reload();
           }, 300);
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

  showInvite = () => {
    this.setState({
      inviteVisiable: true
    });
  }

  inviteCancel = () => {
    this.setState({
      inviteVisiable: false
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
            <Menu.Item key="3" onClick={this.showInvite}><Icon type="user-add" />Invite</Menu.Item>
            <Menu.Item key="4" onClick={this.copyUrl}><Icon type="share-alt" />Copy URL</Menu.Item>
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
                autoFocus
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
       <Modal
         visible={this.state.inviteVisiable}
         title="Add Collaborators into You Project"
         onOk={this.inviteOk}
         onCancel={this.inviteCancel}
         width={800}
         footer={[
           <Button key="back" onClick={this.inviteCancel}>
             Return
           </Button>,
           <Button key="submit" type="primary" loading={this.state.inviteLoading} onClick={this.inviteOk}>
             Submit
           </Button>,
         ]}
       >
         <UserInviteTransfer />
       </Modal>
      </Col>
    );
  }
}

class WorkBenchPage extends Component {
  constructor(props) {
    super(props);
    startTime = new Date();
    NProgress.start();
  }

  state = {
    userInfo: null,
    projectsInfo: [],
    emptyProject: false,
    nameValue: null,
    zipProject: false,
    fileList: [],
  };

  componentDidMount() {
    this.updateUserInfo();
    this.updateProjectInfo();
    let endTime = new Date();
    let timeInterval = endTime.getTime() - startTime.getTime();
    if (timeInterval <= 500){
      setTimeout(function(){
        NProgress.done();
      }, 500 - timeInterval);
    } else {
      NProgress.done();
    }
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
      } else {
        message.warn("Please login first.");
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
    if (this.state.nameValue == null || this.state.nameValue == "") {
      message.error("Project name is empty!");
      return;
    }
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
      } else if (msg.data["code"] == 2) {
        message.error("Error code " + msg.data["code"] + ": " + msg.data["message"]);
        setTimeout(() => {
          window.location.reload();
        }, 300);
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

  zipOk = () => {
    this.setState({
      zipProject: false,
      fileList: [],
    });
  }

  zipProject = () => {
    this.setState({
      zipProject:true
    });
  }

  onFileChange = (info) => {
    console.log(info);
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

  render() {
    const projects = this.state.projectsInfo.map((item, index) =>
      <ProjectCard projectInfo={item} updateProjectInfo={this.updateProjectInfo}/>
    );
    return(
      <Layout>
        <Header page='workbench' userInfo={this.state.userInfo} history={this.props.history}/>
        <Layout className="workbench-content">
        <Tabs tabBarExtraContent={
          <Dropdown overlay={
            <Menu>
              <Menu.Item onClick={this.emptyProject}>
                <Icon type="file" /> Empty Project
              </Menu.Item>
              <Menu.Item>
                <Link to="/templates/"><Icon type="book" /> Import from Templte</Link>
              </Menu.Item>
              <Menu.Item onClick={this.zipProject}>
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
          }>
           <TabPane tab={
             <><Icon type="project" /><span className="tab-title none-select">Projects</span></>
           } key="1">
             <div className="workbench-container">
               <Row gutter={[24, 24]}>
                 {projects}
               </Row>
             </div>
           </TabPane>
           <TabPane tab={
             <><Icon type="usergroup-add" /><span className="tab-title none-select">Invitations</span></>
           } key="2">
           </TabPane>
           </Tabs>
            <Modal
              title="New Project"
              visible={this.state.emptyProject}
              onOk={this.emptyOk}
              onCancel={this.emptyCancel}
            >
              <Input placeholder="name"
                value={this.state.nameValue}
                onChange={this.inputName}
                onPressEnter={this.emptyOk}
                autoFocus/>
            </Modal>
            <Modal
              title="New Project"
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
        </Layout>
      </Layout>
    );
  }
}

export default WorkBenchPage;
