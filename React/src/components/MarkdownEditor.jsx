import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/mode/javascript/javascript.js';
import React, { Component } from 'react';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/show-hint.css';
import javascriptHint from 'codemirror/addon/hint/javascript-hint.js'

var codeMirror;
const blur = {
  boxShadow: "inset 0 0 2000px rgba(255, 255, 255, .5)",
  filter: "blur(10px)",
  transition: "all 0.3s ease-out"
};
class MarkdownEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      id: this.props.id
    };
  }
  componentDidMount = () => {
    codeMirror = CodeMirror(this.editor, {
     mode: 'markdown',
     lineNumbers: true,
     indentWithTabs: true,
     lineWrapping: true,
     value: this.state.text
   });
   CodeMirror.registerHelper("hint","javascript", javascriptHint);
   codeMirror.on('change',() => {
     this.setState({
       text: codeMirror.getValue()
     });
     this.props.updateFater(this.state.text);
   });
  };
  ref = React.createRef();
  render = () => (
    <div
      ref={self => this.editor = self}
      id={this.state.id}
      style={this.props.blur?blur:null}
       />
  );
}

export default MarkdownEditor;
