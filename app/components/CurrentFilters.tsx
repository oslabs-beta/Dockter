import React from 'react';

const CurrentFilters = ({ filterOptions, setFilterOptions }) => {
  const buttons = [];

  // Iterates over filterOption state
  Object.keys(filterOptions).forEach((filterCategory) => {
    const option = filterOptions[filterCategory];

    // At each key check is property is an array
    if (Array.isArray(option) && option.length) {
      // If property is an array, make a button for each selection
      option.forEach((selection, i) => {
        buttons.push(
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
            id={selection}
            key={selection + filterCategory + i}
            onClick={() => {
              // If user clicks on button, it will remove the filter from filterOptions
              setFilterOptions({
                ...filterOptions,
                [filterCategory]: option.filter(
                  (element) => element !== selection
                ),
              });
            }}
          >
            {selection}
          </button>
        );
      });
    }
    if (filterCategory === 'timestamp' && option.from) {
      buttons.push(
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
          id={filterCategory}
          key={filterCategory}
          onClick={() => {
            setFilterOptions({
              ...filterOptions,
              [filterCategory]: { from: '', to: '' },
            });
          }}
        >{`From ${option.from} to ${option.to}`}</button>
      );
    }
  });

  const removeAllFilters = () => {
    filterOptions.forEach((filterCategory) => {
      if (filterCategory === 'timestamp') {
        setFilterOptions({
          ...filterOptions,
          [filterCategory]: { from: '', to: '' },
        });
      } else {
        setFilterOptions({
          ...filterOptions,
          [filterCategory]: [],
        });
      }
    });
  };
  return (
    <div id="current-filters-container" className="pt-5">
      {buttons}
      <button
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
        id="remove-all-filters-btn"
        onClick={removeAllFilters}
      >
        Remove all filters
      </button>
    </div>
  );
};

export default CurrentFilters;
