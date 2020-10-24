import React from 'react';

const CurrentFilters = (props) => {
  const buttons = [];

  //iterates over filterOption state
  Object.keys(props.filterOptions).forEach((el) => {
    const option = props.filterOptions[el];

    //at each key check is property is an array
    if (Array.isArray(option) && option.length) {
      //if property is an array, make a button for each selection
      option.forEach((selection, i) => {
        buttons.push(
          <button
            key={i}
            onClick={() => {
              //if user clicks on button, it will remove the filter from filterOptions
              props.setFilterOptions({
                ...props.filterOptions,
                [el]: option.reduce((acc, element) => {
                  if (element !== selection) {
                    acc.push(element);
                  }
                  return acc;
                }, []),
              });
            }}
          >
            {selection}
          </button>
        );
      });
    }
  });

  return <div id="current-filters-container">{buttons}</div>;
};

export default CurrentFilters;
