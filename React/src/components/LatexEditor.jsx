/* eslint  no-unused-vars: "off" */
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
import { Select } from 'antd';

const { Option } = Select;
var codeMirror;
const blur = {
  boxShadow: "inset 0 0 2000px rgba(255, 255, 255, .5)",
  filter: "blur(10px)",
  transition: "all 0.3s ease-out"
};
function concatenate(item, start) {
  let str = item.start;
  let tab = "";
  for (var y = 0; y < start; y++) {
    tab += "\t";
  }
  if (item.items) {
    for (var x = 0; x < item.items.length; x++) {
      str += "\n" + tab + "\t" + item.items[x];
    }
  } else if (str !== "\\usepackage{}" && str !== "\\end{}") {
    str += "\n" + tab + "\t";
  }
  if (item.end){
    str += "\n" + tab + item.end;
  }
  return str;
}

function html_escaper_entities( c )
{
    return '&' === c
        ? '&amp;'
        :(
        '<' === c
        ? '&lt;'
        : (
        '>' === c
        ? '&gt;'
        : (
        '"' === c
        ? '&quot;'
        : '&apos;'
        )))
    ;
}

var html_special_re = /[&"'<>]/g;

function esc_html( s, entities )
{
    return s.replace(html_special_re, entities ? html_escaper_entities : html_escaper);
}

function html_escaper( c )
{
    return "&#" + c.charCodeAt(0) + ";";
}

function autocomplete_renderer( elt, data, cmpl )
{
    var word = cmpl.name, type = cmpl.meta, p1 = cmpl.start, p2 = cmpl.end,
        padding = 5;
    elt.innerHTML = [
        '<span class="cmg-autocomplete-keyword">',
        '<strong class="cmg-autocomplete-keyword-match">', esc_html( word.slice(p1,p2) ), '</strong>',
        esc_html( word.slice(p2) ), '</span>',
        new Array(1+padding).join('&nbsp;'),
        '<strong class="cmg-autocomplete-keyword-meta">', esc_html( type ), '</strong>',
        '&nbsp;'
    ].join('');
    // adjust to fit keywords
    elt.className = (elt.className&&elt.className.length ? elt.className+' ' : '') + 'cmg-autocomplete-keyword-hint';
    elt.style.position = 'relative'; //elt.style.boxSizing = 'border-box';
    elt.style.width = '100%'; elt.style.maxWidth = '120%';
}

function autocompleter(cm, options) {
  let cursor = cm.getCursor();
  let line = cursor.line;
  let token = getToken(cm);
  let from = {
    line: line,
    ch: token.start
  };
  let to = {
    line: line,
    ch: token.end
  };
  let list = {
    from: from,
    list: [],
    to: to
  };
  for (var x = 0; x < global.constants.latex_autocomplete.length; x++) {
    let item = global.constants.latex_autocomplete[x];
    if (prefixMatch(item.start, token.string) && token.string.length !== 0) {
      let str = concatenate(item, token.start);
      let push = {
        text: str,
        name: item.name,
        meta: "",
        match: token.string,
        render: autocomplete_renderer,
        start: token.start,
        end: token.end,
      };
      push["lineOffset"] = item.jumpto.line;
      push["chOffset"] = item.jumpto.ch;
      list.list.push(push);
    }
  }
  return list;
};

function prefixMatch(match, str) {
  if (str.length > match.length) {
    return false;
  } else {
    for (var x = 0; x < str.length; x++) {
      if (str[x] !== match[x]) {
        return false;
      }
    }
  }
  return true;
}

function getToken(cm) {
  let pos = cm.getCursor();
  let lineContent = cm.getLine(pos.line);
  let end = pos.ch;
  let start = 0;
  for (let x = end - 1; x >= 0; x--) {
    if (lineContent.charAt(x) === " ") {
      start = x + 1;
      break;
    }
  }
  let string = "";
  for (let x = start; x <= end; x++) {
    string += lineContent.charAt(x);
  }
  return {
    start: start,
    end: end,
    string: string
  };
}

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
        extraKeys: {"Ctrl-Space": 'my_autocompletion', "Ctrl-L": "toggleComment"},
        foldGutter: true,
        theme: "base16-tomorrow-light",
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        value: this.state.text
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
     if (cm.state.completionActive) {
       if (cm.state.completionActive.data.list.length === 0) {
         cm.state.completionActive.close();
       }
     }
     let boolean = false;
     if (!cm.state.completionActive && pos["ch"] - 1 >= 0 ) {
       let token = getToken(cm);
       for (var x = 0; x < global.constants.latex_autocomplete.length; x++) {
         if (prefixMatch(global.constants.latex_autocomplete[x].name, token.string)) {
           boolean = true;
           break;
         }
       }
      let lastChar = cm.getLine(pos.line).charAt(pos.ch - 2);
      let nextChar = cm.getLine(pos.line).charAt(pos.ch);
      if (nextChar === "}" || nextChar === "]") {
        boolean = false;
      }
      if (boolean) {
        CodeMirror.showHint(cm, autocompleter, {completeSingle: false});
      }else if (lastChar === "\\" || lastChar === "(" || lastChar === "{" || lastChar === "[") {
        CodeMirror.showHint(cm, latex_mode.autocompleter, {prefixMatch:true, caseInsensitiveMatch:false, completeSingle: false});
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
