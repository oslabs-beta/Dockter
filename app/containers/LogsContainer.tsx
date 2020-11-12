import React from 'react';
import Utilities from '../components/Utilities';
import LogsTable from '../components/LogsTable.tsx';

const LogsContainer = ({ filterOptions, setFilterOptions }) => {
  return (
    <div className="mx-8" data-tid="container">
      <Utilities
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <LogsTable filterOptions={filterOptions} />
    </div>
  );
};

export default LogsContainer;
