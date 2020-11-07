import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import Navbar from '../../../app/components/Navbar';

configure({ adapter: new Adapter() });

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
