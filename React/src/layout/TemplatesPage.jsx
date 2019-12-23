import React, { Component } from 'react';
import Header from './Header';
import { HashLink as Link } from 'react-router-hash-link';
import { Menu, Icon, Breadcrumb, Row, Col, Typography, Divider, message } from 'antd';
import { Skeleton, Switch, Card, Avatar, Button } from 'antd';
import { Layout } from 'antd';
import axios from 'axios';

const { Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const { SubMenu } = Menu;
const { Meta } = Card;

var category_idx = 0;
var idx = 0;

class LeftMenu extends Component {
  state = {
    index: 0
  };

  handleClick = (e) => {
    console.log('click ', e);
  };

  render() {
    return (
      <Menu
        className="templates-left-menu"
        onClick={this.handleClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <h1>Templates</h1>
          }
        >
          {
            this.props.data.map(function (item, index) {
            return (
              <Menu.ItemGroup key={category_idx++} title={item["category"]}>
              {item["list"].map(function (item_, index_) {
                return (
                  <Menu.Item key={idx++}>
                    <Link to={"/templates#" + item_["title"]}>{item_["title"]}</Link>
                  </Menu.Item>
                );
              })}
              </Menu.ItemGroup>
            );
          })}
        </SubMenu>
      </Menu>);
  }
}

class TemplateCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: props.path,
      title: props.title,
      reference: props.reference,
    };
  }

  state = {
    show: false,
    loading: true
  };

  onChange = checked => {
     this.setState({ loading: !checked });
   };

  show = () => {
    this.setState({
      show: true
    })
  }

  hide = () => {
    this.setState({
      show: false
    })
  }

  handleImport = () => {

  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }

  render() {
    const { loading } = this.state;
    return(
      <div id={this.state.title}>
        <Row>
          <Card
          onMouseOver={this.show}
          onMouseOut={this.hide}
          cover={<>
            <img
            className="templates-content-preview"
            src={this.state.path + '/preview.png'} />
            <div>
              <div className="templates-content-btns"
                style={{
                  opacity: this.state.show ? 1 : 0,
                 }}>
                <Button shape="round" icon="file-pdf" size='medium' style={{marginRight: "10px"}}
                  href={this.state.path + '/main.pdf'} target="_blank">
                  View PDF
                </Button>
                <Button shape="round" icon="project" size="medium" onClick={this.handleImport}>
                  Import
                </Button>
              </div>
            </div>
            <p></p>
          </>}
          >
          <Meta title={this.state.title}
          description={
            <>
            Retrieve from: <a href={this.state.reference} target="_blank">{this.state.reference}</a>
            </>} />
          </Card>
        </Row>
      </div>
    );
  }
}

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props.data["category"],
      list: props.data["list"],
    }
  }

  scrollToAnchor = (anchorName) => {
    if (anchorName) {
        let anchorElement = document.getElementById(anchorName);
        if(anchorElement) { anchorElement.scrollIntoView(); }
    }
  }

  render() {
    const cards = this.state.list.map((item, index) =>
        <Col span={8}>
          <TemplateCard
            title={item["title"]}
            path={window.url + '/static/LaTex/' + this.state.category + '/'
            + item['title']}
            reference={item["reference"]}/>
        </Col>
    );
    console.log(cards)
    return(
      <>
        <h2 id={this.state.category}>
          <span className="subtitle">{this.state.category}</span>
          <Link className="anchor"
            to={"/templates#" + this.state.category}>#</Link>
        </h2>
        <Row gutter={[32, 32]}>
          {cards}
        </Row>
      </>
    );
  }
}

class Content extends Component {

  render() {
    const contentList = this.props.data.map((item, index) =>
      <>
        <Template data={item} />
        <Divider />
      </>
    );
    return(
      <div className="templates-content-text">
        <h1>Templates</h1>
        <p>Quickly import templates into your own projects.</p>
        {contentList}
      </div>
    );
  }
}

class TemplatesPage extends Component {
  constructor(props) {
    super(props);
    console.log(props.match)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    const _this = this;
    axios.get(window.url + '/templates/latex/')
    .then(function(msg) {
      var i;
      var arr = msg.data;
      for(i = 0; i < arr.length; i++) {
        if (arr[i]["category"] == "Other") {
          arr[i] = arr.splice(msg.data.length - 1, 1, arr[i])[0];
        }
      }
      _this.setState({
        data: msg.data
      });
      console.log("")
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  render() {
    return(
      <Layout>
        <Header page='templates'/>
        <Layout>
          <Row style={{marginTop: "64px"}}>
            <Col span={4}>
              <LeftMenu data={this.state.data}/>
            </Col>
            <Col span={20}>
              <Layout.Content className="templates-content">
                <Content data={this.state.data}/>
              </Layout.Content>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}

export default TemplatesPage;
