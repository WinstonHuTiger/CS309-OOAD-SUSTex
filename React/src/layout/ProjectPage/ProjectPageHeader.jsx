import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import '../css/custom.css';

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
  margin: '15px 0 15px 0'
};

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render = () => (
    <header style={headerStyle}>
      <Row>
        <Col span={6}>
          <a href="#">
            <h2 style={logoStyle}>SUSTex</h2>
          </a>
        </Col>
        <Col span={4} push={15}>
          <Button style={githubButtonStyle}>
            <Icon type="github" /> Login with Github
          </Button>
        </Col>
      </Row>
    </header>
  );
}

export default Header;
