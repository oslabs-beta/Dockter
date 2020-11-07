import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import CurrentFilters from '../../../app/components/CurrentFilters';

describe('CurrentFilters component', () => {
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

  it('should match exact snapshot', () => {
    //   // TODO: Implement hook test
    // const tree = renderer
    //   .create(<CurrentFilters filterOptions={filterOptions} />)
    //   .toJSON();
    // expect(tree).toMatchSnapshot();
  });
});
