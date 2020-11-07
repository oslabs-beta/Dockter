import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FilterOptions from '../../../app/components/FilterOptions';

describe('FilterOptions component', () => {
  let selection = '';
  const setSelection = (newSelection) => (selection = newSelection);

  let isOpen = false;
  const setIsOpen = () => (isOpen = false);

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <FilterOptions setSelection={setSelection} setIsOpen={setIsOpen} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
