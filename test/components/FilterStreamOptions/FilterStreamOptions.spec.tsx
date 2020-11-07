import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FilterStreamOptions from '../../../app/components/FilterStreamOptions';

describe('FilterStreamOptions component', () => {
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

  const setFilterOptions = (newState) => (filterOptions = newState);

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <FilterStreamOptions
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
