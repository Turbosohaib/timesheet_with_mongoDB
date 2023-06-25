import { ObjectId, EJSON } from "bson";
import { calculateTotalSeconds } from '../../util/commonFunctions'
import clientPromise from "../../util/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const userSession = await getServerSession(req, res, authOptions);

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
            .find({ userId: userSession.user.id })
            .toArray());

        res.json({
            task,
            tasks: calculateTotalSeconds(tasks)
        });
    } catch (e) {
        console.error(e)
    }
}