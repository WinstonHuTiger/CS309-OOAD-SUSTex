import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
import MarkdownRender from '../../components/MarkdownRender';
import MarkdownEditor from '../../components/MarkdownEditor';
import LatexEditor from '../../components/LatexEditor';
import { Resizable } from "re-resizable";
import '../css/custom.css';
const { Content } = Layout;
const contentStyle = {
  paddingTop: '64px',
  height: '100%',
  width: '100%'
};

var resizableStyle = {
  position: "relative",
  float: "left",
  width: "50%",
  height: "100%",
  transition: null
};

const layer = {
  position: 'absolute',
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#373b41',
  fontSize: '35px'
}

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      resize: false,
      max: false,
      min: false,
      maxWidth: "75%",
      minWidth: "25%",
      iconHover: false,
      resizeSize: null,
      hideRender: false,
      hide: false,
      defaultSize: {
        width: "50%",
        height: "100%"
      },
      showRightButton: false
    }
  }

  getEditorText = (text) => {
    this.setState({
      value: text
    });
  }

  showRender = () => {
    this.setState({
      hideRender: false,
      maxWidth: "75%",
      minWidth: "25%",
      resizeSize: {
        width: "70%",
        height: "100%"
      },
      hide: false
    });
    document.getElementById("editor").onmousemove = null;
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
             width: "100%",
             overflow: "hidden"
          }}>
              <Resizable
                id="editor"
                style={resizableStyle}
                size={this.state.resizeSize}
                defaultSize={this.state.defaultSize}
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
                minWidth={this.state.minWidth}
                maxWidth={this.state.maxWidth}
                handleClasses={{
                  right: "resize"
                }}
                handleStyles={{
                  right: {
                      left: "100%",
                      cursor: "ew-resize",
                      borderTop: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderWidth: 5,
                      background: "#FFF",
                      zIndex: 99,
                      width: 10,
                      boxShadow: "4px 0px 6px #e7e7e7",
                    },
                }}
                onResize={(e, dir, refToElement, delta) => {
                  if (this.state.resize != null) {
                    this.setState({
                      resizeSize: null
                    })
                  }
                  if(this.state.hide)
                    return;
                  let width = refToElement.style.width;
                  let hideIcon = document.getElementById("hideIcon");
                  if (hideIcon != null){
                    let pos = hideIcon.getClientRects()[0];
                    if (pos.left < e.clientX && e.clientX < pos.right &&
                        pos.top < e.clientY && e.clientY < pos.bottom) {
                      this.setState({
                        iconHover: true
                      });
                    } else {
                      this.setState({
                        iconHover: false
                      });
                    }
                  }
                  if (width >= "71%") {
                    this.setState({
                      max: true,
                    });
                  } else if (width <= "29%") {
                    this.setState({
                      min: true,
                    });
                  } else {
                    this.setState({
                      min: false,
                      max: false
                    });
                  }
                }}
                onResizeStop={(e, dir, refToElement, delta) => {
                  if (this.state.iconHover) {
                    if (this.state.max) {
                      this.setState({
                        resizeSize: {
                          width: "100%",
                          height: "100%"
                        },
                        maxWidth: "100%",
                        iconHover: false,
                        hideRender: true,
                        hide: true
                      });
                      document.getElementById("editor").onmousemove = (e) => {
                        if (document.body.offsetWidth - e.clientX <= 50 && !this.state.showRightButton) {
                          this.setState({
                            showRightButton: true
                          });
                        } else if (document.body.offsetWidth - e.clientX > 50 && this.state.showRightButton) {
                          this.setState({
                            showRightButton: false
                          });
                        }
                      }
                    } else {
                      this.setState({
                        resizeSize: {
                          width: "0%",
                          height: "100%"
                        },
                        minWidth: "0%",
                        iconHover: false,
                        hide: true
                      });
                    }
                  } else {
                    this.setState({
                      maxWidth: "75%",
                      minWidth: "25%",
                      resizeSize: null,
                      hide: false
                    });
                  }
                  this.setState({
                    max: false,
                    min: false
                  });
                }}
              >
              {this.state.min?
                (<div style={layer}>
                  <div
                    id="hideIcon"
                    className={this.state.iconHover? "hideIcon hover" : "hideIcon"}>
                    Hide
                  </div>
                 </div>):(null)}
                {this.props.mode === "markdown" ? (
                  <MarkdownEditor
                    updateFater={this.getEditorText}
                    blur={this.state.min}
                    text={this.state.value}
                    />
                ):(
                  <LatexEditor
                    updateFater={this.getEditorText}
                    blur={this.state.min}
                    text={this.state.value}
                    />
                )}
            </Resizable>
              {this.state.max?
                (<div style={{
                  position: 'absolute',
                  height: document.getElementById("render").getClientRects()[0].height,
                  width: document.getElementById("render").getClientRects()[0].width,
                  top: 0,
                  right: 0,
                  zIndex: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#373b41',
                  fontSize: '35px'
                }}>
                  <div
                    id="hideIcon"
                    className={this.state.iconHover? "hideIcon hover" : "hideIcon"}>
                    Hide
                  </div>
                 </div>):(null)}
                 <MarkdownRender
                   id="render"
                   className="markdown"
                   blur={this.state.max}
                   source={this.state.value}
                   hide={this.state.hideRender}
                   show={this.showRender}
                   showButton={this.state.showRightButton}
                 />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default MainContent;
