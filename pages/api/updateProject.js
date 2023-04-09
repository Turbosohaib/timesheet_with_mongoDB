import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    const updatedProjectData = req.body.project
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");
        const project = await db
            .collection("project")
            .findOne({}, { id: updatedProjectData.id });

        console.log(project);

        for (const key in updatedProjectData) {
            project[key] = updatedProjectData[key]
        }

        delete project._id

        const updatedProject = await db.collection("project").updateOne({
            "id": project.id
        }, {
            $set: project
        });

        const projects = await db
            .collection("project")
            .find({})
            .toArray();

        res.json({
            project: updatedProject,
            projects
        });
    } catch (e) {
        console.error(e);
    }
};

