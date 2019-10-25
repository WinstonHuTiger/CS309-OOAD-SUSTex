import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/mode/javascript/javascript.js';
import React, { Component } from 'react';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import javascriptHint from 'codemirror/addon/hint/javascript-hint.js';
var codeMirror;
class Editor extends Component {
  componentDidMount = () => {
    codeMirror = CodeMirror(this.editor, {
     mode: 'markdown',
     lineNumbers: true,
     indentWithTabs: true,
     lineWrapping: true,
     indentWithTabs: true
   });
   CodeMirror.registerHelper("hint","javascript", javascriptHint);
   codeMirror.on('change', function() {
       codeMirror.showHint();  //满足自动触发自动联想功能
     });
  };
  ref = React.createRef();
  render = () => (
    <div ref={self => this.editor = self} />
  );
}

export default Editor;
