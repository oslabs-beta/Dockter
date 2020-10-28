import React, { useState, useEffect } from 'react';
import './LogsView.css';
import { ipcRenderer } from 'electron';

const LogsView = (props) => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({});

  const logsToRender = logs.map((logEntry, i) => {
    const { containerId, time, log, stream } = logEntry;
    return (
      <tr key={`${i}`}>
        <td>{containerId}</td>
        <td>{time}</td>
        <td>{log}</td>
        <td>{stream}</td>
      </tr>
    );
  });

  // useEffect(()=>{
  //   ipcRenderer.send('ready', 'component is ready')
  // }, []);

  // useEffect(()=>{
  //   ipcRenderer.send('filter', props.filterOptions)
  // }, [props.filterOptions]);

  // useEffect(() => {
  //   ipcRenderer.send('sort', props.sortOptions)
  // }, [props.sortOptions]);

  useEffect(() => {
    // This event listener receives every new log as an object
    ipcRenderer.on('shipLog', (event, newLog) => {
      setNewLog(newLog);
    });
  }, []);

  useEffect(() => {
    setLogs([...logs, newLog]);
  }, [newLog]);

  // ipcRenderer.on('filter', (event, arg) => {
  //   setLogs(arg);
  // })

  return (
    <div>
      Add New Log
      <table>
        <colgroup span="5"></colgroup>
        <thead>
          <tr>
            <th id="containerID">Container ID</th>
            <th id="logID">Timestamp</th>
            <th id="message">Message</th>
            <th id="timestamp">Stream</th>
          </tr>
        </thead>
        <tbody>{logsToRender}</tbody>
      </table>
    </div>
  );
};

export default LogsView;
