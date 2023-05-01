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
            const result = await axios.post('/api/addProject', {
                project: newProject
            });
            setProjects(result.data.projects);
        }
    }

    async function deleteProject(id) {
        const result = await axios.post('/api/deleteProject', id);
        setProjects(result.data.projects);
    }

    return (
        <div class="max-w-4x1 mx-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">ID</th>
                        <th scope="col" class="px-6 py-3">Projects</th>
                        <th scope="col" class="px-6 py-3">Mon</th>
                        <th scope="col" class="px-6 py-3">Tues</th>
                        <th scope="col" class="px-6 py-3">Wed</th>
                        <th scope="col" class="px-6 py-3">Thur</th>
                        <th scope="col" class="px-6 py-3">Fri</th>
                        <th scope="col" class="px-6 py-3">Sat</th>
                        <th scope="col" class="px-6 py-3">Delete,Edit</th>
                        <th scope="col" class="px-6 py-3">Add</th>
                        <th scope="col" class="px-6 py-3">Total</th>
                    </tr>
                </thead>
                <tbody >
                    <CreateProject onAdd={addProject}
                        project={project}
                        setProject={(project) => setProject(project)} />
                    {projects.map((projectItem) => {
                        return (
                            <Project
                                onDelete={deleteProject}
                                key={projectItem.id}
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