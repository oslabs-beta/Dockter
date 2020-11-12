import React from 'react';
import LiveLogController from './LiveLogController';

const Navbar = ({ listeningForNewLogs, setListeningForNewLogs }) => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <img
                className="block lg:hidden h-8 w-auto"
                src="./assets/DockterLogoSM.png"
                alt="Dockter logo"
              />
              <img
                className="hidden lg:block h-10 w-auto"
                src="./assets/DockterLogo.png"
                alt="Dockter logo"
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex"></div>
            </div>
          </div>
          <div>
            <LiveLogController
              listeningForNewLogs={listeningForNewLogs}
              setListeningForNewLogs={setListeningForNewLogs}
            />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {listeningForNewLogs ? (
              <>
                <span className="text-gray-400 text-sm">
                  Collecting Live Logs
                </span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
