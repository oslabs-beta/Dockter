import React from 'react';
import LiveLogController from './LiveLogController';

const Navbar = ({ filterOptions }) => {
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <LiveLogController filterOptions={filterOptions} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
