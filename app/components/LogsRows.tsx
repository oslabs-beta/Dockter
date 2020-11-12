import React from 'react';
import Convert from 'ansi-to-html';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const convert = new Convert();

const LogsRows = ({ logs, filterOptions }) => {
  return logs.map((log, i) => {
    const {
      message,
      container_id,
      container_name,
      container_image,
      timestamp,
      stream,
      status,
      ports,
    } = log._doc;

    // Convert array of ports to a comma diliminated string
    const portsStr = ports
      .map((port) => {
        const { IP, PrivatePort, PublicPort, Type } = port;

        return IP && PrivatePort
          ? `${IP}:${PublicPort} -> ${PrivatePort}/${Type}`
          : `${PrivatePort}/${Type}`;
      })
      .join(', ');

    // Grabbing the keys from filterOptions prop turning into array
    const keys = Object.keys(filterOptions);
    let render = false;

    const filterProps = [];
    keys.forEach((key) => {
      if (key === 'timestamp' && filterOptions[key].to) filterProps.push(key);
      else if (
        filterOptions[key].length !== 0 &&
        key !== 'timestamp' &&
        key !== 'search'
      )
        filterProps.push(key);
    });

    // // Check if a user has set any filterOptions that will exclude the current log
    filterProps.forEach((activeFilter) => {
      let currentOption = filterOptions[activeFilter];

      // Time check:
      // Time has a 'to' and 'from' property
      if (
        activeFilter === 'timestamp' &&
        currentOption.to &&
        currentOption.from
      ) {
        // Turn time type into UNIX time format
        // Slicing to take off milliseconds
        const date = new Date(timestamp.slice(0, 19)).getTime();
        const from = new Date(currentOption.from).getTime();
        const to = new Date(currentOption.to).getTime();

        // Date is from the log
        // 'from' and 'to' is from user input
        if (date > from || date < to) render = true;
      }

      // Line is checking to see if incoming logs apply to certain filter criteria for live rendering
      if (
        currentOption.length &&
        currentOption.includes(log._doc[activeFilter])
      )
        render = true;
    });

    //if there are no active filters, render the row
    if (!filterProps.length) render = true;
    if (!render) return null;

    // Converts ansi escape codes to html styling, then sanitize (XSS), then parse into React component
    const messageWithANSI = message
      ? parse(DOMPurify.sanitize(convert.toHtml(message)))
      : '';

    // TODO: Handle .slice error message
    // TODO: Decide if containerId slice should happen server-side
    return (
      <div key={`log-row-${i}`} className="flex w-full my-px bg-gray-100">
        <div className="px-6 py-4 w-56">
          <div className="text-xs leading-5 text-gray-600">
            {timestamp ? new Date(timestamp).toUTCString() : ''}
          </div>
        </div>
        <div className="px-6 py-4 flex-grow">
          <div className="text-sm leading-5 whitespace-normal text-gray-800">
            {messageWithANSI}
          </div>
        </div>
        <div className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-600">
          {container_id ? container_id.slice(0, 14) : ''}
        </div>
        <div className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-600">
          {container_name ? container_name : ''}
        </div>
        <div className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-600">
          {container_image ? container_image : ''}
        </div>
        <div className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-600">
          {portsStr}
        </div>
        <div className="px-6 py-4 w-1/12">
          <span
            className={
              stream === 'stderr'
                ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
                : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
            }
          >
            {stream ? stream : ''}
          </span>
        </div>
      </div>
    );
  });
};

export default LogsRows;
