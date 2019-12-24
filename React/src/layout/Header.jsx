import React, { Component } from 'react';
import { Row, Col, Button, Icon, Menu, Avatar, Dropdown, message } from 'antd';
import './css/custom.css';
import { Link } from "react-router-dom"
import axios from 'axios';


const { SubMenu } = Menu;

const headerStyle = {
  height: '64px',
  background: '#FFF',
  backgroundClip: 'border-box',
  boxShadow: 'inset 0px -15px 10px -22px #000',
  position: 'fixed',
  width: '100%',
  zIndex: 1
};

const logoStyle = {
  padding: '14px 15px',
  fontSize: '24px'
};

const githubButtonStyle = {
  height: '34px',
  margin: '15px 0 15px 0',
  marginLeft: '10px'
};

class UserAvatar extends Component {
  state = {
    mouse: false
  }
  onMouseEnter = () => {
    this.setState({
      mouse: true
    });
  }

  onMouseLeave = () => {
    this.setState({
      mouse: false
    });
  }

  logout = () => {
    const _this = this;
    axios.get(window.url + '/logout/')
    .then(function(msg) {
      message.success("Logout out successfully!");
      setTimeout(() => {
        _this.props.history.push('/workbench/');
        window.location.reload();
      }, 300);
    })
    .catch(function(error) {
      message.error(error);
    });
  }

  render() {
    return(
      <>
        {this.props.userInfo != null ? (
          <Dropdown overlay={
            <Menu className="dropdown-menu">
                <li className="dropdown-li none-select">Hello, <b>{this.props.userInfo["alias"]}</b></li>
                <Menu.Divider />
                <Menu.Item onClick={this.logout}><span className="grey" style={{fontSize: "15px"}}>Sign out</span></Menu.Item>
            </Menu>
          }>
            <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <Avatar className="avatar" shape="square" src={this.props.userInfo["avatar_url"]} />
              <Icon type="down"
              className="avatar-down"
              style={this.state.mouse ? ({
                color: "#1890ff"
              }):(null)
              }
              />
            </div>
          </Dropdown>
        ):(
          <Button style={githubButtonStyle} href={window.url + "/login/github/"}>
            <Icon type="github" /> Login with Github
          </Button>
        )}
      </>
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page
    }
  }

  componentDidMount() {
    // console.log(this.props.location.pathname);
  }
  render = () => (
    <header style={headerStyle}>
      <Row>
        <Col span={6}>
          <h2 style={logoStyle} class='none-select'>SUSTex</h2>
        </Col>
        <Col span={18}>
          <Row type="flex" justify="end">
            <Menu mode="horizontal"
            style={{height: "58px"}}
            className="top-nav"
            selectedKeys={[this.state.page]}
            >
              <Menu.Item key="workbench">
                <Link to="/workbench">Workbench</Link>
              </Menu.Item>
              <Menu.Item key="templates">
                <Link to="/templates">Templates</Link>
              </Menu.Item>
              {this.state.page == 'project' ? (
                <Menu.Item key="share">
                  <Link to="/share">Share</Link>
                </Menu.Item>
              ) : (null)}
            </Menu>
            <UserAvatar userInfo={this.props.userInfo} history={this.props.history}/>
            <Col span={1} />
          </Row>
        </Col>
      </Row>
    </header>
  );
}

export default Header;
