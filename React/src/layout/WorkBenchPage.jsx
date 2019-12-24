import React, { Component } from 'react';
import { Layout, Menu, Icon, Card, Row, Col, Dropdown, Avatar, Popover, Divider } from 'antd';
import Header from './Header';
import axios from 'axios';

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

  render() {
    const users = this.props.projectInfo["users"].map((item, index) =>
      <UserAvatar userInfo={item}/>
    );
    return(
      <Col span={6}>
        <Dropdown overlay={
          <Menu className="project-card-menu">
            <Menu.Item key="3"><Icon type="edit" />Rename</Menu.Item>
            <Menu.Item key="4"><Icon type="delete" />Delete</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><Icon type="info-circle" />Members</Menu.Item>
            <Menu.Item key="3"><Icon type="user-add" />Invite</Menu.Item>
            <Menu.Item key="2"><Icon type="share-alt" />Copy Url</Menu.Item>
            <Menu.Item key="3"><Icon type="download" />Download</Menu.Item>
          </Menu>
          } trigger={['contextMenu']}>
          <Card title={
            <div className="project-title none-select">
              {this.props.projectInfo["name"]}
            </div>
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
  }

  state = {
    userInfo: null,
    projectsInfo: []
  };

  componentDidMount() {
    const _this = this;
    axios.get(window.url + '/user/')
    .then((msg) => {
      if (msg.data["code"] == 1) {
        _this.setState({
          userInfo: msg.data["message"]
        });
      } else if (msg.data["code"] == 2) {

      }
    })
    .catch(function(error) {
      console.log(error);
    });
    axios.get(window.url + '/user/projects/')
    .then((msg) => {
      _this.setState({
        projectsInfo: msg.data["message"]
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const projects = null;
    if (this.state.projectsInfo.lenght > 0) {
      projects = this.state.projectsInfo.map((item, index) =>
        <ProjectCard projectInfo={item} />
      );
    }
    return(
      <Layout>
        <Header page='workbench' userInfo={this.state.userInfo} history={this.props.history}/>
        <Layout className="workbench-content">
          <Menu selectedKeys={["0"]} mode="horizontal" className="workbench-menu">
            <Menu.Item key="0">
              <Icon type="project" />
              Projects
            </Menu.Item>
          </Menu>
          <div className="workbench-container">
            {projects}
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default WorkBenchPage;
