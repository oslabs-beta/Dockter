import React, { useState, useEffect } from 'react';
import './LogsView.css';
import { ipcRenderer } from 'electron';

const LogsView = ({ filterOptions }) => {
  const [newLog, setNewLog] = useState({ message: '' });
  // Contains an array of all the logs that we will render
  const [logs, setLogs] = useState([]);
  const tableBody = useRef(null);

  // TODO: Refactor this into it's own react component
  const logsToRender = logs.map((logEntry, i) => {
    // TODO: Coordinate naming throughout the project
    // TODO: Rename timestamp to time
    const {
      container_id,
      container_name,
      container_image,
      host_port,
      stream,
      time,
      timestamp,
      message,
    } = logEntry;

    // grabbing the keys from filterOptions prop turning into array
    const keys = Object.keys(filterOptions);

    // iterating over keys
    // check if a user has set any filterOptions that will exclude the current log
    for (let idx = 0; idx < keys.length; idx += 1) {
      //option is the key of filterOption
      const option = keys[idx];
      //current option is the value
      let currentOption = filterOptions[option];

      // time check
      // time has a 'to' and 'from' property
      if (option === 'timestamp' && currentOption.to && currentOption.from) {
        // turn time type into UNIX time format
        // slicing to take off milliseconds
        const date = new Date(timestamp.slice(0, 19)).getTime();
        const from = new Date(currentOption.from).getTime();
        const to = new Date(currentOption.to).getTime();

        // date is from the log
        // 'from' and 'to' is from user input
        if (date < from || date > to) return null;
      }

      // TODO: Currently doesn't allow for multiple filter options
      // Line is checking to see if incoming logs apply to certain filter criteria for live rendering
      if (currentOption.length && !currentOption.includes(logEntry[option]))
        return null;
    }

    // TODO: Decide on stripping ansi
    // converts ansi to html styling, sanitize, and then parse into react component
    // insurance against cross site scripting attacks(XSS)
    const logWithAnsi = message
      ? parse(DOMPurify.sanitize(convert.toHtml(message)))
      : '';

    // TODO: Handle .slice error message
    // TODO: Decide if containerId slice should happen server-side
    return (
      <tr key={`log-row-${i}`} className="flex w-full mb-4">
        <td className="px-6 py-4 w-56">
          <div className="text-xs leading-5 text-gray-500">
            {timestamp
              ? new Date(timestamp).toUTCString()
              : time
              ? new Date(time).toUTCString()
              : ''}
          </div>
        </td>
        <td className="px-6 py-4 flex-grow">
          <div className="text-sm leading-5 whitespace-normal text-gray-800">
            {logWithAnsi}
          </div>
        </td>
        <td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
          {container_id ? container_id.slice(0, 14) : ''}
        </td>
        <td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
          {container_name ? container_name : ''}
        </td>
        <td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
          {container_image ? container_image : ''}
        </td>
        <td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
          {host_port ? host_port : ''}
        </td>
        <td className="px-6 py-4 w-1/12">
          <span
            className={
              stream === 'stderr'
                ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
                : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
            }
          >
            {stream ? stream : ''}
          </span>
        </td>
        {/*
						<td className="px-6 py-4 w-1/5">
						<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
						</span>
						</td>
					*/}
      </tr>
    );
  });

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
                  {/* <th className="px-6 py-3 w-1/5 bg-gray-50"></th> */}
                </tr>
              </thead>
              <tbody
                ref={tableBody}
                className="bg-white flex flex-col items-center justify-between divide-y divide-gray-200 overflow-y-scroll"
                style={{ height: '75vh' }}
              >
                {logsToRender}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsView;
