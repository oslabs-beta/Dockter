import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FilterTimeOptions from '../../../app/components/FilterTimeOptions';

describe('FilterTimeOptions component', () => {
  // TODO: Update to match schema
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

  let fromTimeStamp = { date: '', time: '' };
  const setFromTimeStamp = (newTimeStamp) => (fromTimeStamp = newTimeStamp);

  let toTimeStamp = { date: '', time: '' };
  const setToTimeStamp = (newTimeStamp) => (toTimeStamp = newTimeStamp);

  Date.now = jest.fn(() => 1604781916895);

  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <FilterTimeOptions
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          fromTimestamp={fromTimeStamp}
          setFromTimestamp={setFromTimeStamp}
          toTimestamp={toTimeStamp}
          setToTimestamp={setToTimeStamp}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
