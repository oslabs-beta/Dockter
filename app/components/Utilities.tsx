import React from 'react';
import Filter from './Filter';
import SearchBar from './SearchBar';

const Utilities = ({ filterOptions, setFilterOptions }) => {
  return (
    <div id="utilities-container" className="flex items-center">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <SearchBar
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
};

export default Utilities;
