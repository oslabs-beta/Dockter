import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import LogsTable from '../../../app/components/LogsTable';
import LogsRows from '../../../app/components/LogsRows';

describe('LogsTable component', () => {
  let wrapper;
  // TODO: Change filterOptions to activeFilters
  // TODO: Update to match new schema
  const filterOptions = {
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

  beforeAll(() => {
    wrapper = shallow(<LogsTable filterOptions={filterOptions} />);
  });

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(<LogsTable filterOptions={filterOptions} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have one LogsRows component', () => {
    expect(wrapper.find(LogsRows)).toHaveLength(1);
  });
});
