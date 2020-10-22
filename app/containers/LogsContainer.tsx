import React, { useState } from 'react';
import styles from './LogsContainer.css';
import LogsView from '../components/LogsView.tsx';
import Filter from '../components/Filter.tsx';

const LogsContainer = () => {
  const [filterOptions, setFilterOptions] = useState([]);
  return (
    <div className={styles.container} data-tid="container">
      <h2>Logs Container</h2>
      <LogsView filterOptions={filterOptions} />
      <Filter
        filterOptions={filterOptions}
        setFilterOption={setFilterOptions}
      />
    </div>
  );
};

export default LogsContainer;
