import React from 'react';

const CurrentFilters = ({ filterOptions, setFilterOptions }) => {
  const buttons = [];
  //TODO: add a remove all filters button

  //iterates over filterOption state
  Object.keys(filterOptions).forEach((el) => {
    const option = filterOptions[el];

    //at each key check is property is an array
    if (Array.isArray(option) && option.length) {
      //if property is an array, make a button for each selection
      option.forEach((selection, i) => {
        buttons.push(
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
            id={selection}
            key={selection + el + i}
            onClick={() => {
              //if user clicks on button, it will remove the filter from filterOptions
              setFilterOptions({
                ...filterOptions,
                [el]: option.filter((element) => element !== selection),
              });
            }}
          >
            {selection}
          </button>
        );
      });
    }
    if (el === 'timestamp' && option.from) {
      buttons.push(
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mx-2 -my-2 rounded-full"
          id={el}
          key={el}
          onClick={() => {
            setFilterOptions({
              ...filterOptions,
              [el]: { from: '', to: '' },
            });
          }}
        >{`From ${option.from} to ${option.to}`}</button>
      );
    }
  });

  return (
    <div id="current-filters-container" className="pt-5">
      {buttons}
    </div>
  );
};

export default CurrentFilters;
