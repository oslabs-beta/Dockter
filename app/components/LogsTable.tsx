import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';
import LogsRows from '../components/LogsRows';
import InfiniteScroll from 'react-infinite-scroll-component';

const LogsTable = ({ filterOptions }) => {
  // const [newLog, setNewLog] = useState({ message: '' });
  const [newLog, setNewLog] = useState({
    _doc: {
      ports: [],
      _id: '',
      message: '',
      container_id: '',
      container_name: '',
      container_image: '',
      timestamp: '',
      stream: '',
      status: '',
    },
  });
  // Contains an array of all the logs that we will render
  const [logs, setLogs] = useState([]);
  const tableBody = useRef(null);

  useEffect(() => {
    // TODO: Look into why logs state doesn't update within this ipc listener
    ipcRenderer.on('newLog', (event, newLog) => {
      setNewLog(newLog);
      // setLogs([newLog, ...logs]);
    });

    ipcRenderer.on('reply-filter', (event, newLogs) => {
      console.log('--------------------newLogs:', newLogs);
      setLogs(newLogs);
    });
  }, []);

  // useEffect(() => {
  //   setLogs([newLog, ...logs]);
  // }, [newLog]);

  // Filter logic
  useEffect(() => {
    ipcRenderer.send('filter', filterOptions);
  }, [filterOptions]);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="flex w-full">
                <tr className="flex w-full">
                  <th className="bg-gray-100 px-6 py-3 w-56 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="bg-gray-100 px-6 py-3 flex-grow bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Log
                  </th>
                  <th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Container ID
                  </th>
                  <th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Host Port
                  </th>
                  <th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Stream
                  </th>
                </tr>
              </thead>
              <tbody
                id="scrollable-table"
                ref={tableBody}
                className="bg-white flex flex-col items-center justify-between divide-y divide-gray-200 overflow-y-scroll"
                style={{ height: '75vh' }}
              >
                 
                <InfiniteScroll
                  dataLength={logs.length}
                  next={() => {
                    ipcRenderer.send(
                      'scroll',
                      logs.map((log) => {
                        return log._doc._id;
                      })
                    );
                    ipcRenderer.on('scroll-reply', (event, arg) => {
                      setLogs([...logs, ...arg]);
                    });
                  }}
                  scrollableTarget="scrollable-table"
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                >
                  <LogsRows logs={logs} filterOptions={filterOptions} />
                </InfiniteScroll>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsTable;
