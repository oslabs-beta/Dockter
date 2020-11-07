import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import LogsRows from '../../../app/components/LogsRows';

describe('LogsRows component', () => {
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

  let logs = [];

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(<LogsRows logs={logs} filterOptions={filterOptions} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
