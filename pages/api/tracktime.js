import clientPromise from "../../util/mongodb";
import { EJSON } from "bson";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("time-tracker");
        console.log(req.body.data);
        const task = await db.collection("tasktimemanager").insertOne(req.body.data);
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