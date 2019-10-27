import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button, Row, Col, Input, Popover } from 'antd';
import './custom.css';
import 'github-markdown-css/github-markdown.css';
import Scrollbars from 'react-custom-scrollbars';
import MarkdownRender from '../components/MarkdownRender';
import Lightbox from 'react-lightbox-component';
import './lightbox.css';
import MarkdownEditor from '../components/MarkdownEditor';
import LatexEditor from '../components/LatexEditor';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const ReactMarkdown = require('react-markdown');

class ProjectPage extends React.Component {
  state = {
    mode: "latex",
    isLoading: true,
    collapsed: true,
    modalIsOpen: true,
    value: "Meeting Minute\n===\n\n###### tags: `Templates` `Meeting`\n\n- **Location:** Room A\n- **Date:** Nov 1, 2030 2:30 PM (CET)\n- **Agenda**\n1. Walk through signup flow `45min`\n	> [name=Yukai]\n2. Sprint planning `45min`\n3. Revisit onboarding v1 `20min`\n- **Participants:**\n    - Max (MX)ddsdsfsdsdsdsdsdsassadqwdssdsdsdsdsasdsds\n    - Yukai (YK)\n    - Yuhsuan (YH)\n    - Arwen (YC)\n- **Contact:** Max <max@example.com>\n- **Host:** YK\n- **Reference:** - [Last week meeting minute](/s/template-meeting-note)\n\n\n## Walk through signup flow \n\n- [Slide to explain the flow](/p/slide-example)\n\n:dart: Sprint Goal\n---\n- Identify tasks that can help us raise conversion rate\n\n:books: Sprint Backlog\n---\n* Email invite feature\n* Interview users\n\n:mag: Sprint Retro\n---\n### What we can start Doing\n- [x] - New initiatives and experiments we want to start improving\n\n:closed_book: Tasks\n--\n==Importance== (1 - 5) / Name / **Estimate** (1, 2, 3, 5, 8, 13)\n### Development Team:\n- [ ] ==5== Email invite\n  - [x] ==4== Email registration page **5**\n  - [ ] ==5== Email invitees **3**\n- [ ] ==4== Setup e2e test in production **2**\n\n### Design Team:\n- [ ] ==4== Interview users **8**\n- [ ] ==5== Build roll-up display content **5**\n- [ ] ==5== Help user discover new features **5**\n\n## Notes \n<!-- Other important details discussed during the meeting can be entered here. -->\n\n$$\nx=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\n$$",
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { modalIsOpen } = this.state;
    const isCollapsed = this.state.collapsed;
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
    return (
      <Layout>
          <header id="header">
            <Row>
              <Col span={6}>
                <a href="#">
                  <h2 id="nav-brand">SUSTex</h2>
                </a>
              </Col>
              <Col span={4} push={15}>
                <Button style={{height: '34px', margin: '15px 0 15px 0'}}>
                  <Icon type="github" /> Login with Github
                </Button>
              </Col>
            </Row>
          </header>
        <Layout>
        <Sider collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
        collapsedWidth="0"
        trigger={null}>
          <Menu theme="light"
          mode="inline"
          defaultOpenKeys={['/img']}
          defaultSelectedKeys={['/markdown.md']}
          className="menu">
            <Button id="trigger" className={isCollapsed?"collapsed":"uncollapsed"} icon={isCollapsed?"right":"left"} shape="circle" onClick={this.toggle}/>
            <Search
              placeholder="Search File"
              onSearch={value => console.log(value)}
              style={{ width: '180px', margin: '10px' }}
            />
            <SubMenu
              key="/img"
              title={
                <span>
                  <Icon type="folder" />
                  <span>Img</span>
                </span>
              }
            >
              <Menu.Item key="/img/only_me.gif" style={{height: 'auto'}}>
              <Popover content={only_me} style={{padding: '0'}}>
                <Icon type="file-image" />only_me.gif
              </Popover>
              </Menu.Item>
              <Menu.Item key="/img/star_ocean.gif" style={{height: 'auto'}}>
              <Popover content={star_ocean} style={{padding: '0'}}>
                <Icon type="file-image" />star_ocean.gif
              </Popover>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="/markdown.md" className="file" onClick={this.markdownFile}>
              <Icon type="file-text" />markdown.md
            </Menu.Item>
            <Menu.Item key="/latex.tex" className="file" onClick={this.latexFile}>
              <Icon type="file-text" />latex.tex
            </Menu.Item>
          </Menu>
        </Sider>
          <Content id="content">
            <Row className="content-row">
            <Col
              span={24}
              style={{
                 height: "100%",
                 margin: 0,
                 padding: 0,
                 width: "100%"
              }}>
                {this.state.mode == "markdown" ? (
                  <MarkdownEditor
                    updateFater={this.getEditorText}
                    text={this.state.value}
                    />
                ):(
                  <LatexEditor
                    updateFater={this.getEditorText}
                    text={this.state.value}
                    />
                )}
                <MarkdownRender
                  className="markdown"
                  source={this.state.value}
                  />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
  getEditorText = (text) => {
    this.setState({
      value: text
    });
  }
  latexFile = () => {
    this.setState({
      value: "latex",
      mode: "latex"
    });
  }
  markdownFile = () => {
    this.setState({
      value: "markdown",
      mode: "markwodn"
    })
  }
}
export default ProjectPage;
