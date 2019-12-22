import React, { Component } from 'react';
import { Layout } from 'antd';
import Header from './Header';

class WorkBenchPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Layout>
        <Header page='workbench'/>
      </Layout>
    );
  }
}

export default WorkBenchPage;
