import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import LogsRows from '../components/LogsRows';
import InfiniteScroll from 'react-infinite-scroll-component';

const LogsTable = ({
  filterOptions,
  listeningForNewLogs,
  setListeningForNewLogs,
}) => {
  const [showScrollToTopBtn, setShowScrollToTopBtn] = useState(false);
  const [scrollForMoreLogs, setScrollForMoreLogs] = useState(true);
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
    ipcRenderer.on('newLog', (event, newLog) => {
      setNewLog(newLog);
    });

    ipcRenderer.on('reply-filter', (event, newLogs) => {
      setLogs(newLogs);
    });

    ipcRenderer.on('search-reply', (event, newLogs) => {
      setLogs(newLogs);
    });
  }, []);

  useEffect(() => {
    if (listeningForNewLogs) setLogs([newLog, ...logs]);
  }, [newLog]);

  // Filter logic
  useEffect(() => {
    ipcRenderer.send('filter', filterOptions);
  }, [filterOptions]);

  return (
    <div className="h-screen75 w-screens">
      <div className="h-full w-full flex flex-col">
        <div className="flex w-full">
          <div className="rounded-tl-lg bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Timestamp
          </div>
          <div className="bg-gray-200 px-6 py-3 w-2/5 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Log
          </div>
          <div className="bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Container ID
          </div>
          <div className="bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Name
          </div>
          <div className="bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Image
          </div>
          <div className="bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Host Port
          </div>
          <div className="rounded-tr-lg bg-gray-200 px-6 py-3 w-1/10 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
            Stream
          </div>
        </div>
        <div
          id="logs-container"
          className="h-full overflow-y-scroll"
          ref={tableBody}
        >
          <InfiniteScroll
            className="w-full"
            dataLength={logs.length}
            next={() => {
              console.log('Infinite scroll requests new logs');
              if (listeningForNewLogs) {
                setListeningForNewLogs(false);
              }

              ipcRenderer.send('scroll', {
                filterOptions,
                nin: logs.map((log) => {
                  return log._doc._id;
                }),
              });
              ipcRenderer.on('scroll-reply', (event, arg) => {
                // Args is either going to be a boolean or a more logs
                // If typeof arg is bool, then we setScrollForMoreLogs(false);
                if (typeof arg === 'boolean') setScrollForMoreLogs(false);
                // Else, we update logs with setLogs
                else setLogs([...logs, ...arg]);
              });
            }}
            scrollThreshold={1}
            scrollableTarget="logs-container"
            hasMore={scrollForMoreLogs}
            loader={<h4>Loading...</h4>}
            endMessage={<h1>Logs are fully loaded</h1>}
            onScroll={() => {
              if (tableBody.current.scrollTop > 20) setShowScrollToTopBtn(true);
              else setShowScrollToTopBtn(false);
            }}
          >
            {useMemo(
              () => (
                <LogsRows logs={logs} filterOptions={filterOptions} />
              ),
              [logs]
            )}
          </InfiniteScroll>
        </div>
        {showScrollToTopBtn && (
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-normal py-2 px-4 mx-2 -my-2 rounded-full absolute right-1/2 bottom-40 transform translate-x-1/2 shadow-md text-sm"
            onClick={() => {
              tableBody.current.scrollTo({
                top: 0,
                behavior: 'auto',
              });
            }}
          >
            <span>Scroll To Top</span>
            <i className="fas fa-arrow-up pl-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default LogsTable;
