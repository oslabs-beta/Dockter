import React, { useMemo } from 'react';
import { useTable } from 'react-table';
// import { ipcMain, ipcRenderer } from 'electron';

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

const COLUMNS = [
  {
    Header: 'Log',
    accessor: 'log',
  },
  {
    Header: 'Stream',
    accessor: 'stream',
  },
  {
    Header: 'Time Stamp',
    accessor: 'time',
  },
  // {
  //   Header: 'Log Message',
  //   accessor: 'message',
  // },
  // {
  //   Header: 'Log Level',
  //   accessor: 'loglevel',
  // },
];

const mockData = [
  //dummy data
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:37.81190074Z"
    },
    {
        "log": "\u003e vue-event-bulletin@1.0.0 start /usr/src/app\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:37.811944818Z"
    },
    {
        "log": "\u003e node server.js\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:37.811948351Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:37.811950421Z"
    },
    {
        "log": "Magic happens on port 8080...\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:37.928162186Z"
    },
    {
        "log": "ERROR: error in /logs: [Error: ENOENT: no such file or directory, open '/var/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983-json.log'] {\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.848211501Z"
    },
    {
        "log": "  errno: -2,\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.84826093Z"
    },
    {
        "log": "  code: 'ENOENT',\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.848265442Z"
    },
    {
        "log": "  syscall: 'open',\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.848268232Z"
    },
    {
        "log": "  path: '/var/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983/76b6918cb65130a38de77f1b5a96b6d416b59e2f4b28226b1b0c2572ec22e983-json.log'\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.848270826Z"
    },
    {
        "log": "}\n",
        "stream": "stdout",
        "time": "2020-10-21T00:27:43.848273644Z"
    },
    {
        "log": "\u001b[0mGET /logs \u001b[0m-\u001b[0m - ms - -\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T00:29:41.076541179Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 5.676 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T00:29:42.319020282Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 1.185 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T00:29:49.350200037Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 0.940 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T00:29:50.1492431Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T01:00:48.596460265Z"
    },
    {
        "log": "\u003e vue-event-bulletin@1.0.0 start /usr/src/app\n",
        "stream": "stdout",
        "time": "2020-10-21T01:00:48.596502294Z"
    },
    {
        "log": "\u003e node server.js\n",
        "stream": "stdout",
        "time": "2020-10-21T01:00:48.596507988Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T01:00:48.596511734Z"
    },
    {
        "log": "Magic happens on port 8080...\n",
        "stream": "stdout",
        "time": "2020-10-21T01:00:48.687758406Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 4.072 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T01:09:40.825863331Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 0.612 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T02:11:53.237246923Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 0.698 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T02:12:20.469316691Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T14:38:05.416645937Z"
    },
    {
        "log": "\u003e vue-event-bulletin@1.0.0 start /usr/src/app\n",
        "stream": "stdout",
        "time": "2020-10-21T14:38:05.416675791Z"
    },
    {
        "log": "\u003e node server.js\n",
        "stream": "stdout",
        "time": "2020-10-21T14:38:05.416679256Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-21T14:38:05.416681734Z"
    },
    {
        "log": "Magic happens on port 8080...\n",
        "stream": "stdout",
        "time": "2020-10-21T14:38:05.56711591Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 4.317 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-21T14:40:35.994679817Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-23T04:26:16.631482532Z"
    },
    {
        "log": "\u003e vue-event-bulletin@1.0.0 start /usr/src/app\n",
        "stream": "stdout",
        "time": "2020-10-23T04:26:16.631611499Z"
    },
    {
        "log": "\u003e node server.js\n",
        "stream": "stdout",
        "time": "2020-10-23T04:26:16.631616231Z"
    },
    {
        "log": "\n",
        "stream": "stdout",
        "time": "2020-10-23T04:26:16.631618769Z"
    },
    {
        "log": "Magic happens on port 8080...\n",
        "stream": "stdout",
        "time": "2020-10-23T04:26:16.750554738Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 11.728 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:30:09.20911617Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 0.934 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:30:40.983202484Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 2.022 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:31:16.326618788Z"
    },
    {
        "log": "\u001b[0mGET / \u001b[32m200\u001b[0m 0.636 ms - 1825\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:31:19.446115029Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 1.796 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:31:43.751107779Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.584 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:37:52.937361989Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.362 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:44:25.81506359Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.382 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:44:48.101537084Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.399 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:48:51.306778794Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 1.571 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:50:31.904090969Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 1.518 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:50:38.808532434Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.337 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:51:31.045184026Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.358 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T04:51:35.357034327Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 1.450 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:02:05.529272117Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.377 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:02:43.88279626Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.466 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:05:18.622326848Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.411 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:05:20.896278116Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 1.438 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:10:40.713442017Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.367 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:11:00.939110453Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.418 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:11:07.562265654Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.406 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:11:16.043428952Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.418 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:29:46.576957107Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.396 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:29:52.156351176Z"
    },
    {
        "log": "\u001b[0mGET /8081 \u001b[33m404\u001b[0m 0.430 ms - 143\u001b[0m\n",
        "stream": "stdout",
        "time": "2020-10-23T05:51:00.713283581Z"
    },

  //insert data here s
];

const LogsView = () => {
  // const [logs, setLogs] = useState([]);
  // const logList
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => mockData, []);

  const tableInstance = useTable({
    columns,
    data,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {
              //gives us access to each column
              headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))
            }
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  // useEffect(() => {
  //   const response = [
  //     //dummy data
  //     {
  //       logID: 1234,
  //       containerID: 2345,
  //       message: 'asdfg',
  //       timestamp: '1:34',
  //       loglevel: 'qwert',
  //     },
  //     {
  //       logID: 1235,
  //       containerID: 2346,
  //       message: 'asdfg',
  //       timestamp: '1:34',
  //       loglevel: 'qwert',
  //     },
  //     {
  //       logID: 1236,
  //       containerID: 2347,
  //       message: 'asdfg',
  //       timestamp: '1:34',
  //       loglevel: 'qwert',
  //     },
  //     //insert data here s
  //   ];
  //   // const json =  response.json();
  //   setLogs(response);
  // }, []);
  // // async function handleView() {
  //   //use ipc renderer
  //   const response = 'asdf';
  //   const json = await response.json();

  //   setLogs(json);
  // }

  // console.log(logs);

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
  // return (
  //   <div>
  //     <table>
  //       <colgroup span="5"></colgroup>
  //       <thead>
  //         <tr>
  //           <th key="1">Container ID</th>
  //           <th key="2">Log ID</th>
  //           <th key="3">Message</th>
  //           <th key="4">Time Stamp</th>
  //           <th key="5">Log Level</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td key="1">{elements}</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // );
};

export default LogsView;
