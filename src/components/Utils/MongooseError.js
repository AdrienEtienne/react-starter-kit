import React from 'react';

const MongooseError = ({ error }) => {
  let html = null;
  if (error) {
    html = (<p>{error.message}</p>);
  }
  return html;
};

MongooseError.propTypes = {
  error: React.PropTypes.object,
};

export default MongooseError;
