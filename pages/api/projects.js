import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");

        const project = await db
            .collection("project")
            .find({})
            // .sort({ metacritic: -1 })
            // .limit(1)
            .toArray();

        res.json(project);
    } catch (e) {
        console.error(e);
    }
};

