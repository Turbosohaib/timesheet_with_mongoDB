import React, { useEffect, useState } from "react";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import axios from "axios";


function Project({ onDelete, project, projects, setProjects }) {


    const [editRecords, setEditRecords] = useState({})

    function handleClick() {
        onDelete(project.id)
    }

    function handleEdit(id) {
        setEditRecords((prevID) => {
            return {
                id
            }
        })

    }


    function handleUpdate(e) {
        const { name, value } = e.target;
        setEditRecords((prevProject) => {
            return {
                ...prevProject,
                [name]: value
            }
        });
    }



    async function setUpdate() {
        const result = await axios.post('api/updateProject', {
            project: editRecords
        });
        setProjects(result.data.projects)
        setEditRecords({});
    }

    function calculateTotals(project) {
        var daysArray = [
            'mon',
            'tues',
            'wed',
            'thur',
            'fri',
            'sat'
        ];
        var totals = 0;
        for (var day of daysArray) {
            if (parseFloat(project[day]) > 0) {
                totals = totals + parseFloat(project[day]);
            }
        }
        return totals;
    }


    return (


        <tr className="hover:bg-gray-50">
            <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                <div className="text-sm">
                    <div className="font-medium text-gray-700">{project.id}</div>
                </div>
            </th>

            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="name" onChange={handleUpdate} defaultValue={project.name} className="py-1 px-2 w-100  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Name" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.name}</strong>
                </td>
            )}
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="mon" onChange={handleUpdate} defaultValue={project.mon} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="hr" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.mon}</strong>
                </td>
            )}
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="tues" onChange={handleUpdate} defaultValue={project.tues} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="hr" />
                </td>

            ) : (
                <td className="px-6 py-4">
                    <strong>{project.tues}</strong>
                </td>
            )}
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="wed" onChange={handleUpdate} defaultValue={project.wed} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="hr" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.wed}</strong>
                </td>

            )}
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="thur" onChange={handleUpdate} defaultValue={project.thur} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="hr" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.thur}</strong>
                </td>
            )}
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="fri" onChange={handleUpdate} defaultValue={project.fri} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="hr" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.fri}</strong>
                </td>
            )
            }
            {editRecords.id == project.id ? (
                <td className="px-6 py-4">
                    <input type="text" name="sat" onChange={handleUpdate} defaultValue={project.sat} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="hr" />
                </td>
            ) : (
                <td className="px-6 py-4">
                    <strong>{project.sat}</strong>
                </td>
            )}
            <td className="px-6 py-4">
                <div className="flex justify-middle gap-4">
                    <a onClick={handleClick} className="pointer" >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                            xTooltip="tooltip"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </a>
                    <strong></strong>
                    {editRecords.id == project.id ? <a onClick={setUpdate} className="pointer" >
                        <DoneOutlineIcon />
                    </a> :
                        <a onClick={() => handleEdit(project.id)} className="pointer" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                class="h-6 w-6"
                                xTooltip="tooltip"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                />
                            </svg>
                        </a>}

                </div>
            </td>
            <td className="px-6 py-4">
            </td>
            <td className="px-6 py-4">
                <strong>{calculateTotals(project)}</strong>
            </td>
        </tr>
    );
}

export default Project;