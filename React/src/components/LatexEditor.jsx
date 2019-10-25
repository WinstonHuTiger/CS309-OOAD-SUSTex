import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import React, { Component } from 'react';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import javascriptHint from 'codemirror/addon/hint/javascript-hint.js';
import CodeMirrorGrammar from '../tools/CodeMirrorGrammar';
import '../grammar/latex.js';


import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/theme/tomorrow-night-bright.css';

var codeMirror;
// 1. a partial latex grammar in simple JSON format
// 1. an almost complete python grammar in simple JSON format

class LatexEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }
  componentDidMount = () => {
    // 2. parse the grammar into a Codemirror syntax-highlight mode
    var latex_mode = CodeMirrorGrammar.getMode(global.constants.latex_grammar);
    // 3. use it with Codemirror
    CodeMirror.defineMode("latex", latex_mode);
    console.log(latex_mode)
    // enable user-defined code folding in the specification (new feature)
    latex_mode.supportCodeFolding = true;
    CodeMirror.registerHelper("fold", latex_mode.foldType, latex_mode.folder);
    // enable user-defined code matching in the specification (new feature)
    latex_mode.supportCodeMatching = true;
    latex_mode.matcher.options = {maxHighlightLineLength:1000}; // default
    CodeMirror.defineOption("matching", false, function( cm, val, old ) {
        if ( old && old != CodeMirror.Init )
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
    latex_mode.supportGrammarAnnotations = true;
    CodeMirror.registerHelper("lint", "latex", latex_mode.validator);
    // enable user-defined autocompletion (if defined)
    latex_mode.supportAutoCompletion = true;
    console.log(latex_mode.autocompleter)
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
        indentWithTabs: false,
        lint: true,  // enable lint validation
        matching: true,  // enable token matching, e.g braces, tags etc..
        extraKeys: {"Ctrl-Space": 'my_autocompletion', "Ctrl-L": "toggleComment", "Ctrl" : () => { console.log(CodeMirror.Pos(1, 2));}},
        foldGutter: true,
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
   codeMirror.on('change',() => {
     this.setState({
       text: codeMirror.getValue()
     });
     this.props.updateFater(this.state.text);
     CodeMirror.showHint(codeMirror, latex_mode.autocompleter, {prefixMatch:true, caseInsensitiveMatch:false});
   });
   codeMirror.markText({line: 1, ch: 2}, {line: 3, ch: 4}, {className: 'syntax-error', title: "data.error.message"})
  };
  ref = React.createRef();
  render = () => (
    <div ref={self => this.editor = self} />
  );
}

export default LatexEditor;
