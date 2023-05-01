import { ObjectId, EJSON } from "bson";
import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("time-tracker");
        const task = await db.collection("tasktimemanager").deleteOne(
            { _id: new ObjectId(req.body.taskId) }
        );

        const tasks = EJSON.serialize(await db
            .collection("tasktimemanager")
            .find({})
            .toArray());

        res.json({
            task,
            tasks
        });
    } catch (e) {
        console.error(e)
    }
}