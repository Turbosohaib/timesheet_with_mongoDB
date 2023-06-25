import clientPromise from "../util/mongodb"
import { EJSON } from "bson";
import Sidebar from "../components/sidebar";
import { useState } from "react";
import Dropdown from '../components/dropdown';
import Head from 'next/head'
import { formatTime } from "../util/commonFunctions";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";



export async function getServerSideProps(ctx) {

    const userSession = await getServerSession(ctx.req, ctx.res, authOptions);


    const client = await clientPromise;
    const db = client.db("time-tracker");
    const userTasks = EJSON.serialize(await db
        .collection("tasktimemanager")
        .find({ userId: userSession.user.id })
        .toArray());

    const projectDb = client.db("Projects_timesheet");
    const userProjects = EJSON.serialize(await projectDb
        .collection("project")
        .find({ userId: userSession.user.id })
        .toArray());


    return {
        props: {
            tasks: userTasks,
            projects: userProjects,
        }
    }
}



export default function Timesheet({ tasks, projects }) {
    const [projectName, setProjectName] = useState({ value: "" })
    const projectSum = [];

    function sumTimeForProject(project, tasks) {
        let projectTime = 0;
        tasks.forEach(task => {
            if (task.project === project) {
                projectTime += task.seconds;
                if (task.parentTaskId) {
                    projectTime += sumTimeForTask(task, tasks);
                }
            }
        });
        return projectTime;
    }

    function sumTimeForTask(task, tasks) {
        let taskTime = 0;
        tasks.forEach(subtask => {
            if (subtask.parentTaskId === task._id.$oid) {
                taskTime += subtask.seconds;
                taskTime += sumTimeForTask(subtask, tasks);
            }
        });
        return taskTime;
    }

    tasks.forEach(task => {
        var project = projects.filter((project) => task.project == project._id.$oid)[0];
        var checkProject = projectSum.filter((sumProject) => sumProject.id == task.project);
        if (!checkProject.length) {
            projectSum.push({
                id: project._id.$oid,
                name: project.value,
                sum: sumTimeForProject(task.project, tasks)
            });
        }
    });

    function handleChange(e) {
        const value = e.target.value;
        setProjectName((prevItem) => {
            return {
                ...prevItem,
                value: value,
            }
        })

    }

    async function handleSubmit() {
        const result = await axios.post('/api/addProject', { projectName })
        setProjectName({ value: '' });
    }


    return (
        <>
            <Head>
                <link rel="icon" href="/icons8-clock-16.png" />
                <title>Task Manager</title>
            </Head>
            <div>
                <Sidebar />
                <main className="ml-60 pt-16 h-screen bg-amber-100 overflow-auto">
                    <div className="px-6 py-8">
                        <h1 className="text-3xl ml-8 ">Projects</h1>
                        <div className="mt-8 max-w-4x1 mx-auto">
                            <div className="flex border  max-w-full h-14 bg-white mb-8">
                                <div className="px-2 py-1.5 w-full"><input onChange={handleChange} value={projectName.value} className="border w-full py-2.5 px-4 text-gray-700 leading-tight placeholder:text-dark-500" type="text" placeholder="Add Project" />
                                </div>
                                <div className=" h-14 w-24"><button onClick={handleSubmit} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-1 mr-1.5 py-2.5 px-6 border">
                                    Add
                                </button></div>
                            </div>
                            <div className="border font-sans border-neutral-300 max-w-full h-25 bg-slate-50">
                                <div className="border border-b-gray-300 max-w-full h-11 bg-slate-100">
                                    <p className="px-3 py-2">Projects</p>
                                </div>
                                <div className="bg-white flex  uppercase font-sans ">
                                    <div className="px-5 py-2 w-2/4 h-10">
                                        <p >Name</p>
                                    </div>
                                    <div className="w-2/4 h-10">
                                        <p className="px py-2">Tracked</p>
                                    </div>


                                </div>
                            </div>
                            {projectSum.map((project, index) => {
                                return (
                                    <div key={index} className="flex border border-x-fuchsia-200 max-w-full h-16 bg-white">
                                        <div className="pointer border-r px-5 py-5 w-2/4 h-15">
                                            <p>{project.name}</p>
                                        </div>
                                        <div className=" border-r w-2/4 h-15">
                                            <p className="px-5 py-5">{formatTime(project.sum)}</p>
                                        </div>
                                        <div className="px-4 py-3">
                                            <Dropdown />
                                        </div>
                                    </div>
                                );
                            })}


                        </div>
                    </div>
                </main >
            </div >
        </>
    )
}