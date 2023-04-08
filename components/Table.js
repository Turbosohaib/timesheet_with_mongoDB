import { useState } from "react";
import CreateProject from "./CreateProject"
import Project from "./Project"
import axios from "axios";

function Table({ projectsData }) {
    const [projects, setProjects] = useState(projectsData)

    const [project, setProject] = useState({
        id: "",
        name: "",
        mon: "",
        tues: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
    })

    async function addProject(newProject,) {

        var dayFillStatus = false;
        for (const key in newProject) {
            if (key != 'name') {
                if (newProject[key] != "") {
                    dayFillStatus = true;
                    break;
                }
            }
        }
        if (newProject.name != "" && dayFillStatus) {
            newProject.id = projects.length + 1;
            const result = await axios.post('/api/manageProject', {
                project: newProject
            });
            console.log(result.data);
            setProjects(result.data.projects);
            // setProjects((prevProject) => {
            //     return [...prevProject, newProject]
            // })
        }
    }

    async function deleteProject(id) {

        const res = await axios.post('/api/deleteProject', id);
        setProjects((prevProjects) => {
            return prevProjects.filter((project, index) => {
                return index + 1 !== id
            })
        })

    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">ID</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Projects</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Mon</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Tues</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Wed</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Thur</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Fri</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Sat</th>
                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Delete & Edit</th>
                        <th scope="col" className="px-4 py-2 font-medium text-gray-900">Add</th>
                        <th scope="col" className="px-4 py-2 font-medium text-gray-900">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    <CreateProject onAdd={addProject}
                        project={project}
                        setProject={(project) => setProject(project)} />
                    {projects.map((projectItem, index) => {
                        return (
                            <Project
                                onDelete={deleteProject}
                                key={index}
                                id={index + 1}
                                project={projectItem}
                                projects={projects}
                                setProjects={(projects) => setProjects(projects)}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Table;