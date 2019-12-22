import React, { Component } from 'react';
import { Layout } from 'antd';
import Header from './Header';

class TemplatesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Layout>
        <Header page='templates'/>
      </Layout>
    );
  }
}

export default TemplatesPage;
