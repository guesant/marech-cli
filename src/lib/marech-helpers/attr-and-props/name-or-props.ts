const regExp = require('../../regexp/all');

// Get name or args by <Marech@...>
const nameOrProps = (mode, text) => {
  // Name (+ properties)
  const nameAndProps = text.match(regExp.marechTagAttr)[1];
  // Name
  const name = nameAndProps.split(' ')[0];
  // Props
  const props = nameAndProps.slice(name.length + 1).trim();

  if (mode === 'name') {
    return name;
  }
  if (mode === 'props') {
    return props;
  }

  return '';
};

module.exports = nameOrProps;