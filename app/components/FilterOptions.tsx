import React from 'react';

const FilterOptions = ({ setSelection, setIsOpen }) => {
  // TODO: this should use the filterOptions defined in LogsContainer.tsx
  const filterOptions = [
    'container_id',
    'container_name',
    'container_image',
    'host_port',
    'stream',
    'timestamp',
  ];

  const filterOptionsAsComponents = filterOptions.map((filter) => {
    // Remove snakecase and capitalize first word of every filter to use as a label
    const str = filter.replace('_', ' ');
    const label = str[0].toUpperCase() + str.substring(1);
    return (
      <a
        onClick={(e) => {
          const val = e.currentTarget.id.match(/(?<=-).*$/g)[0];
          setSelection(val);
          setIsOpen(false);
        }}
        id={`filter-${filter}`}
        href="#"
        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        role="menuitem"
      >
        {label}
      </a>
    );
  });

  return (
    <div className="origin-top-right absolute left-0 mt-2 py-1 w-56 rounded-md shadow-lg">
      <div className="rounded-md bg-white shadow-xs">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {filterOptionsAsComponents}
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
