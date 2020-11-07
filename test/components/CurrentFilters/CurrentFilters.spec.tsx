import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import CurrentFilters from '../../../app/components/CurrentFilters';

describe('CurrentFilters component', () => {
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

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <CurrentFilters
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
