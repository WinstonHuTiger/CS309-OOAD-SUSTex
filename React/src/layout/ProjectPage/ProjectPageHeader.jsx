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

  render = () => (
    <header style={headerStyle}>
      <Row>
        <Col span={6}>
          <h2 style={logoStyle}>SUSTex</h2>
        </Col>
        <Col span={6} push={12}>
          <Row type="flex" justify="end">
            <Button style={githubButtonStyle}>
              <Icon type="github" /> Login with Github
            </Button>
            <Col span={2} />
          </Row>
        </Col>
      </Row>
    </header>
  );
}

export default Header;
