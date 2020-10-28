import React, { useState, useEffect, useRef } from 'react';
import './LogsView.css';
import { ipcRenderer } from 'electron';
import Convert from 'ansi-to-html';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const convert = new Convert();

const LogsView = (props) => {
	const [logs, setLogs] = useState([]);
	const [newLog, setNewLog] = useState({log: ''});
	const tableBody = useRef(null);

	// TODO: Refactor this into it's own react component
	const logsToRender = logs.map((logEntry, i) => {
		const { containerId, containerName, image, hostPort, stream, time, log } = logEntry;

		// TODO: decide on stripping ansi
		const logWithAnsi = log ? parse(DOMPurify.sanitize(convert.toHtml(log))) : '';

		// TODO: handle .slice error message
		// TODO: decide if containerId slice should happen server-side
		return (
			<tr
				key={`log-row-${i}`}
				className="flex w-full mb-4"
			>
				<td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
					{containerId ? containerId.slice(0, 14) : ''}
				</td>
				<td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
					{containerName ? containerName : ''}
				</td>
				<td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
					{image ? image : ''}
				</td>
				<td className="px-6 py-4 w-1/12 whitespace-normal text-sm leading-5 text-gray-500">
					{hostPort ? hostPort : ''}
				</td>
				<td className="px-6 py-4 w-1/12">
					<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
						{stream ? stream : ''}
					</span>
				</td>
				<td className="px-6 py-4 w-1/12">
					<div className="text-sm leading-5 text-gray-500">{time ? new Date(time).toString() : ''}</div>
				</td>
				<td className="px-6 py-4 w-6/12">
					<div className="text-sm leading-5 whitespace-normal text-gray-800">{logWithAnsi}</div>
				</td>
				{/*
				<td className="px-6 py-4 w-1/5">
					<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
					</span>
				</td>
					*/}
			</tr>
		);
	});

	// useEffect(()=>{
	//   ipcRenderer.send('ready', 'component is ready')
	// }, []);

	// useEffect(()=>{
	//   ipcRenderer.send('filter', props.filterOptions)
	// }, [props.filterOptions]);

	// useEffect(() => {
	//   ipcRenderer.send('sort', props.sortOptions)
	// }, [props.sortOptions]);

	useEffect(() => {
		// This event listener receives every new log as an object
		ipcRenderer.on('shipLog', (event, newLog) => {
			setNewLog(newLog);
		});
	}, []);

	useEffect(() => {
		setLogs([...logs, newLog]);
	}, [newLog]);

	useEffect(() => {
		// Start scroll at bottom of logs view

		// TODO: Error handler for empty table body
		tableBody.current.scrollTop = tableBody.current.scrollHeight;
	}, [logs]);

	// ipcRenderer.on('filter', (event, arg) => {
	//   setLogs(arg);
	// })

	return (
		<div className="flex flex-col">
			<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
					<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="flex w-full">
								<tr className="flex w-full">
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Container ID
									</th>
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Image
									</th>
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Host Port
									</th>
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Stream
									</th>
									<th className="bg-gray-100 px-6 py-3 w-1/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Timestamp
									</th>
									<th className="bg-gray-100 px-6 py-3 w-6/12 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
										Log
									</th>
									{/* <th className="px-6 py-3 w-1/5 bg-gray-50"></th> */}
								</tr>
							</thead>
							<tbody
								ref={tableBody}
								className="bg-white flex flex-col items-center justify-between divide-y divide-gray-200 overflow-y-scroll"
								style={{"height": "75vh"}}
							>
								{logsToRender}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogsView;
