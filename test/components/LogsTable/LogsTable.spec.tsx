import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import LogsTable from '../../../app/components/LogsTable';

configure({ adapter: new Adapter() });

describe('LogsTable component', () => {
  let wrapper;
  // TODO: change filterOptions to activeFilters
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
});
