import React, { useState } from 'react';
import CurrentFilters from './CurrentFilters.tsx';

const Filter = (props) => {
	//a piece of local state to render the correct options to filter by
	const [selection, setSelection] = useState('');

	//handles userInput into conditionally rendered input elements
	const [userInput, setUserInput] = useState('');
	const [fromTimestamp, setFromTimestamp] = useState({ date: '', time: '' });
	const [toTimestamp, setToTimestamp] = useState({ date: '', time: '' });
	const [isOpen, setIsOpen] = useState(false);

	const date = new Date();
	const today = date.toISOString().slice(0, 10);

	//TODO: check if currentTime can/should update constantly (ex: with setTimeout)
	const currentTime = date.getHours() + ':' + date.getMinutes();

	return (
		<>
			<div className="relative inline-block text-left">
				<div>
					<span className="rounded-md shadow-sm">
						<button
							type="button"
							className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
							id="options-menu"
							aria-haspopup="true"
							aria-expanded="true"
							onClick={() => setIsOpen(isOpen => !isOpen)}
						>
							Options
							{/* <!-- Heroicon name: chevron-down --> */}
							<svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</span>
				</div>

				{/* <!--
					Dropdown panel, show/hide based on dropdown state.

					Entering: "transition ease-out duration-100"
					From: "transform opacity-0 scale-95"
					To: "transform opacity-100 scale-100"
					Leaving: "transition ease-in duration-75"
					From: "transform opacity-100 scale-100"
					To: "transform opacity-0 scale-95"
				--> */}
				{isOpen && <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg">
					<div className="rounded-md bg-white shadow-xs">
						<div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Container ID</a>
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Name</a>
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Image</a>
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Host Port</a>
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Stream</a>
							<a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Timestamp</a>
						</div>
					</div>
				</div>}
			</div>
			<div
				id="filter-container"
				className=""
			>
				<div id="filter-options">
					<select
						onChange={(e) => {
							setSelection(e.target.value);
						}}
					>
						<option defaultValue="options">options</option>
						<option value="containerId">container id</option>
						<option value="name">name</option>
						<option value="image">image</option>
						<option value="status">status</option>
						<option value="stream">stream</option>
						<option value="timestamp">timestamp</option>
						<option value="hostIp">host ip</option>
						<option value="hostPort">host port</option>
						<option value="logLevel">log level</option>
					</select>

					{/* conditionally renders input element for specfic options */}
					{(selection === 'containerId' ||
						selection === 'name' ||
						selection === 'image' ||
						selection === 'status' ||
						selection === 'hostIp' ||
						selection === 'hostPort' ||
						selection === 'logLevel') && (
							<form className="w-full max-w-sm inline-block">
								<div className="flex items-center border-b border-teal-500 py-2">
									<input
										className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Jane Doe" aria-label="Full name"
										onChange={(e) => {
											setUserInput(e.target.value);
										}}
									></input>
									<button
										className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button"
										onClick={() => {
											// TODO: Add proper error handling
											if (userInput === '') return;

											if (!props.filterOptions[selection].includes(userInput)) {
												props.setFilterOptions({
													...props.filterOptions,
													[selection]: [...props.filterOptions[selection], userInput],
												});
											}
										}}
									>
										Submit
									</button>
								</div>
							</form>
					)}

					{/* conditionally renders stream options */}
					{selection === 'stream' && (
						<select
							onChange={(e) => {
								if (!props.filterOptions.stream.includes(e.target.value)) {
									props.setFilterOptions({
										...props.filterOptions,
										stream: [...props.filterOptions.stream, e.target.value],
									});
								}
							}}
						>
							<option defaultValue="options">select stream</option>
							<option value="stdout">stdout</option>
							<option value="stderr">stderr</option>
						</select>
					)}

					{/* conditionally renders timestamp options */}
					{/* TODO: check if there is a better way of implementing a timestamp input, currently very bulky and annoying UX */}
					{selection === 'timestamp' && (
						<span>
							From:
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
							To:
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
								id="timestamp-submit"
								onClick={() => {
									//TODO: error handling for invalid input (if to is later than from)
									if (
										fromTimestamp.date &&
										fromTimestamp.time &&
									toTimestamp.date &&
								toTimestamp.time
									) {
										const from = fromTimestamp.date + ' ' + fromTimestamp.time;
										const to = toTimestamp.date + ' ' + toTimestamp.time;
										props.setFilterOptions({
											...props.filterOptions,
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
						</span>
					)}
				</div>

				<CurrentFilters
					filterOptions={props.filterOptions}
					setFilterOptions={props.setFilterOptions}
				/>
			</div>
		</>
	);
};

export default Filter;
