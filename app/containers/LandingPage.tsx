import React from 'react';
import LogsContainer from './LogsContainer';
import Navbar from '../components/Navbar';
import { ipcRenderer } from 'electron';

export default function LandingPage() {
  ipcRenderer.send('ready');

  return (
    <>
      <Navbar />
      <LogsContainer />
    </>
  );
}
