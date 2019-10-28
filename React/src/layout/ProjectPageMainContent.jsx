import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
import MarkdownRender from '../components/MarkdownRender';
import MarkdownEditor from '../components/MarkdownEditor';
import LatexEditor from '../components/LatexEditor';
import { Resizable } from "re-resizable";

const { Content } = Layout;
const contentStyle = {
  paddingTop: '64px',
  height: '100%',
  width: '100%'
};

const resizable_style = {
  position: "relative",
  float: "left",
  width: "50%",
  height: "100%"
};

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  getEditorText = (text) => {
    this.setState({
      value: text
    });
  }

  render() {
    return(
      <Content style={contentStyle}>
        <Row className="content-row">
        <Col
          span={24}
          style={{
             height: "100%",
             margin: 0,
             padding: 0,
             width: "100%"
          }}>
          <Resizable
            style={resizable_style}
            defaultSize={{
              width: "50%",
              height: "100%"
            }}
            enable={{
              top:false,
              right:true,
              bottom:false,
              left:false,
              topRight:false,
              bottomRight:false,
              bottomLeft:false,
              topLeft:false
            }}
            minWidth="25%"
            maxWidth="75%"
            handleStyles={{
              right: {
                  marginLeft: -7,
                  left: "100%",
                  cursor: "ew-resize",
                  borderTop: "none",
                  borderLeft: "none",
                  borderBottom: "none",
                  borderWidth: 5,
                  borderColor: "@almost-white",
                  width: 10,
                  boxShadow: "3px 0px 6px #e7e7e7",
                },
            }}
          >
          {this.props.mode == "markdown" ? (
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
        </Resizable>
            <MarkdownRender
              className="markdown"
              source={this.state.value}
              />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default MainContent;
