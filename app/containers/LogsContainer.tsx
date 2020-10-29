import React, { useState, useEffect } from 'react';
import LogsView from '../components/LogsView.tsx';
import Filter from '../components/Filter.tsx';

const LogsContainer = () => {
  const [sortBy, setSortBy] = useState('');
  //TODO: Align column names across DB and front-end
  const [filterOptions, setFilterOptions] = useState({
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
  });

  return (
    <div className="mx-8" data-tid="container">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <LogsView filterOptions={filterOptions} />
    </div>
  );
};

export default LogsContainer;
