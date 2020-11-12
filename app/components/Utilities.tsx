import React from 'react';
import Filter from './Filter';
import LiveLogController from './LiveLogController';
import SearchBar from './SearchBar';

const Utilities = ({ filterOptions, setFilterOptions }) => {
  return (
    <div id="utilities-container" className="flex items-center">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <SearchBar />
    </div>
  );
};

export default Utilities;
