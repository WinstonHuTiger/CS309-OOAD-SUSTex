import React from 'react';

function MarkdownRender(props) {
  var md = require('markdown-it')(),
  mk = require('markdown-it-katex');
  md.use(mk);
  var result = md.render(props['source']);
  return (
      <article className="markdown-body" id="markdown" dangerouslySetInnerHTML={{__html: result}}>
      </article>
  );
}

export default MarkdownRender
