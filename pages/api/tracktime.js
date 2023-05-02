import clientPromise from "../../util/mongodb";
import { EJSON, ObjectId } from "bson";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("time-tracker");
        var record = req.body.data;
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
            .find({})
            .toArray());

        res.json({
            task,
            tasks
        });
    } catch (e) {
        console.error(e);
    }
};