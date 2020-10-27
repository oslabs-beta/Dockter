import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import './LogsView.css';
import { ipcMain, ipcRenderer } from 'electron';

// export const communicator = (ipcMain) => {
//   ipcMain.on('asynchronous message', (e, arg) => {
//     console.log(arg);
//     e.sender.send('asynchronous-reply', 'pong');
//   });
// };

// export const transponder = (ipcRenderer) => {
//   ipcRenderer.on('asynchronous-reply', (e, arg) => {
//     console.log(arg);
//   });
//   ipcRenderer.send('asynchronous-message', 'ping');
// };

//react table;

// const COLUMNS = [
//   {
//     Header: 'Log',
//     accessor: 'log',
//   },
//   {
//     Header: 'Stream',
//     accessor: 'stream',
//   },
//   {
//     Header: 'Time Stamp',
//     accessor: 'time',
//   },
// ];

// const mockData = [
//   //dummy data
//     {
//         "log": "\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:37.81190074Z"
//     },
//     {
//         "log": "\u003e vue-event-bulletin@1.0.0 start /usr/src/app\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:37.811944818Z"
//     },
//     {
//         "log": "\u003e node server.js\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:37.811948351Z"
//     },
//     {
//         "log": "\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:37.811950421Z"
//     },
//     {
//         "log": "Magic happens on port 8080...\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:37.928162186Z"
//     },
//     {
//         "log": "ERROR: error in /logs: [Error: ENOENT: no such file or directory, open '/var/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983-json.log'] {\n",
//         "stream": "stdout",
//         "time": "2020-10-21T00:27:43.848211501Z"
//     },

//   //insert data here s
// ];

// function addData() {
//   let test = {
//     "log": "new data",
//     "stream": "stdout",
//     "time": "1234"
//   }
//   mockData.push(test);
//   console.log(test);
// }

// const LogsView = () => {
//   // const [logs, setLogs] = useState([]);
//   // const logList
//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => mockData, []);

//   const tableInstance = useTable({
//     columns,
//     data,
//   });

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = tableInstance;

//   return (
//     <table {...getTableProps()}>
//       <div>
//         <button onClick={addData}>Add Data</button>
//       </div>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {
//               //gives us access to each column
//               headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//               ))
//             }
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => {
//                 return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );

// };

//without react table

// export const communicator = (ipcMain) => {
//   ipcMain.on('asynchronous message', (e, arg) => {
//     console.log(arg);
//     e.sender.send('asynchronous-reply', 'pong');
//   });
// };
// export const transponder = (ipcRenderer) => {
//   ipcRenderer.on('asynchronous-reply', (e, arg) => {
//     console.log(arg);
//   });
//   ipcRenderer.send('asynchronous-message', 'ping');
// };
const LogsView = (props) => {
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
  ];
  const [logs, setLogs] = useState(response);
  // const logList
  const elements = logs.map((ele) => {
    console.log('map within elements variable')

    return (
      <tr>
        <td>{ele.containerID}</td>
        <td>{ele.logID}</td>
        <td>{ele.timestamp}</td>
        <td>{ele.message}</td>
        <td>{ele.loglevel}</td>
      </tr>
    );
  });

  // useEffect(()=>{
  //   ipcRenderer.send('ready', 'component is ready')
  // }, []);

  useEffect(()=>{
    ipcRenderer.send('filter', props.filterOptions)
  }, [props.filterOptions]);

  useEffect(() => {
    ipcRenderer.send('sort', props.sortOptions)
  }, [props.sortOptions]);



  ipcRenderer.on('shipLog', (event, arg) => {
    setLogs([...logs, arg]);
  });

  ipcRenderer.on('filter', (event, arg) => {
    setLogs(arg);
  })

  ipcRenderer.on('sort', (event, arg) => {
    setLogs(arg);
  });


  // function addDummyData() {
  //   const testData = {
  //     logID: 1,
  //     containerID: 2,
  //     message: 'a',
  //     timestamp: '1:3',
  //     loglevel: 'q',
  //   }
  //   response.push(testData);
  //   // setLogs(response);
  //   setLogs([...logs, ...response]);
  //   console.log(testData);
  //   console.log(response);
  // };

  return (
    <div>
    <table>
      <colgroup span="5"></colgroup>
      <thead>
        <tr>
          <th id="containerID">Container ID</th>
          <th id="logID">Log ID</th>
          <th id="message">Message</th>
          <th id="timestamp">Timestamp</th>
          <th id="loglevel">Log Level</th>
        </tr>
      </thead>
      <tbody>
        {elements}
      </tbody>
    </table>
    </div>
  );
};

export default LogsView;
