import React, { useState } from 'react';
import CurrentFilters from './CurrentFilters.tsx';

const Filter = (props) => {
  //a piece of local state to render the correct options to filter by
  const [selection, setSelection] = useState('');

  //handles userInput into conditionally rendered input elements
  //userinput changes with each key inputted
  //on submit, sets filter options at the current text input
  const [userInput, setUserInput] = useState('');
  const [fromTimestamp, setFromTimestamp] = useState({ date: '', time: '' });
  const [toTimestamp, setToTimestamp] = useState({ date: '', time: '' });
  const [isOpen, setIsOpen] = useState(false);

  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  //TODO: check if currentTime can/should update constantly (ex: with setTimeout)
  const currentTime = date.getHours() + ':' + date.getMinutes();

  return (
    <div id="filter-container" className="my-8">
      <div id="filter-options">
        <div className="relative inline-block text-left py-1">
          <div>
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setIsOpen((isOpen) => !isOpen)}
              >
                {selection === ''
                  ? 'Filter'
                  : selection
                      .split('_')
                      .map((word) => word[0].toUpperCase() + word.substr(1))
                      .join(' ')}
                {/* <!-- Heroicon name: chevron-down --> */}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              {isOpen && (
                <button
                  className="fixed inset-0 h-full w-full bg-black opacity-0 cursor-default"
                  tabIndex={-1}
                  onClick={() => setIsOpen(false)}
                ></button>
              )}
            </span>
          </div>

          {/* <!--
					Dropdown panel, show/hide based on dropdown state.

					Entering: "transition ease-out duration-100"
					From: "transform opacity-0 scale-95"
					To: "transform opacity-100 scale-100"
					Leaving: "transition ease-in duration-75"
					From: "transform opacity-100 scale-100"
					To: "transform opacity-0 scale-95"
				--> */}

          {isOpen && (
            <div className="origin-top-right absolute left-0 mt-2 py-1 w-56 rounded-md shadow-lg">
              <div className="rounded-md bg-white shadow-xs">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-container_id"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Container ID
                  </a>
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-container_name"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Container Name
                  </a>
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-container_image"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Container Image
                  </a>
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-host_port"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Host Port
                  </a>
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-stream"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Stream
                  </a>
                  <a
                    onClick={(e) => {
                      const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
                      setSelection(val);
                      setIsOpen(false);
                    }}
                    id="filter-timestamp"
                    href="#"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    role="menuitem"
                  >
                    Timestamp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <select
            onChange={(e) => {
              setSelection(e.target.value);
            }}
          >
            <option defaultValue="options">options</option>
            <option value="container_id">container id</option>
            <option value="container_name">name</option>
            <option value="container_image">image</option>
            <option value="status">status</option>
            <option value="stream">stream</option>
            <option value="timestamp">timestamp</option>
            <option value="host_ip">host ip</option>
            <option value="host_port">host port</option>
            <option value="log_level">log level</option>
          </select> */}

        {/* conditionally renders input element for specfic options */}
        {(selection === 'container_id' ||
          selection === 'container_name' ||
          selection === 'container_image' ||
          selection === 'status' ||
          selection === 'host_ip' ||
          selection === 'host_port' ||
          selection === 'log_level') && (
          <form className="w-full max-w-sm inline-block mx-4">
            <div className="flex items-center border rounded-md border-teal-500">
              <input
                id="filter-input"
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder={`Enter a ${selection.replace('_', ' ')}...`}
                aria-label="Full name"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                value={userInput}
              ></input>
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-r"
                type="button"
                onClick={(e) => {
                  e.preventDefault();

                  // TODO: Add proper error handling
                  if (userInput === '') return;

                  if (!props.filterOptions[selection].includes(userInput)) {
                    props.setFilterOptions({
                      ...props.filterOptions,
                      [selection]: [
                        ...props.filterOptions[selection],
                        userInput,
                      ],
                    });
                  }

                  // Clear input field
                  setUserInput('');
                }}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* conditionally renders stream options */}
        {selection === 'stream' && (
          <>
            <div className="inline-block relative w-48">
              {/* className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" */}
              <select
                onChange={(e) => {
                  if (!props.filterOptions.stream.includes(e.target.value)) {
                    props.setFilterOptions({
                      ...props.filterOptions,
                      stream: [...props.filterOptions.stream, e.target.value],
                    });
                  }
                }}
                className="block appearance-none w-full rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:text-gray-500 mx-4 px-4 py-2 pr-8 leading-tight focus:outline-none"
              >
                <option>Select Stream</option>
                <option>stdout</option>
                <option>stderr</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* <select>
              <option defaultValue="options">select stream</option>
              <option value="stdout">stdout</option>
              <option value="stderr">stderr</option>
            </select> */}
          </>
        )}

        {/* conditionally renders timestamp options */}
        {/* TODO: check if there is a better way of implementing a timestamp input, currently very bulky and annoying UX */}
        {selection === 'timestamp' && (
          <div className="inline border rounded-md mx-4 pl-4 py-2">
            <div className="inline pr-2 mr-2 border-r">From:</div>
            <input
              id="from-date-input"
              type="date"
              max={today}
              onChange={(e) =>
                setFromTimestamp({ ...fromTimestamp, date: e.target.value })
              }
            ></input>
            <input
              id="from-time-input"
              type="time"
              max={currentTime}
              onChange={(e) => {
                setFromTimestamp({ ...fromTimestamp, time: e.target.value });
              }}
            ></input>
            <div className="inline pr-2 mr-2 border-r">To:</div>
            <input
              id="to-date-input"
              type="date"
              max={today}
              onChange={(e) =>
                setFromTimestamp({ ...fromTimestamp, date: e.target.value })
              }
            ></input>
            <input
              id="to-time-input"
              type="time"
              max={currentTime}
              onChange={(e) =>
                setToTimestamp({ ...fromTimestamp, time: e.target.value })
              }
            ></input>
            <button
              className="font-bold px-4 ml-2 border-l"
              id="timestamp-submit"
              onClick={() => {
                //TODO: error handling for invalid input (if to is later than from)
                if (
                  fromTimestamp.date &&
                  fromTimestamp.time &&
                  toTimestamp.date &&
                  toTimestamp.time
                ) {
                  const from = fromTimestamp.date + ' ' + fromTimestamp.time;
                  const to = toTimestamp.date + ' ' + toTimestamp.time;
                  props.setFilterOptions({
                    ...props.filterOptions,
                    timestamp: {
                      from: from,
                      to: to,
                    },
                  });
                }
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <CurrentFilters
        filterOptions={props.filterOptions}
        setFilterOptions={props.setFilterOptions}
      />
    </div>
  );
};

export default Filter;
