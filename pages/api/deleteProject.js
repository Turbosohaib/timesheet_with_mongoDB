import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");
        const project = await db.collection("project").deleteOne(req.body.id);
        res.json({
            project,
        });
    } catch (e) {
        console.error(e)
    }
}