import React from 'react';

const CurrentFilters = (props) => {
  const buttons = [];
  //TODO: add a remove all filters button

  //iterates over filterOption state
  Object.keys(props.filterOptions).forEach((el) => {
    const option = props.filterOptions[el];

    //at each key check is property is an array
    if (Array.isArray(option) && option.length) {
      //if property is an array, make a button for each selection
      option.forEach((selection, i) => {
        buttons.push(
          <button
            id={selection}
            key={selection + el + i}
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
    if (el === 'timestamp' && option.from) {
      buttons.push(
        <button
          id={el}
          key={el}
          onClick={() => {
            props.setFilterOptions({
              ...props.filterOptions,
              [el]: { from: '', to: '' },
            });
          }}
        >{`From ${option.from} to ${option.to}`}</button>
      );
    }
  });

  return <div id="current-filters-container">{buttons}</div>;
};

export default CurrentFilters;
