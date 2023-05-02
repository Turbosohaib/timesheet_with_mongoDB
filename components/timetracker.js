import { useState, useEffect } from "react";
import axios from "axios";
import formatTime from "../util/commonFunctions";

export default function Timetracker({ setTasksData, trackTime, setTrackTime, startCounter, startTimer, setStartTimer, projects }) {

    async function handleSubmit() {
        // console.log('Stop Timer!');
        setStartTimer(false);

        var stopTime = Date.now();
        var updatedTrackTime = { ...trackTime, stopTime }
        setTrackTime(updatedTrackTime);
        // console.log('Stop Time', stopTime);

        console.log(updatedTrackTime)


        const result = await axios.post('api/tracktime', {
            data: updatedTrackTime
        })
            .then(response => {
                setTasksData(response.data.tasks);
                setTrackTime({

                })
            })
            .catch(error => {
                console.error(error);
            });

        setTrackTime({
            taskName: null,
            project: "",
            startTime: null,
            stopTime: null,
            seconds: 0
        })
    }

    function handleChange(e) {
        const field = e.target.getAttribute("name");
        const value = e.target.value;

        setTrackTime((prevValue) => {
            return {
                ...prevValue,
                [field]: value
            }
        })

    }


    useEffect(() => {
        // console.log(trackTime);
        if (startTimer) {
            const intervalId = setInterval(() => {
                setTrackTime({ ...trackTime, seconds: trackTime.seconds + 1 })
                //setSeconds(seconds => seconds + 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [startTimer, trackTime]);
    return (

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Task Name                  </th>
                    <th scope="col" className="px-6 py-3">
                        Project
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Tag
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                    </th>
                    <th scope="col" className="px-6 py-3">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <input value={trackTime && trackTime.taskName ? trackTime.taskName : ''} onChange={handleChange} type="text" id="taskName" name="taskName" placeholder="What are you working on?" className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none  text-dark-500 placeholder:text-dark-500  " />
                    </th>
                    <td className="px-6 py-4">
                        <select id="project" name="project" onChange={handleChange} value={trackTime.project} className="border border-gray-300 text-dark-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder:text-dark-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>Choose a Project</option>
                            {projects.map((project) => {
                                ''
                                return (<option key={project.id} value={project.id}>{project.name}</option>)
                            })}
                        </select>
                    </td>
                    <td className="px-6 py-4">
                        <div>
                            <button type="button" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-lg font-bold">
                            {formatTime(trackTime.seconds)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        {!startTimer ? <button type="button" onClick={() => startCounter(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Start
                        </button> : <button onClick={handleSubmit} type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Stop
                        </button>}
                    </td>
                    <td className="px-6 py-4">
                    </td>
                </tr>
            </tbody>
        </table>

    )
}
