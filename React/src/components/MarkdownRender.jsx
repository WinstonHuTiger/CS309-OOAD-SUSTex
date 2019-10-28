import React from 'react';
import 'github-markdown-css/github-markdown.css';
import { Button } from 'antd';

function MarkdownRender(props) {
  let id = props.id;
  let md = require('markdown-it')(),
  mk = require('markdown-it-katex');
  md.use(mk);
  let result = md.render(props['source']);
  let collapsed = "collapsed";
  let style = {
    position: "absoulte",
    right: 0,
    width: "auto",
    overflow: "auto",
    padding: "45px"
  };
  const triggerStyle = {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: '999',
    background: '#FFF',
    width: '20px',
    height: '50px',
    borderRadius: '  0 100% 100% 0/50%  ',
    opacity: '0.5',
    transform: 'rotate(180deg)'
    // borderRight: '0px',
  };
  return (
      <>
        <Button
          id="trigger"
          style={props.hide?triggerStyle:({ display: "none" })}
          icon="right"
          shape="circle"
          onClick={props.show}/>
        <article
          id={id}
          className={props.blur?"markdown-body blur":"markdown-body"}
          style={props.hide?null:style}
          dangerouslySetInnerHTML={{__html: result}}>
        </article>
      </>
  );
}

export default MarkdownRender
