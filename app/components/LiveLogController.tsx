import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const LiveLogController = ({ filterOptions }) => {
  const [collectingLiveLogs, setCollectingLiveLogs] = useState('true');

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-md"
          id="remove-all-filters-btn"
          onClick={() => {
            if (collectingLiveLogs) {
              setCollectingLiveLogs(false);
              ipcRenderer.send('pauseLiveLogs');
            } else {
              setCollectingLiveLogs(true);
              ipcRenderer.send('filter', filterOptions);
              ipcRenderer.send('resumeLiveLogs');
            }
          }}
        >
          {collectingLiveLogs ? (
            <i className="fas fa-pause"></i>
          ) : (
            <i className="fas fa-play"></i>
          )}
        </button>
      </div>
      <div className="flex items-center">
        {collectingLiveLogs ? (
          <>
            <span className="text-gray-400 text-sm">Collecting Live Logs</span>
            <span className="flex h-3 w-3 pl-2 mt-1">
              <span className="animate-ping absolute inline-flex pl-2 h-2 w-2 rounded-full bg-green-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full pl-2 h-2 w-2 bg-green-400"></span>
            </span>
          </>
        ) : (
          <>
            <span className="text-gray-400 text-sm">
              Live Logs Collection Paused
            </span>
            <span className="flex h-3 w-3 pl-2 mt-1">
              <span className="relative inline-flex rounded-full pl-2 h-2 w-2 bg-red-400"></span>
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default LiveLogController;
