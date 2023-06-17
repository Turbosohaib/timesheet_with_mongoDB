import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    console.log(req.body)
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");
        const project = await db.collection("project").insertOne(req.body.projectName);
        const projects = await db
            .collection("project")
            .find({})
            .toArray();

        res.json({
            project,
            projects
        });
    } catch (e) {
        console.error(e);
    }
};
