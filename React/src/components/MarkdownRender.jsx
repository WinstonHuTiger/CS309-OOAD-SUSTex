import React from 'react';

function MarkdownRender(props) {
  var md = require('markdown-it')(),
  mk = require('markdown-it-katex');
  md.use(mk);
  var result = md.render(props['source']);
  const style = {
    position: "absoulte",
    right: 0,
    width: "auto",
  };
  return (
      <article
        className="markdown-body"
        id="markdown"
        style={style}
        dangerouslySetInnerHTML={{__html: result}}>
      </article>
  );
}

export default MarkdownRender
