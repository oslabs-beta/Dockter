import React from 'react';

const FilterTimeOptions = ({
  filterOptions,
  setFilterOptions,
  fromTimestamp,
  setFromTimestamp,
  toTimestamp,
  setToTimestamp,
}) => {
  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  // TODO: Check if currentTime can/should update constantly (ex: with setTimeout)
  const currentTime = date.getHours() + ':' + date.getMinutes();

  return (
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
          // TODO: Error handling for invalid input (if to is later than from)
          // TODO: Give user an alert if they input a toTimestamp variable that is later than 'now'
          if (
            fromTimestamp.date &&
            fromTimestamp.time &&
            toTimestamp.date &&
            toTimestamp.time
          ) {
            const from = fromTimestamp.date + ' ' + fromTimestamp.time;
            const to = toTimestamp.date + ' ' + toTimestamp.time;
            setFilterOptions({
              ...filterOptions,
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
  );
};

export default FilterTimeOptions;
