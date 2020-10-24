import React, { useState, useEffect } from 'react';
import { ipcMain, ipcRenderer } from 'electron';

export const communicator = (ipcMain) => {
  ipcMain.on('asynchronous message', (e, arg) => {
    console.log(arg);
    e.sender.send('asynchronous-reply', 'pong');
  });
};

export const transponder = (ipcRenderer) => {
  ipcRenderer.on('asynchronous-reply', (e, arg) => {
    console.log(arg);
  });
  ipcRenderer.send('asynchronous-message', 'ping');
};

const LogsView = (props) => {
  const [logs, setLogs] = useState([]);
  // const logList

  const elements = logs.map((ele) => {
    return (
      <li>
        <div>{ele.containerID}</div>
        <div>{ele.logID}</div>
        <div>{ele.timestamp}</div>
        <div>{ele.message}</div>
        <div>{ele.loglevel}</div>
      </li>
    );
  });

  useEffect(() => {
    const response = [
      //dummy data
      {
        logID: 1234,
        containerID: 2345,
        message: 'asdfg',
        timestamp: '1:34',
        loglevel: 'qwert',
      },
      {
        logID: 1235,
        containerID: 2346,
        message: 'asdfg',
        timestamp: '1:34',
        loglevel: 'qwert',
      },
      {
        logID: 1236,
        containerID: 2347,
        message: 'asdfg',
        timestamp: '1:34',
        loglevel: 'qwert',
      },
      //insert data here
    ];
    // const json =  response.json();
    setLogs(response);
  }, []);
  // async function handleView() {
  //   //use ipc renderer
  //   const response = 'asdf';
  //   const json = await response.json();

  //   setLogs(json);
  // }

  console.log(logs);

  //parse through database to get response
  //
  // handleView();
  //invokes handleView
  //receive array of objects
  //Log ID
  //containerID (foreingn key)
  //message
  //timestamp
  //loglevel

  //render simple component within component first
  // const eachLog = ({ text }) => {
  //   return(
  //   <div className='logList'>
  //     Hello World
  //   </div>
  //   )
  // }
  return (
    <div>
      <div className="header">
        <div id="containerID">Container ID</div>
        <div id="logID">Log ID</div>
        <div id="message">Message</div>
        <div id="timestamp">Timestamp</div>
        <div id="loglevel">Log Level</div>
      </div>
      <ul>{elements}</ul>
    </div>
  );
  // return (
  // <div className="renderLogsList">
  //   <li className='logItem'>
  //     {logItem.map((log, i) => (
  //        <eachLog
  //        key={i}
  //        id={log.id}
  //        containerID={log.containerID}
  //        message={log.nessage}
  //        timestamp={log.timestamp}
  //        logLevel={log.loglevel}
  //        stream={log.stream}/>
  //     ))}
  //   </li>
  // </div>
  // );
};

export default LogsView;
