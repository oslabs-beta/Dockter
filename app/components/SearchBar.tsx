import { ipcRenderer } from 'electron';
import React, { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  // const [searchAllowed, setCanSearch] = useState('');

  return (
    <form className="w-full max-w-sm inline-block mx-4">
      <div className="flex items-center border rounded-md border-teal-500">
        <input
          id="search-input"
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder={`Search logs...`}
          aria-label=""
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        ></input>
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-r"
          type="button"
          onClick={() => {
            // setCanSearch((searchAllowed) => !searchAllowed)

            // TODO: Add proper error handling
            if (search === '') return;

            if (search) {
              ipcRenderer.send('search', search);
            }

            // Clear input field
            setSearch('');
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
