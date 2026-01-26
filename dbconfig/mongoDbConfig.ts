import mongoose from "mongoose";

export default async function Connect() {
    try {


        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not defined");
        }

        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: "Stationary-web"
        })

        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log("MongoDB database connection established successfully")
        })

        connection.on("error", (err) => {
            console.log("MongoDB connection error: " + err)
        })



    } catch (error: any) {
        console.log("Something Goes Wrong")
        console.log(error)
    }
}