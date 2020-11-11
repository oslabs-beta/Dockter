import React, { useState, useEffect } from 'react';
import LogsTable from '../components/LogsTable.tsx';
import Filter from '../components/Filter.tsx';
import SearchBar from '../components/SearchBar.tsx';

const LogsContainer = () => {
  const [sortBy, setSortBy] = useState('');
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
      <SearchBar />
      <LogsTable filterOptions={filterOptions} />
    </div>
  );
};

export default LogsContainer;
