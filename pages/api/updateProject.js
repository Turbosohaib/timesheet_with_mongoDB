import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    const updatedProjectData = req.body.project
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");
        const project = await db
            .collection("project")
            .findOne({}, { id: updatedProjectData.id });

        console.log(project)

        for (const key in updatedProjectData) {
            project[key] = updatedProjectData[key]
        }

        const updatedProject = await db.collection("project").updateOne({
            "id": project.id
        }, {
            $set: project
        });

        res.json({
            project: updatedProject
        });
    } catch (e) {
        console.error(e);
    }
};

