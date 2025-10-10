import React from 'react';
let classes = require('./Footer.module.scss');

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return <footer className={classes.footer}>© {year} Discover Israel</footer>;
};

export default Footer;
