import React from 'react';
import Filter from './Filter';
import LiveLogController from './LiveLogController';
import SearchBar from './SearchBar';

const Utilities = ({
  filterOptions,
  setFilterOptions,
  listeningForNewLogs,
  setListeningForNewLogs,
}) => {
  return (
    <div id="utilities-container" className="flex">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <SearchBar
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <LiveLogController
        listeningForNewLogs={listeningForNewLogs}
        setListeningForNewLogs={setListeningForNewLogs}
      />
    </div>
  );
};

export default Utilities;
