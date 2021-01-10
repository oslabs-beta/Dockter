import React from 'react';

const FilterStreamOptions = ({ filterOptions, setFilterOptions }) => {
  return (
    <div className="inline-block relative w-48">
      {/* className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" */}
      <select
        onChange={(e) => {
          // TODO: Change 'includes' -- this should now be a set or an object
          // TODO: Once user selects a stream option, the dropdown should clear and reset
          // TODO: 'Select stream' should not create an option bubble
          if (!filterOptions.stream.includes(e.target.value)) {
            setFilterOptions({
              ...filterOptions,
              stream: [...filterOptions.stream, e.target.value],
            });
          }
        }}
        className="block appearance-none rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:text-gray-500 mx-4 px-4 py-2 pr-8 leading-tight focus:outline-none"
      >
        <option>Select Stream</option>
        <option>stdout</option>
        <option>stderr</option>
      </select>
    </div>
  );
};

export default FilterStreamOptions;
