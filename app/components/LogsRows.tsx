import React from 'react';
import Convert from 'ansi-to-html';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const convert = new Convert();

const LogsRows = ({ logs, filterOptions }) => {
  return logs.map((logEntry, i) => {
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
      </tr>
    );
  });
};

export default LogsRows;
