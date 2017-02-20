import React from 'react';

const MongooseError = ({ error }) => {
  let html = null;
  if (error) {
    html = (<p>{error.message}</p>);
  }
  return html;
};

MongooseError.propTypes = {
  error: React.PropTypes.shape({
    message: React.PropTypes.string.isRequired,
  }),
};

export default MongooseError;
