import { useEffect, useState } from "react";
import Timetracker from "../components/timetracker"
import clientPromise from "../util/mongodb"
import { formatTime, formatRecordTime, calculateTotalSeconds } from "../util/commonFunctions";
import { EJSON } from "bson";
import axios from "axios";
import Head from 'next/head'
import script from 'next/script'
import Sidebar from "../components/sidebar"
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';


export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("time-tracker");

  const tasks = EJSON.serialize(await db
    .collection("tasktimemanager")
    .find({})
    .toArray());

  const serializedTasks = EJSON.serialize(calculateTotalSeconds(tasks));

  return {
    props: {
      tasks: serializedTasks
    }
  }
}

export default function Home({ tasks }) {
  const [children, setChildren] = useState(true)
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
    { id: "Cx", name: 'Cx' },
    { id: "Ce", name: 'Ce' },
    { id: "Djb", name: 'Djb' },
    { id: "Lc", name: 'Lc' }
  ];

  const startCounter = () => {
    setStartTimer(true);
    var startTime = Date.now();
    setTrackTime({ ...trackTime, startTime });
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

  function handleClick(task, isChildTask = false) {
    setStartTimer(true);
    var startTime = Date.now();
    var childTask = {
      parentTaskId: isChildTask ? task.parentTaskId : task._id.$oid,
      taskName: task.taskName,
      project: task.project,
      startTime,
      stopTime: null,
      seconds: 0
    }
    setTrackTime(childTask);
  }


  // function handleSubmit(taskId) {
  //   setEdit((prevId) => {
  //     return {
  //       taskId
  //     }
  //   })
  // }

  useEffect(() => {

  }, [trackTime]);

  return (
    <div>
      <Head>
        <link rel="icon" href="/icons8-clock-16.png" />
        <title>{startTimer ? formatTime(trackTime.seconds) + " Time Tracker" : "Task Manager"}</title>
      </Head>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="/common.js" />
      <div>
        <Sidebar
          startTimer={startTimer}
          trackTime={trackTime}
        />
        <main className="z-0 ml-60 pt-16 h-screen bg-amber-100 overflow-auto">
          <div className="px-6 py-8">
            <div className="max-w-4x1 mx-auto time-track-records">
              <Timetracker
                setTasksData={setTasksData}
                trackTime={trackTime}
                setTrackTime={setTrackTime}
                startCounter={(resume) => startCounter(resume)}
                startTimer={startTimer}
                setStartTimer={setStartTimer}
                projects={projects} />
              {/* <div className="p-4 relative">
                <h2 className="absolute right-6">Week total:</h2>
              </div> */}

              {tasksData.map((task, index) => {
                return (
                  !task.parentTaskId ?
                    <div key={index}>
                      <div className="parent cursor-pointer">
                        <div className="flex w-full border-x border-t h-9 bg-slate-100 mt-5">
                          <div className="px-3 py-2 text-sm text-slate-400 font-sans">
                            {renderDate(task.startTime)}
                          </div>
                          <div className="flex mr-6 px-3 py-2  text-sm text-slate-400 font-sans ml-auto">
                            <div className="mt-1">Total:</div><div className="mx-1.5 text-lg font-medium text-slate-700" >{formatTime(task.totalSeconds)}</div>
                          </div>
                        </div>
                        <div className={`flex ${children ? 'border-b-2' : 'border-b'} border-x  max-w-full h-14 bg-white`}>
                          <div className="w-2/4 flex">
                            <div className="w-72 px-6 py-4  text-base  whitespace-nowrap ">
                              {
                                task.totalCount > 1 ?
                                  <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2 py-1 rounded dark:bg-green-900 dark:text-green-300">
                                    {task.totalCount}
                                  </span> :
                                  ''
                              }
                              {task.taskName}
                            </div>
                            <div className="px-4 py-1.5 h-10 w-22 mt-2">
                              <div className="text-base dark:text-white">
                                {projects.filter((project) => project.id == task.project)
                                  .map((filteredProject) => filteredProject.name)}
                              </div>
                            </div>
                          </div>
                          <div className="flex w-2/4">
                            <div className="border-x w-22 h-10 pr-2 mx-3 my-1.5">
                              <button className="px-3 py-2 ml-1" type="button" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                              </button>
                            </div>
                            <div className="border-r h-10 w-22 pr-3 my-1.5 mx-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-currency-pound mt-1.5" width="32" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M17 18.5a6 6 0 0 1 -5 0a6 6 0 0 0 -5 .5a3 3 0 0 0 2 -2.5v-7.5a4 4 0 0 1 7.45 -2m-2.55 6h-7" />
                              </svg>
                            </div>
                            <div className="border-r w-22 pr-2 py-2 my-1.5 h-10 text-base dark:text-white ">
                              <div onClick={() => setChildren(!children)} className="pointer flex">
                                <div>{formatRecordTime(task.startTime) + "-"}</div><div>{formatRecordTime(task.stopTime)}</div>
                              </div>
                            </div>
                            <div className="my-3 mx-5 text-lg font-medium text-slate-700">
                              {formatTime(task.seconds)}
                            </div>
                            <div className="noClickZone border-l my-1.5 h-10 w-24">
                              <div className="flex py-2">
                                <a className="mx-3 pointer" onClick={() => handleClick(task)} >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                  </svg>
                                </a>
                                <a onClick={() => deleteTask(task._id.$oid)} className="ml-1 pointer" >
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
                                {/* {edit.taskId == task._id.$oid ? <a className="ml-4">
                              <button type="submit"><DoneOutlineIcon /></button>
                            </a> : */}
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-b-4">
                          {tasksData.map((childTask, index) => {
                            return (
                              childTask.parentTaskId && childTask.parentTaskId == task._id.$oid ?
                                <div key={index} className={`child noClickZone flex bg-gray-50 border-b border-x max-w-full h-14 hidden`}>
                                  <div className="w-2/4 flex cursor-pointer">
                                    <div>

                                    </div>
                                    <div className="w-72 px-6 py-4  text-base  whitespace-nowrap ">{childTask.taskName}</div>
                                    <div className="px-4 py-1.5 h-10 w-22 mt-2">
                                      <div className="text-base dark:text-white">
                                        {projects.filter((project) => project.id == childTask.project)
                                          .map((filteredProject) => filteredProject.name)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-2/4">
                                    <div className="border-x w-22 h-10 pr-2 mx-3 my-1.5">
                                      <button className="px-3 py-2 ml-1" type="button" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="border-r h-10 w-22 pr-3 my-1.5 mx-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-currency-pound mt-1.5" width="32" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M17 18.5a6 6 0 0 1 -5 0a6 6 0 0 0 -5 .5a3 3 0 0 0 2 -2.5v-7.5a4 4 0 0 1 7.45 -2m-2.55 6h-7" />
                                      </svg>
                                    </div>
                                    <div className="border-r w-22 pr-2 py-2 my-1.5 h-10 text-base dark:text-white ">
                                      <div className="flex">
                                        <div>{formatRecordTime(childTask.startTime) + "-"}</div><div>{formatRecordTime(childTask.stopTime)}</div>
                                      </div>
                                    </div>
                                    <div className="my-3 mx-5 text-lg font-medium text-slate-700">
                                      {formatTime(childTask.seconds)}
                                    </div>
                                    <div className="noClickZone border-l my-1.5 h-10 w-24">
                                      <div className="flex py-2">
                                        <a className="mx-3 pointer" onClick={() => handleClick(childTask, true)} >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                          </svg>
                                        </a>
                                        <a onClick={() => deleteTask(childTask._id.$oid)} className="ml-1 pointer" >
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
                                        {/* {edit.taskId == task._id.$oid ? <a className="ml-4">
                              <button type="submit"><DoneOutlineIcon /></button>
                            </a> : */}
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
                                      </div>
                                    </div>
                                  </div>
                                </div> : ''
                            )
                          })}
                        </div>
                      </div>
                    </div> : '');
              })}
            </div>
          </div>
        </main>
      </div >
    </div >
  )
}


















