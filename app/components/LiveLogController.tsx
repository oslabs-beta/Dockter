import React from 'react';

const LiveLogController = ({ listeningForNewLogs, setListeningForNewLogs }) => {
  return (
    <div className="flex items-center justify-center border-solid border-4 border-black">
      <button
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
        id="remove-all-filters-btn"
        onClick={() => {
          // If true, set to false
          // If false, set to true AND trigger filter logic
          setListeningForNewLogs(!listeningForNewLogs);
        }}
      >
        {listeningForNewLogs ? (
          <i className="fas fa-pause"></i>
        ) : (
          <i className="fas fa-play"></i>
        )}
      </button>
    </div>
  );
};

export default LiveLogController;
