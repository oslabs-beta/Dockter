import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Navbar from '../../../app/components/Navbar';

describe('Navbar component', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<Navbar />);
  });

  it('should match exact snapshot', () => {
    const tree = renderer.create(<Navbar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
