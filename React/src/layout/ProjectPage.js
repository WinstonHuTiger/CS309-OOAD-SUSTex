import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button, Row, Col, Input, Popover } from 'antd';
import 'github-markdown-css/github-markdown.css';
import Scrollbars from 'react-custom-scrollbars';
import NProgress from '../tools/nprogress';
import ProjectPageHeader from './ProjectPageHeader';
import ProjectPageFileManagement from './ProjectPageFileManagement';
import ProjectPageMainContent from './ProjectPageMainContent';
import MarkdownRender from '../components/MarkdownRender';
import MarkdownEditor from '../components/MarkdownEditor';
import LatexEditor from '../components/LatexEditor';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const ReactMarkdown = require('react-markdown');

const contentStyle = {
  paddingTop: '64px',
  height: '100%',
  width: '100%'
};

var startTime;
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "latex",
      value: "Meeting Minute\n===\n\n###### tags: `Templates` `Meeting`\n\n- **Location:** Room A\n- **Date:** Nov 1, 2030 2:30 PM (CET)\n- **Agenda**\n1. Walk through signup flow `45min`\n	> [name=Yukai]\n2. Sprint planning `45min`\n3. Revisit onboarding v1 `20min`\n- **Participants:**\n    - Max (MX)ddsdsfsdsdsdsdsdsassadqwdssdsdsdsdsasdsds\n    - Yukai (YK)\n    - Yuhsuan (YH)\n    - Arwen (YC)\n- **Contact:** Max <max@example.com>\n- **Host:** YK\n- **Reference:** - [Last week meeting minute](/s/template-meeting-note)\n\n\n## Walk through signup flow \n\n- [Slide to explain the flow](/p/slide-example)\n\n:dart: Sprint Goal\n---\n- Identify tasks that can help us raise conversion rate\n\n:books: Sprint Backlog\n---\n* Email invite feature\n* Interview users\n\n:mag: Sprint Retro\n---\n### What we can start Doing\n- [x] - New initiatives and experiments we want to start improving\n\n:closed_book: Tasks\n--\n==Importance== (1 - 5) / Name / **Estimate** (1, 2, 3, 5, 8, 13)\n### Development Team:\n- [ ] ==5== Email invite\n  - [x] ==4== Email registration page **5**\n  - [ ] ==5== Email invitees **3**\n- [ ] ==4== Setup e2e test in production **2**\n\n### Design Team:\n- [ ] ==4== Interview users **8**\n- [ ] ==5== Build roll-up display content **5**\n- [ ] ==5== Help user discover new features **5**\n\n## Notes \n<!-- Other important details discussed during the meeting can be entered here. -->\n\n$$\nx=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\n$$",
    };
  }

  componentWillMount() {
    startTime = new Date();
    NProgress.start();
  }

  componentDidMount() {
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

  changeMode = (mode) => {
    this.setState({
      mode: mode
    });
  }

  render() {
    return (
      <Layout>
          <ProjectPageHeader />
        <Layout>
          <ProjectPageFileManagement
            changeMode={this.changeMode}
            />
          <ProjectPageMainContent
            mode={this.state.mode}
            value={this.state.value}
            />
        </Layout>
      </Layout>
    );
  }
}
export default ProjectPage;
