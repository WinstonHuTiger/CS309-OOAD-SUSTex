import React from 'react';
import { Layout, message } from 'antd';
import axios from 'axios';
import NProgress from '../tools/nprogress';
import Header from './Header';
import ProjectPageFileManagement from './ProjectPage/ProjectPageFileManagement';
import ProjectPageMainContent from './ProjectPage/ProjectPageMainContent';

var startTime;
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      mode: "latex",
      value: "Meeting Minute\n===\n\n###### tags: `Templates` `Meeting`\n\n- **Location:** Room A\n- **Date:** Nov 1, 2030 2:30 PM (CET)\n- **Agenda**\n1. Walk through signup flow `45min`\n	> [name=Yukai]\n2. Sprint planning `45min`\n3. Revisit onboarding v1 `20min`\n- **Participants:**\n    - Max (MX)ddsdsfsdsdsdsdsdsassadqwdssdsdsdsdsasdsds\n    - Yukai (YK)\n    - Yuhsuan (YH)\n    - Arwen (YC)\n- **Contact:** Max <max@example.com>\n- **Host:** YK\n- **Reference:** - [Last week meeting minute](/s/template-meeting-note)\n\n\n## Walk through signup flow \n\n- [Slide to explain the flow](/p/slide-example)\n\n:dart: Sprint Goal\n---\n- Identify tasks that can help us raise conversion rate\n\n:books: Sprint Backlog\n---\n* Email invite feature\n* Interview users\n\n:mag: Sprint Retro\n---\n### What we can start Doing\n- [x] - New initiatives and experiments we want to start improving\n\n:closed_book: Tasks\n--\n==Importance== (1 - 5) / Name / **Estimate** (1, 2, 3, 5, 8, 13)\n### Development Team:\n- [ ] ==5== Email invite\n  - [x] ==4== Email registration page **5**\n  - [ ] ==5== Email invitees **3**\n- [ ] ==4== Setup e2e test in production **2**\n\n### Design Team:\n- [ ] ==4== Interview users **8**\n- [ ] ==5== Build roll-up display content **5**\n- [ ] ==5== Help user discover new features **5**\n\n## Notes \n<!-- Other important details discussed during the meeting can be entered here. -->\n\n$$\nx=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\n$$",
    };
  }

  componentWillMount() {
    const _this = this;
    startTime = new Date();
    console.log("GET" + window.url + '/user/');
    axios.get(window.url + '/user/',
    {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
    )
    .then(function (response) {
      console.log(response)
      message.success('Login Successfully!')
      _this.setState({
        users: response.data,
      });
    })
    .catch(function (error) {
      console.log(error);
      _this.setState({
        users: null,
      })
    })
    NProgress.start();
  }

  componentDidMount() {
    console.log(this.props.match.params)
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
          <Header page="project"/>
        <Layout
          style={{
            marginTop: "64px"
          }}>
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
