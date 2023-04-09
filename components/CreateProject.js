import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


function CreateProject({ project, setProject, onAdd }) {


    function handleChange(event) {
        const { name, value } = event.target;

        setProject((prevProject) => {
            return {
                ...prevProject,
                [name]: value
            };
        });
    }

    function onSubmit(event) {
        onAdd(project)
        setProject({
            id: "",
            name: "",
            mon: "",
            tues: "",
            wed: "",
            thur: "",
            fri: "",
            sat: "",
        })
        event.preventDefault();
    }


    return (
        <tr className="hover:bg-gray-50">
            <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                <div className="text-sm">
                    <div className="font-medium text-gray-700">#</div>
                </div>
            </th>
            <td className="px-6 py-4">
                <input type="text" name="name" onChange={handleChange} value={project.name} className="py-1 px-2 w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Name" required />
            </td>
            <td className="px-6 py-4">
                <input type="text" name="mon" onChange={handleChange} value={project.mon} className="py-1 px-2 w-full rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
            </td>
            <td className="px-6 py-4">
                <div className="w-10" >
                    <input type="text" name="tues" onChange={handleChange} value={project.tues} className="py-1 px-2  w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-10" >
                    <input type="text" name="wed" onChange={handleChange} value={project.wed} className="py-1 px-2  w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-10" >
                    <input type="text" name="thur" onChange={handleChange} value={project.thur} className="py-1 px-2  w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-10" >
                    <input type="text" name="fri" onChange={handleChange} value={project.fri} className="py-1 px-2  w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-10" >
                    <input type="text" name="sat" onChange={handleChange} value={project.sat} className="py-1 px-2  w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 w-80" placeholder="0:00" />
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex justify-middle gap-4">


                </div>
            </td>
            <td className="px-6 py-4">
                <span onClick={onSubmit}
                    className="flex justify-middle gap-4 pointer">
                    <AddCircleOutlineIcon />
                </span>
            </td>
            <td className="px-6 py-4">
                <strong>{project.totalNumber}</strong>
            </td>
        </tr>
    );
}


export default CreateProject;