import React, { useState, useEffect } from 'react';
import Utilities from '../components/Utilities';
import LogsTable from '../components/LogsTable.tsx';

const LogsContainer = ({ listeningForNewLogs, setListeningForNewLogs }) => {
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
    search: '',
  });

  return (
    <div className="mx-8" data-tid="container">
      <Utilities
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        listeningForNewLogs={listeningForNewLogs}
        setListeningForNewLogs={setListeningForNewLogs}
      />
      <LogsTable
        filterOptions={filterOptions}
        listeningForNewLogs={listeningForNewLogs}
      />
    </div>
  );
};

export default LogsContainer;
