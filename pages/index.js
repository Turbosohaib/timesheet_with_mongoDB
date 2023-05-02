import { useEffect, useState } from "react";
import Timetracker from "../components/timetracker"
import clientPromise from "../util/mongodb"
import formatTime from "../util/commonFunctions";
import { EJSON } from "bson";
import axios from "axios";
import Head from 'next/head'


export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("time-tracker");

  const tasks = EJSON.serialize(await db
    .collection("tasktimemanager")
    .find({})
    .toArray());

  //const projects = [];


  return {
    props: {
      tasks
    }
  }
}





export default function Home({ tasks }) {
  console.log(tasks);
  const [tasksData, setTasksData] = useState(tasks);
  const [startTimer, setStartTimer] = useState(false);
  const [trackTime, setTrackTime] = useState({
    startTime: null,
    stopTime: null,
    taskName: null,
    project: "",
    seconds: 0
  });

  var projects = [
    { id: 1, name: 'Cx' },
    { id: 2, name: 'Ce' },
    { id: 3, name: 'Djb' },
    { id: 4, name: 'Lc' }
  ];

  const startCounter = (resume = false) => {
    console.log('Start Timer!');
    setStartTimer(true);
    if (resume == false) {
      var startTime = Date.now();
      setTrackTime({ ...trackTime, startTime });
      console.log('Start Time', startTime);
    }
  }

  const deleteTask = async (taskId) => {
    const result = await axios.post('/api/deleteTask', { taskId })
      .then((response) => {
        setTasksData(response.data.tasks);
      });
  }

  function renderDate(timestamp = null) {
    if (timestamp) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      });
    } else {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      });
    }
  }



  function formatRecordTime(t) {

    const dateObj = new Date(t);

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  function handleClick(task) {
    startCounter(true);
    setTrackTime(task);
  }

  useEffect(() => {
    console.log('Track time', trackTime)
  }, [trackTime]);

  return (
    <div>
      <Head>
        <link rel="icon" href="/icons8-clock-16.png" />
        <title>{startTimer ? formatTime(trackTime.seconds) + " Time Tracker" : "Task Manager"}</title>
      </Head>
      <div className="relative bg-yellow-50 overflow-hidden max-h-screen">
        <header className="fixed right-0 top-0 left-60 bg-yellow-50 py-3 px-4 h-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <button type="button" className="flex items-center focus:outline-none rounded-lg text-gray-600 hover:text-yellow-600 focus:text-yellow-600 font-semibold p-2 border border-transparent hover:border-yellow-300 focus:border-yellow-300 transition">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-gray-600 text-xs rounded bg-white transition mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                  </span>
                  <span className="text-sm">Archive</span>
                </button>
              </div>
              <div className="text-lg font-bold">
                Time Tracker</div>
              <div>
                <button type="button" className="flex items-center focus:outline-none rounded-lg text-gray-600 hover:text-yellow-600 focus:text-yellow-600 font-semibold p-2 border border-transparent hover:border-yellow-300 focus:border-yellow-300 transition">
                  <span className="text-sm">This week</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-gray-600 text-xs rounded bg-white transition ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <aside className="fixed inset-y-0 left-0 bg-white shadow-md max-h-screen w-60">
          <div className="flex flex-col justify-between h-full">
            <div className="flex-grow">
              <div className="px-4 py-6 text-center border-b">
                <h1 className="text-xl font-bold leading-none"><span className="text-yellow-700">Task Manager</span> App</h1>
              </div>
              <div className="p-4">
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="flex items-center bg-yellow-200 rounded-xl font-bold text-sm text-yellow-900 py-3 px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {startTimer ? formatTime(trackTime.seconds) : "Time Tracker"}
                    </a>
                  </li>
                  <li>
                    <a href="/tasklist" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                      </svg>Task list
                    </a>
                  </li>
                  <li>
                    <a href="/timesheet" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                        <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z" />
                      </svg>Projects
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                        <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      </svg>Tags
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-4">
              <button type="button" className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="" viewBox="0 0 16 16">
                  <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
              </button> <span className="font-bold text-sm ml-2">Logout</span>
            </div>
          </div>
        </aside>

        <main className="ml-60 pt-16 max-h-screen overflow-auto">
          <div className="px-6 py-8">
            <div className="max-w-4x1 mx-auto">
              <Timetracker
                setTasksData={setTasksData}
                trackTime={trackTime}
                setTrackTime={setTrackTime}
                startCounter={(resume) => startCounter(resume)}
                startTimer={startTimer}
                setStartTimer={setStartTimer}
                projects={projects} />
              {tasksData.map((task) => {
                return (
                  <table key={task._id.$oid} className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="sticky px-6 py-3">
                          {renderDate(task.startTime)}
                        </th>
                        <th scope="col" className="sticky px-6 py-3">
                        </th>
                        <th scope="col" className="sticky px-6 py-3">
                        </th>
                        <th scope="col" className="sticky px-6 py-3">
                        </th>
                        <th scope="col" className="sticky py-3">
                        </th>
                        <th scope="col" className="flex sticky py-2">
                          <div className="mt-1.5 mr-1" >Total:</div>
                          <div className="text-lg font-bold">
                            {startTimer ? formatTime(trackTime.seconds) : formatTime(task.seconds)}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td scope="row" className="sticky px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {task.taskName}
                        </td>
                        <td className="sticky font-bold dark:text-white px-6 py-4">
                          <div className="grid grid-rows-1 grid-flow-col gap-4">
                            <div className="col-span-2">
                              {projects.filter((project) => project.id == task.project)
                                .map((filteredProject) => filteredProject.name)}
                            </div>
                          </div>
                        </td>
                        <td className="sticky font-bold dark:text-white py-4">
                          {formatRecordTime(task.startTime)} - {formatRecordTime(task.stopTime)}
                        </td>
                        <td className="sticky py-4">
                          <div className="text-lg font-bold">
                            {formatTime(task.seconds)}
                          </div>
                        </td>
                        <td className="sticky py-4">
                          <a className="pointer" onClick={() => handleClick(task)} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </a>
                        </td>
                        <td className="flex py-4">
                          <a onClick={() => deleteTask(task._id.$oid)} className=" pointer" >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                              xtooltip="tooltip"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </a>
                          <br />
                          <a className="pl-6 pointer" >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                              xtooltip="tooltip"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>);
              })}
            </div>
          </div>
        </main >
      </div>
    </div>
  )
}
