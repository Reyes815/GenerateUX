import React from 'react';

const Iframe = ({ content, style }) => (
  <iframe
    srcDoc={content}
    style={style}
    sandbox="allow-scripts"
    frameBorder="0"
  />
);

export default Iframe;
