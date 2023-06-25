import clientPromise from "../../util/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";


export default async function handler(req, res) {
    const userSession = await getServerSession(req, res, authOptions);
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");
        var projectName = req.body.projectName;
        projectName.userId = userSession.user.id;
        const project = await db.collection("project").insertOne(projectName);
        const projects = await db
            .collection("project")
            .find({ userId: userSession.user.id })
            .toArray();

        res.json({
            project,
            projects
        });
    } catch (e) {
        console.error(e);
    }
};
