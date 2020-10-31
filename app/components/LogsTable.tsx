import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';
import LogsRows from '../components/LogsRows';

const LogsView = ({ filterOptions }) => {
  const [newLog, setNewLog] = useState({ message: '' });
  // Contains an array of all the logs that we will render
  const [logs, setLogs] = useState([]);
  const tableBody = useRef(null);

  useEffect(() => {
    // TODO: Look into why logs state doesn't update within this ipc listener
    ipcRenderer.on('shipLog', (event, newLog) => {
      setNewLog(newLog);
    });

    ipcRenderer.on('reply-filter', (event, arg) => {
      setLogs(arg);
    });
  }, []);

  useEffect(() => {
    setLogs([...logs, newLog]);
  }, [newLog]);

  useEffect(() => {
    // TODO: Add error handler for null tableBody
    tableBody.current.scrollTop = tableBody.current.scrollHeight;
  }, [newLog]);

  // Filter logic
  useEffect(() => {
    ipcRenderer.send('filter', filterOptions);
  }, [filterOptions]);

  useEffect(() => {
    // Start scroll at bottom of logs view

    // TODO: Error handler for empty table body
    //TODO: is this code necessary? see line 119
    tableBody.current.scrollTop = tableBody.current.scrollHeight;
  }, [logs]);

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
                ref={tableBody}
                className="bg-white flex flex-col items-center justify-between divide-y divide-gray-200 overflow-y-scroll"
                style={{ height: '75vh' }}
              >
                <LogsRows logs={logs} filterOptions={filterOptions} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsView;
