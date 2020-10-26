import React, { useState } from 'react';
import CurrentFilters from './CurrentFilters.tsx';

const Filter = (props) => {
  //a piece of local state to render the correct options to filter by
  const [selection, setSelection] = useState('');

  //handles userInput into conditionally rendered input elements
  const [userInput, setUserInput] = useState('');
  const [fromTimestamp, setFromTimestamp] = useState({ date: '', time: '' });
  const [toTimestamp, setToTimestamp] = useState({ date: '', time: '' });

  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  //TODO: check if currentTime can/should update constantly (ex: with setTimeout)
  const currentTime = date.getHours() + ':' + date.getMinutes();

  return (
    <div id="filter-container">
      <div id="filter-options">
        <select
          onChange={(e) => {
            setSelection(e.target.value);
          }}
        >
          <option defaultValue="options">options</option>
          <option value="containerId">container id</option>
          <option value="name">name</option>
          <option value="image">image</option>
          <option value="status">status</option>
          <option value="stream">stream</option>
          <option value="timestamp">timestamp</option>
          <option value="hostIp">host ip</option>
          <option value="hostPort">host port</option>
          <option value="logLevel">log level</option>
        </select>

        {/* conditionally renders input element for specfic options */}
        {(selection === 'containerId' ||
          selection === 'name' ||
          selection === 'image' ||
          selection === 'status' ||
          selection === 'hostIp' ||
          selection === 'hostPort' ||
          selection === 'logLevel') && (
          <span>
            <input
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            ></input>
            <button
              onClick={() => {
                //add proper error handling
                if (userInput === '') return;

                if (!props.filterOptions[selection].includes(userInput)) {
                  props.setFilterOptions({
                    ...props.filterOptions,
                    [selection]: [...props.filterOptions[selection], userInput],
                  });
                }
              }}
            >
              Submit
            </button>
          </span>
        )}

        {/* conditionally renders stream options */}
        {selection === 'stream' && (
          <select
            onChange={(e) => {
              if (!props.filterOptions.stream.includes(e.target.value)) {
                props.setFilterOptions({
                  ...props.filterOptions,
                  stream: [...props.filterOptions.stream, e.target.value],
                });
              }
            }}
          >
            <option defaultValue="options">select stream</option>
            <option value="stdout">stdout</option>
            <option value="stderr">stderr</option>
          </select>
        )}

        {/* conditionally renders timestamp options */}
        {/* TODO: check if there is a better way of implementing a timestamp input, currently very bulky and annoying UX */}
        {selection === 'timestamp' && (
          <span>
            From:
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
            To:
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
          </span>
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
