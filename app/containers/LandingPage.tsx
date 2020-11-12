import React, { useState } from 'react';
import LogsContainer from './LogsContainer';
import Navbar from '../components/Navbar';
// TODO: Investigate where to put IPC Event Emitter for channel ready
import { ipcRenderer } from 'electron';

export default function LandingPage() {
  ipcRenderer.send('ready');
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
    <>
      <Navbar filterOptions={filterOptions} />
      <LogsContainer
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </>
  );
}
