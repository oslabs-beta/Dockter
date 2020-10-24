import React, { useState } from 'react';
import CurrentFilters from './CurrentFilters.tsx';

const Filter = (props) => {
  //a piece of local state to render the correct options to filter by
  const [selection, setSelection] = useState('');

  //handles userInput into conditionally rendered input elements
  const [userInput, setUserInput] = useState('');

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
        {selection === 'timestamp' && (
          <span>
            From:
            <input type="time"></input>
            To:
            <input></input>
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
