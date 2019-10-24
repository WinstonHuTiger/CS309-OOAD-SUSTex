import React from 'react';
import './Editor.css';
import { Button } from 'antd';

class Editor extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      arr: [
        {
        lineNumber: 1,
        content: 'Hello World!'
        },
        {
        lineNumber: 2,
        content: 'Hello World!'
        },
        {
        lineNumber: 3,
        content: 'Hello World!'
        },
      ]
    };
  }

  render() {
    return (
      <div id="editor">
        <div id="tools">
          <Button icon="bold" className="toolsButton" />
          <Button icon="italic" className="toolsButton" />
          <Button icon="underline" className="toolsButton" />
          <Button icon="strikethrough" className="toolsButton" />
        </div>
        <div style={{height: '100%', display: 'flex'}}>
          <div id="numCol" />
          <div id="inputContent">
            <div class="inputRow">
              <div class="lineNumber">1</div>
              <pre class="content">
                <span>Hello World!!!</span>
              </pre>
            </div>
          </div>
        </div>
        <div class="infoRow">
          第7行，第一列——共7行
        </div>
      </div>
    );
  }
}

export default Editor;
