import React from 'react';

const FilterInput = ({
  selection,
  userInput,
  setUserInput,
  filterOptions,
  setFilterOptions,
}) => {
  return (
    <form className="w-full max-w-sm inline-block mx-4">
      <div className="flex items-center border rounded-md border-teal-500">
        <input
          id="filter-input"
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder={`Enter a ${selection.replace('_', ' ')}...`}
          aria-label="Full name"
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          value={userInput}
        ></input>
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-r"
          type="button"
          onClick={(e) => {
            e.preventDefault();

            // TODO: Add proper error handling
            if (userInput === '') return;

            if (!filterOptions[selection].includes(userInput)) {
              setFilterOptions({
                ...filterOptions,
                [selection]: [...filterOptions[selection], userInput],
              });
            }

            // Clear input field
            setUserInput('');
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FilterInput;
