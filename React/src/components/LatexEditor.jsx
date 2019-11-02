import CodeMirror from 'codemirror/lib/codemirror.js';
import React, { Component } from 'react';
import CodeMirrorGrammar from '../tools/CodeMirrorGrammar';
import '../tools/show-hint.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/foldgutter.css';
import '../grammar/latex.js';
import './editor-theme/base16-tomorrow-light.less';
import CodeMirrorSpellChecker from 'codemirror-spell-checker';
import AutoComplete from './AutoComplete';

var codeMirror;
const blur = {
  boxShadow: "inset 0 0 2000px rgba(255, 255, 255, .5)",
  filter: "blur(10px)",
  transition: "all 0.3s ease-out"
};
class LatexEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      id: this.props.id,
      autoComplete: false,
      cursorLeft: 0,
      cursorTop: 0,
    };
  }
  componentDidMount = () => {
    var latex_mode = CodeMirrorGrammar.getMode(global.constants.latex_grammar, null, CodeMirror);
    CodeMirrorSpellChecker({
    	codeMirrorInstance: CodeMirror,
    });
    CodeMirror.defineMode("latex", latex_mode);
    latex_mode.supportCodeFolding = true;
    CodeMirror.registerHelper("fold", latex_mode.foldType, latex_mode.folder);
    latex_mode.supportCodeMatching = true;
    latex_mode.matcher.options = {maxHighlightLineLength:1000}; // default
    CodeMirror.defineOption("matching", false, function( cm, val, old ) {
        if ( old && old !== CodeMirror.Init )
        {
            cm.off( "cursorActivity", latex_mode.matcher );
            latex_mode.matcher.clear( cm );
        }
        if ( val )
        {
            cm.on( "cursorActivity", latex_mode.matcher );
            latex_mode.matcher( cm );
        }
    });
    // enable syntax lint-like validation in the grammar
    // latex_mode.supportGrammarAnnotations = true;
    // CodeMirror.registerHelper("lint", "latex", latex_mode.validator);
    // enable user-defined autocompletion (if defined)
    latex_mode.supportAutoCompletion = true;
    CodeMirror.commands['my_autocompletion'] = function( cm ) {
        CodeMirror.showHint(cm, latex_mode.autocompleter, {prefixMatch:true, caseInsensitiveMatch:true});
    };
    // this also works (takes priority if set)
    latex_mode.autocompleter.options = {prefixMatch:true, caseInsensitiveMatch:false};
    // or for context-sensitive autocompletion, extracted from the grammar
    latex_mode.autocompleter.options = {prefixMatch:true, caseInsensitiveMatch:false, inContext:true};
    // or for dynamic (context-sensitive) autocompletion, extracted from user actions
    latex_mode.autocompleter.options = {prefixMatch:true, caseInsensitiveMatch:false, inContext:true|false, dynamic:true};
    codeMirror = CodeMirror(this.editor, {
        mode: "latex",
        lineNumbers: true,
        indentUnit: 4,
        indentWithTabs: true,
        lint: true,  // enable lint validation
        matching: true,  // enable token matching, e.g braces, tags etc..
        extraKeys: {"Ctrl-Space": 'my_autocompletion', "Ctrl-L": "toggleComment", "Ctrl" : () => { console.log(CodeMirror.Pos(1, 2));}},
        foldGutter: true,
        theme: "base16-tomorrow-light",
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        value: this.state.text
    });
   codeMirror.on('blur', () => {
     CodeMirror.showHint(codeMirror, latex_mode.autocompleter, {prefixMatch:false, caseInsensitiveMatch:false, completeSingle: false});
   });
   codeMirror.on('change',() => {
     let start = codeMirror.getTokenAt(codeMirror.getCursor())["start"];
     let position = codeMirror.cursorCoords({ line: codeMirror.getCursor()["line"], ch: start });
     this.setState({
       autoComplete: true,
       cursorLeft: position.left,
       cursorTop: position.bottom
     });
     this.setState({
       text: codeMirror.getValue()
     });
     this.props.updateFater(this.state.text);
   });
   codeMirror.on("keyup", (cm, event) => {
     let pos = cm.getCursor();
     if (!cm.state.completionActive && pos["ch"] - 1 >= 0 ) {        /*Enter - do not open autocomplete list just after item has been selected in it*/
        let char = cm.getTokenAt(cm.getCursor())["string"];
        if (char === "\\" || char === "(" || char === "{" || char === "[") {
          // let position = cm.getCursor("true");
          // this.setState({
          //   autoComplete: true,
          //   cursorLeft: position.left,
          //   cursorTop: position.top
          // });
          CodeMirror.showHint(cm, latex_mode.autocompleter, {prefixMatch:false, caseInsensitiveMatch:false, completeSingle: false});
        }
     }
   });
  };
  ref = React.createRef();
  render = () => (
    <>
      <div
        ref={self => this.editor = self}
        id={this.state.id}
        style={this.props.blur?blur:null}
         />
    </>
  );
}
// <AutoComplete
//   display={this.state.autoComplete}
//   left={this.state.cursorLeft}
//   top={this.state.cursorTop - 5}
//   />
export default LatexEditor;
