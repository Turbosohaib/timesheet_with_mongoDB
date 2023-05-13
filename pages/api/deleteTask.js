import { ObjectId, EJSON } from "bson";
import { calculateTotalSeconds } from '../../util/commonFunctions'
import clientPromise from "../../util/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("time-tracker");

        const task = await db.collection("tasktimemanager").deleteMany(
            {
                $or: [
                    { _id: new ObjectId(req.body.taskId) },
                    { parentTaskId: req.body.taskId }
                ]
            });

        const tasks = EJSON.serialize(await db
            .collection("tasktimemanager")
            .find({})
            .toArray());

        res.json({
            task,
            tasks: calculateTotalSeconds(tasks)
        });
    } catch (e) {
        console.error(e)
    }
}