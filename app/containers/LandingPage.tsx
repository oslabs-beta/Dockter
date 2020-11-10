import React from 'react';
import LogsContainer from './LogsContainer';
import Navbar from '../components/Navbar';
// TODO: Investigate where to put IPC Event Emitter for channel ready 
import { ipcRenderer } from 'electron';

export default function LandingPage() {
  ipcRenderer.send('ready');
  ipcRenderer.send('ready-hidden');

  return (
    <>
      <Navbar />
      <LogsContainer />
    </>
  );
}
