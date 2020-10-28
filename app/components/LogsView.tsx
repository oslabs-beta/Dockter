import React, { useState, useEffect } from 'react';
import './LogsView.css';
import { ipcRenderer } from 'electron';

const LogsView = (props) => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({});

  const logsToRender = logs.map((logEntry, i) => {
    const { container_id, timestamp, log, stream } = logEntry;
    const keys = Object.keys(props.filterOptions);
    for (let idx = 0; idx < keys.length; idx++) {
      const option = keys[idx];
      let currentOption = props.filterOptions[option];
      if (option === 'timestamp' && currentOption.to && currentOption.from) {
        const date = new Date(timestamp.slice(0, 19)).getTime();
        const from = new Date(currentOption.from).getTime();
        const to = new Date(currentOption.to).getTime();
        if (date < from || date > to) return null;
      }
      if (currentOption.length && !currentOption.includes(logEntry[option]))
        return null;
    }
    return (
      <tr key={`${i}`}>
        <td>{container_id}</td>
        <td>{timestamp}</td>
        <td>{log}</td>
        <td>{stream}</td>
      </tr>
    );
  });

  useEffect(() => {
    ipcRenderer.send('ready', 'component is ready');
  }, []);

  useEffect(() => {
    ipcRenderer.send('filter', props.filterOptions);
  }, [props.filterOptions]);

  useEffect(() => {
    ipcRenderer.on('reply-filter', (event, arg) => {
      setLogs(arg);
    });
  });

  // useEffect(() => {
  //   ipcRenderer.send('sort', props.sortOptions);
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
