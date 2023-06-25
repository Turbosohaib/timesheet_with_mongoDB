import clientPromise from "../../util/mongodb";
import { calculateTotalSeconds } from '../../util/commonFunctions'
import { EJSON, ObjectId } from "bson";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const userSession = await getServerSession(req, res, authOptions);
    console.log('User session from tracktime api route', userSession);
    try {
        // console.log('session from server side: ', req.body.userId)
        const client = await clientPromise;
        const db = client.db("time-tracker");
        var record = req.body.data;
        record.userId = userSession.user.id;
        if (record._id) {
            const recordId = record._id.$oid;
            delete record._id;
            var task = await db.collection("tasktimemanager").updateOne(
                { _id: new ObjectId(recordId) },
                {
                    $set: record
                }
            );
        } else {
            var task = await db.collection("tasktimemanager").insertOne(record);
        }
        const tasks = EJSON.serialize(await db
            .collection("tasktimemanager")
            .find({ userId: userSession.user.id })
            .toArray());

        res.json({
            task,
            tasks: calculateTotalSeconds(tasks)
        });
    } catch (e) {
        console.error(e);
    }
};