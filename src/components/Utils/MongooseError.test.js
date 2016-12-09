/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import MongooseError from './MongooseError';

describe('components utils MongooseError', () => {
  it('render the message of the error', () => {

    const wrapper = render(
      <MongooseError error={{ message: 'toto' }} />,
    );
    expect(wrapper.text()).to.equal('toto');
  });

  it('render nothing is no error', () => {
    const wrapper = render(
      <MongooseError />,
    );
    expect(wrapper.html()).to.equal('');
  });
});
