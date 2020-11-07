import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FilterInput from '../../../app/components/FilterInput';

describe('FilterInput component', () => {
  // TODO: Update to match new schema
  let filterOptions = {
    container_id: [],
    container_name: [],
    container_image: [],
    status: [],
    stream: [],
    timestamp: {
      from: '',
      to: '',
    },
    host_ip: [],
    host_port: [],
    log_level: [],
  };

  const setFilterOptions = (newState) => {
    filterOptions = newState;
  };

  let selection = '';

  let userInput = '';
  const setUserInput = (input) => (userInput = input);

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <FilterInput
          selection={selection}
          userInput={userInput}
          setUserInput={setUserInput}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
