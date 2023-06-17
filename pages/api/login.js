import clientPromise from "../../util/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("Projects_timesheet");

        // Retrieve the user based on the provided email
        const findUser = await db.collection("Users").findOne({
            email: req.body.data.email,
        });

        if (findUser) {
            // User found, compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(
                req.body.data.password,
                findUser.password
            );

            if (isPasswordValid) {
                // Passwords match, user is authenticated
                res.json({
                    message: "User login successful.",
                    user: findUser,
                });
            } else {
                // Passwords do not match
                res.json({
                    error: "Invalid email or password.",
                });
            }
        } else {
            // User not found
            res.json({
                error: "Invalid email or password.",
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "An error occurred.",
        });
    }
}
