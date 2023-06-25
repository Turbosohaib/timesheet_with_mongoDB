import { useState, useEffect } from "react";
import axios from "axios";
import { formatTime, unhideCurrentActiveParentChilds } from "../util/commonFunctions";
import { getSession } from "next-auth/react";

export async function getServerSideProps({ req }) {

    // const userSession = await getSession({ req });
    // console.log('session from client side: ', userSession)
    // const result = await axios.post('api/tracktime', userSession)
    // console.log(result);
    return {
        props: {
            userSession
        }
    }
}



export default function Timetracker({ setTasksData, trackTime, setTrackTime, startCounter, startTimer, setStartTimer, projects }) {

    async function handleSubmit() {
        setStartTimer(false);

        var stopTime = Date.now();
        var newEntry = { ...trackTime, stopTime }
        setTrackTime(newEntry);

        const result = await axios.post('api/tracktime', {
            data: newEntry
        })
            .then(response => {
                setTasksData(response.data.tasks);
                setTrackTime({
                    startTime: null,
                    stopTime: null,
                    taskName: null,
                    project: "",
                    seconds: 0
                })
                unhideCurrentActiveParentChilds()
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
        <>
            <div>
                <div>
                    <div className="flex border shadow-lg border-x border-y rounded  max-w-full h-14 bg-white mb-8">
                        <div className="px-2 py-1.5 w-full"><input value={trackTime && trackTime.taskName ? trackTime.taskName : ''} onChange={handleChange} type="text" id="taskName" name="taskName" placeholder="What are you working on?" className="border w-full py-2.5 px-4 text-gray-700 leading-tight placeholder:text-dark-500" />
                        </div>
                        <div className="border-r px-4 py-1.5 h-10 w-22  mt-2">
                            <div className="flex pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <select id="project" name="project" placeholder="Project" className="pointer" onChange={handleChange} value={trackTime.project}>
                                    <option value="" disabled>Project</option>
                                    {projects.map((project) => {
                                        ''
                                        return (<option key={project._id.$oid} value={project._id.$oid}>{project.value}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="border-r w-22 pr-2 mx-2 my-1.5">
                            <button className="px-3 py-2" type="button" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                            </button>
                        </div>
                        <div className="border-r w-22 pr-3 mx-2 my-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-currency-pound" width="35" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M17 18.5a6 6 0 0 1 -5 0a6 6 0 0 0 -5 .5a3 3 0 0 0 2 -2.5v-7.5a4 4 0 0 1 7.45 -2m-2.55 6h-7" />
                            </svg>
                        </div>
                        <div className="my-3 mx-5 text-lg font-bold">
                            {formatTime(trackTime.seconds)}
                        </div>
                        <div className=" h-14 w-24">{!startTimer ? <button type="button" onClick={() => startCounter(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-1.5 my-1.5 py-2 px-6">
                            Start
                        </button> : <button onClick={handleSubmit} type="button" className="bg-red-500 hover:bg-red-700 text-white mx-1.5 my-1.5 font-bold py-2 px-6">
                            Stop
                        </button>}
                        </div>
                        <div>
                            <button className="mr-3 ml-2 my-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="25" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                    </table> */}
                </div>
            </div>
        </>
    )
}
